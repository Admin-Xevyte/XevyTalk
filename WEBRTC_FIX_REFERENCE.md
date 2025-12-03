# WebRTC Fix Reference

## Problem Summary
The Chat.jsx file has become corrupted during editing attempts. The main issues were:

1. **SSL Role Conflict**: Both peers trying to create offers simultaneously
2. **Offer Collision**: Invalid state transitions during SDP negotiation  
3. **Boolean Logic Bug**: Condition that was always true
4. **File Corruption**: Multiple failed edit attempts corrupted the socket event handlers

## Solution: Polite/Impolite Peer Pattern

The key fix is implementing the "polite/impolite" peer pattern for WebRTC negotiation.

### Critical Socket Event Handlers (Lines ~585-750)

Replace the corrupted `call_started`, `call_existing_participants`, `call_peer_accepted`, `call_signal`, `call_ended`, and `call_user_left` handlers with this:

```javascript
      s.on('call_started', async (payload) => {
        if (!payload) return
        currentCallRef.current = payload
        setCurrentCall(payload)
        setIsMicOn(true)
        setIsCameraOn(payload.kind === 'video')
        setIsScreenSharing(false)
        await ensureLocalStream(payload.kind)
      })

      s.on('call_existing_participants', async ({ callId, conversationId, userIds }) => {
        if (!callId || !Array.isArray(userIds) || !user?._id) return
        const call = currentCallRef.current || { callId, conversationId, kind: 'audio' }
        await ensureLocalStream(call.kind)
        const myId = String(user._id)
        console.log(`Existing participants for call ${callId}:`, userIds)
        for (const uid of userIds) {
          const peerId = String(uid)
          if (peerId === myId) continue
          const pc = getOrCreatePeerConnection(callId, peerId)
          if (pc.signalingState === 'stable' && localStreamRef.current) {
            setTimeout(() => {
              if (pc.onnegotiationneeded) {
                pc.onnegotiationneeded()
              }
            }, 100)
          }
        }
      })

      s.on('call_peer_accepted', async ({ callId, conversationId, userId }) => {
        if (!callId || !userId || !user?._id) return
        const myId = String(user._id)
        if (String(userId) === myId) return
        const call = currentCallRef.current || { callId, conversationId, kind: 'audio' }
        await ensureLocalStream(call.kind)
        const peerId = String(userId)
        console.log(`Peer ${peerId} accepted call ${callId}`)
        const pc = getOrCreatePeerConnection(callId, peerId)
        if (pc.signalingState === 'stable' && localStreamRef.current) {
          setTimeout(() => {
            if (pc.onnegotiationneeded) {
              pc.onnegotiationneeded()
            }
          }, 100)
        }
      })

      s.on('call_signal', async ({ callId, fromUserId, data }) => {
        if (!callId || !fromUserId || !data) return
        const peerId = String(fromUserId)
        const call = currentCallRef.current || { callId, kind: 'audio' }
        if (!call) return
        await ensureLocalStream(call.kind)
        const pc = getOrCreatePeerConnection(callId, peerId)

        // Polite/impolite peer pattern: lower user ID is "polite"
        const myId = String(user?._id || '')
        const isPolite = myId < peerId

        try {
          if (data.type === 'offer' && data.sdp) {
            console.log(`Received offer from ${peerId}, current state: ${pc.signalingState}, isPolite: ${isPolite}`)
            
            if (pc.signalingState === 'closed') {
              console.warn(`Cannot handle offer, connection closed for ${peerId}`)
              return
            }

            // Offer collision handling
            const offerCollision = pc.signalingState === 'have-local-offer'
            const ignoreOffer = !isPolite && offerCollision

            if (ignoreOffer) {
              console.log(`Ignoring offer from ${peerId} (impolite peer, collision detected)`)
              return
            }

            if (offerCollision) {
              console.log(`Offer collision detected, rolling back local offer (polite peer)`)
              try {
                await pc.setLocalDescription({ type: 'rollback' })
              } catch (e) {
                console.warn('Rollback failed:', e)
                return
              }
            }

            if (pc.signalingState !== 'stable' && pc.signalingState !== 'have-remote-offer') {
              console.warn(`Unexpected signaling state ${pc.signalingState} for offer from ${peerId}`)
              return
            }

            await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: data.sdp }))
            console.log(`Set remote description (offer) for ${peerId}, new state: ${pc.signalingState}`)

            if (pc._flushIceCandidates) {
              await pc._flushIceCandidates()
            }

            if (pc.signalingState !== 'have-remote-offer') {
              console.warn(`Unexpected state after setRemoteDescription: ${pc.signalingState}`)
              return
            }

            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)
            console.log(`Created and set answer for ${peerId}`)
            if (socketRef.current) {
              socketRef.current.emit('call_signal', {
                callId,
                toUserId: peerId,
                data: { type: 'answer', sdp: answer.sdp },
              })
            }
          } else if (data.type === 'answer' && data.sdp) {
            console.log(`Received answer from ${peerId}, current state: ${pc.signalingState}`)
            if (pc.signalingState === 'closed') {
              console.warn(`Cannot handle answer, connection closed for ${peerId}`)
              return
            }
            if (pc.signalingState !== 'have-local-offer') {
              console.warn(`Unexpected state ${pc.signalingState} for answer from ${peerId}`)
              return
            }
            await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: data.sdp }))
            console.log(`Set remote description (answer) for ${peerId}, new state: ${pc.signalingState}`)

            if (pc._flushIceCandidates) {
              await pc._flushIceCandidates()
            }
          } else if (data.candidate) {
            try {
              if (pc.remoteDescription) {
                await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
                console.log(`Added ICE candidate from ${peerId}`)
              } else {
                if (!pc._iceCandidateQueue) {
                  pc._iceCandidateQueue = []
                }
                pc._iceCandidateQueue.push(data.candidate)
                console.log(`Queued ICE candidate from ${peerId} (waiting for remote description)`)
              }
            } catch (e) {
              console.warn('Error adding ICE candidate:', e)
            }
          }
        } catch (e) {
          console.error('Error handling call signal:', e)
        }
      })

      s.on('call_ended', () => {
        cleanupCall()
      })

      s.on('call_user_left', ({ callId, userId }) => {
        if (currentCallRef.current?.callId !== callId) return
        removeRemotePeer(userId)
      })
```

### Also Fix the Negotiation Logic (around line 1080)

Change this line:
```javascript
if (pc.signalingState !== before || pc.signalingState !== 'stable') {
```

To:
```javascript
if (pc.signalingState !== before && pc.signalingState !== 'stable') {
```

## Screen Sharing Fix

The screen sharing error is likely because `getDisplayMedia` needs to be called with proper constraints. Update the screen sharing function to check for support first.

## How to Apply

The file is too corrupted to fix with automated tools. You'll need to:

1. Manually locate the corrupted socket event handlers in Chat.jsx (around lines 585-650)
2. Carefully replace them with the correct versions above
3. Ensure all braces and parentheses match
4. Test the application

## Key Concepts

- **Polite Peer**: Rolls back its offer when collision detected (lower user ID)
- **Impolite Peer**: Ignores incoming offers during collision (higher user ID)
- This prevents both peers from being in conflicting states
