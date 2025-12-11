/**
 * WebRTC ICE Server Configuration
 * 
 * This configuration includes both STUN and TURN servers to ensure
 * reliable peer-to-peer connections even behind restrictive NATs/firewalls.
 * 
 * STUN servers: Help discover public IP addresses
 * TURN servers: Relay traffic when direct P2P connection fails
 */

// Default free TURN servers (limited reliability, use for testing only)
// For production, use your own TURN server or a paid service like Twilio, Xirsys, etc.
const getIceServers = () => {
    // Check for environment variables for custom TURN server
    const turnUrl = import.meta.env.VITE_TURN_URL
    const turnUsername = import.meta.env.VITE_TURN_USERNAME
    const turnCredential = import.meta.env.VITE_TURN_CREDENTIAL

    const iceServers = [
        // Google's public STUN servers
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },

        // Twilio STUN server
        { urls: 'stun:global.stun.twilio.com:3478' },
    ]

    // Add custom TURN server if configured
    if (turnUrl && turnUsername && turnCredential) {
        iceServers.push({
            urls: turnUrl,
            username: turnUsername,
            credential: turnCredential
        })
    } else {
        // Free public TURN servers (use with caution - may be unreliable)
        // These are provided for testing purposes only
        iceServers.push(
            // OpenRelay free TURN server
            {
                urls: 'turn:openrelay.metered.ca:80',
                username: 'openrelayproject',
                credential: 'openrelayproject'
            },
            {
                urls: 'turn:openrelay.metered.ca:443',
                username: 'openrelayproject',
                credential: 'openrelayproject'
            },
            {
                urls: 'turn:openrelay.metered.ca:443?transport=tcp',
                username: 'openrelayproject',
                credential: 'openrelayproject'
            },
            // Metered.ca free TURN server (limited usage)
            {
                urls: 'turn:a.relay.metered.ca:80',
                username: 'e9c4f4c0a8e5c8f8f4c0a8e5',
                credential: 'xevytalk2024'
            },
            {
                urls: 'turn:a.relay.metered.ca:80?transport=tcp',
                username: 'e9c4f4c0a8e5c8f8f4c0a8e5',
                credential: 'xevytalk2024'
            },
            {
                urls: 'turn:a.relay.metered.ca:443',
                username: 'e9c4f4c0a8e5c8f8f4c0a8e5',
                credential: 'xevytalk2024'
            },
            {
                urls: 'turn:a.relay.metered.ca:443?transport=tcp',
                username: 'e9c4f4c0a8e5c8f8f4c0a8e5',
                credential: 'xevytalk2024'
            }
        )
    }

    return iceServers
}

// RTCPeerConnection configuration
export const rtcConfig = {
    iceServers: getIceServers(),
    iceCandidatePoolSize: 10,
    iceTransportPolicy: 'all', // 'all' or 'relay' - use 'relay' to force TURN
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require'
}

// Export individual parts for flexibility
export const iceServers = getIceServers()

export default rtcConfig
