# TURN Server Configuration Guide

## Overview

This guide explains how to configure TURN servers for your XevyTalk application to ensure reliable call connections, especially when users are behind restrictive NATs or firewalls.

## What are STUN and TURN servers?

### STUN (Session Traversal Utilities for NAT)
- Helps clients discover their public IP address
- Enables direct peer-to-peer connections when possible
- Free and widely available

### TURN (Traversal Using Relays around NAT)
- Relays media traffic when direct P2P connection fails
- Required when both peers are behind symmetric NATs or restrictive firewalls
- Usually requires authentication and has bandwidth costs

## Current Configuration

The application is now configured with:

1. **Multiple STUN servers** (Google, Twilio) for IP discovery
2. **Free public TURN servers** as fallback (OpenRelay, Metered.ca)
3. **Support for custom TURN servers** via environment variables

## Using Free Public TURN Servers (Current Setup)

The application currently uses these free TURN servers:

### OpenRelay (by Metered.ca)
```javascript
{
  urls: 'turn:openrelay.metered.ca:80',
  username: 'openrelayproject',
  credential: 'openrelayproject'
}
```

**Limitations:**
- Shared by many users
- May have rate limits
- Not guaranteed uptime
- Suitable for testing/development only

## Setting Up Your Own TURN Server (Recommended for Production)

### Option 1: Use a Managed Service

#### Twilio (Recommended)
1. Sign up at https://www.twilio.com/
2. Navigate to Network Traversal Service
3. Get your credentials
4. Add to `.env` file:

```bash
VITE_TURN_URL=turn:global.turn.twilio.com:3478?transport=udp
VITE_TURN_USERNAME=your-twilio-username-from-dashboard
VITE_TURN_CREDENTIAL=your-twilio-credential-from-dashboard
```

**Pricing:** Pay-as-you-go, ~$0.0004 per minute

#### Xirsys
1. Sign up at https://xirsys.com/
2. Create a channel
3. Get your ICE servers list
4. Add to `.env` file:

```bash
VITE_TURN_URL=turn:your-channel.xirsys.com:3478
VITE_TURN_USERNAME=your-xirsys-username
VITE_TURN_CREDENTIAL=your-xirsys-credential
```

**Pricing:** Free tier available, paid plans from $10/month

#### Metered.ca
1. Sign up at https://www.metered.ca/
2. Create an app
3. Get your TURN credentials
4. Add to `.env` file:

```bash
VITE_TURN_URL=turn:a.relay.metered.ca:443
VITE_TURN_USERNAME=your-metered-username
VITE_TURN_CREDENTIAL=your-metered-credential
```

**Pricing:** Free tier: 50GB/month, paid plans from $29/month

### Option 2: Host Your Own TURN Server (CoTURN)

#### Installation on Ubuntu/Debian

1. **Install CoTURN:**
```bash
sudo apt-get update
sudo apt-get install coturn
```

2. **Edit configuration** (`/etc/turnserver.conf`):
```bash
# Basic configuration
listening-port=3478
tls-listening-port=5349

# External IP (your server's public IP)
external-ip=YOUR_SERVER_PUBLIC_IP

# Relay IP (usually same as external IP)
relay-ip=YOUR_SERVER_PUBLIC_IP

# Realm (your domain)
realm=yourdomain.com

# Authentication
lt-cred-mech
user=username:password

# Logging
verbose
log-file=/var/log/turnserver.log

# Security
fingerprint
no-multicast-peers
```

3. **Enable and start the service:**
```bash
sudo systemctl enable coturn
sudo systemctl start coturn
```

4. **Configure firewall:**
```bash
sudo ufw allow 3478/tcp
sudo ufw allow 3478/udp
sudo ufw allow 5349/tcp
sudo ufw allow 5349/udp
sudo ufw allow 49152:65535/udp  # Media relay ports
```

5. **Add to your `.env` file:**
```bash
VITE_TURN_URL=turn:yourdomain.com:3478
VITE_TURN_USERNAME=username
VITE_TURN_CREDENTIAL=password
```

## Testing Your TURN Server

### Online Test Tool
Visit https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/

1. Remove default servers
2. Add your TURN server configuration
3. Click "Gather candidates"
4. Look for candidates with type "relay" - this confirms TURN is working

### Command Line Test
```bash
# Install turnutils
sudo apt-get install coturn-utils

# Test your TURN server
turnutils_uclient -v -u username -w password your-turn-server.com
```

## Environment Variables Reference

Create a `.env` file in the `client` directory:

```bash
# Required
VITE_API_URL=http://localhost:4000

# Optional - Custom TURN Server
VITE_TURN_URL=turn:your-turn-server.com:3478
VITE_TURN_USERNAME=your-username
VITE_TURN_CREDENTIAL=your-password
```

**Note:** After changing `.env` file, restart your development server:
```bash
npm run dev
```

## Troubleshooting

### Calls still not connecting?

1. **Check browser console** for WebRTC errors:
   - Open DevTools (F12)
   - Look for ICE connection failures
   - Check if relay candidates are being gathered

2. **Verify TURN server is accessible:**
   ```bash
   telnet your-turn-server.com 3478
   ```

3. **Check firewall rules:**
   - Ensure UDP ports 49152-65535 are open
   - Ensure TCP/UDP port 3478 is open
   - For TLS: ensure TCP port 5349 is open

4. **Test with different transport protocols:**
   ```bash
   # UDP (default, fastest)
   VITE_TURN_URL=turn:server.com:3478?transport=udp
   
   # TCP (more reliable through firewalls)
   VITE_TURN_URL=turn:server.com:3478?transport=tcp
   
   # TLS (most secure, works through most firewalls)
   VITE_TURN_URL=turns:server.com:5349?transport=tcp
   ```

5. **Force TURN usage** (for testing):
   Edit `iceConfig.js` and change:
   ```javascript
   iceTransportPolicy: 'relay'  // Forces all traffic through TURN
   ```

## Cost Estimation

### Managed Services (Monthly)
- **Twilio:** ~$10-50 for small team (based on usage)
- **Xirsys:** $10-30 for small team
- **Metered.ca:** Free tier sufficient for testing, $29+ for production

### Self-Hosted
- **VPS:** $5-20/month (DigitalOcean, Linode, AWS)
- **Bandwidth:** Usually included in VPS plan
- **Maintenance:** Your time

## Best Practices

1. **Use multiple TURN servers** for redundancy
2. **Monitor usage** to avoid unexpected costs
3. **Implement authentication** to prevent abuse
4. **Use TLS** (turns://) for secure connections
5. **Set up monitoring** to detect server issues
6. **Rotate credentials** periodically for security

## Security Considerations

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Implement rate limiting** on your TURN server
4. **Monitor for abuse** (unusual bandwidth usage)
5. **Use strong passwords** for TURN authentication
6. **Consider IP whitelisting** if possible

## Production Checklist

- [ ] Choose a TURN server provider or set up your own
- [ ] Configure environment variables
- [ ] Test call connections from different networks
- [ ] Set up monitoring and alerts
- [ ] Document credentials securely
- [ ] Plan for scaling (bandwidth, concurrent users)
- [ ] Set up backup TURN servers
- [ ] Configure SSL/TLS certificates
- [ ] Test failover scenarios

## Additional Resources

- [WebRTC Glossary](https://webrtc.org/getting-started/overview)
- [CoTURN Documentation](https://github.com/coturn/coturn)
- [Twilio STUN/TURN](https://www.twilio.com/docs/stun-turn)
- [WebRTC Samples](https://webrtc.github.io/samples/)
- [ICE Candidate Types](https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate)

## Support

If you continue to experience connection issues after following this guide:

1. Check the browser console for specific error messages
2. Test with the ICE candidate trickle tool
3. Verify your TURN server is accessible from both peers
4. Consider using a managed service for reliability
