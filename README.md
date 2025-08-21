# E&M Voice Streaming System

A professional 2-way voice streaming system with E&M (Ear & Mouth) signaling for Debian Linux, designed for multi-channel audio communication using USB sound cards.

## Features

- **Multi-Channel Audio Streaming**: Support for simultaneous connections using multiple USB sound cards
- **E&M Signaling**: Industry-standard telecommunications signaling protocol
- **Selective Audio Control**: Listen to multiple connections while talking to specific ones
- **Real-time Audio Monitoring**: Visual audio level meters and connection status
- **Web-based Control Interface**: Modern, responsive control panel
- **Automatic Device Discovery**: USB sound card detection and configuration
- **Connection Management**: Dynamic connection creation and monitoring

## System Requirements

- Debian Linux (tested on Debian 11+)
- Node.js 18+ and npm
- Multiple USB sound cards
- ALSA and PulseAudio
- Network connectivity for remote connections

## Installation

### 1. Clone and Setup

```bash
git clone <repository-url>
cd voice-streaming-system
npm install
```

### 2. Audio System Setup

Run the audio setup script to configure ALSA, PulseAudio, and USB sound cards:

```bash
chmod +x scripts/setup-audio.sh
sudo ./scripts/setup-audio.sh
```

### 3. E&M Signaling Setup

Configure E&M signaling hardware interface:

```bash
chmod +x scripts/em-signaling.sh
sudo ./scripts/em-signaling.sh init
```

### 4. System Service Installation

The setup script automatically creates a systemd service. To enable and start:

```bash
sudo systemctl enable voice-streaming
sudo systemctl start voice-streaming
```

## Usage

### Starting the System

1. **Development Mode**:
   ```bash
   npm run dev
   ```

2. **Production Mode**:
   ```bash
   npm run build
   sudo systemctl start voice-streaming
   ```

### Web Interface

Open your browser and navigate to `http://localhost:5173` (development) or `http://localhost:3001` (production).

### Creating Connections

1. Click "New Connection" in the header
2. Enter a connection name
3. Select an available USB audio device
4. Click "Create" to establish the connection

### Audio Controls

- **Listen**: Toggle audio input from a connection
- **Talk**: Toggle audio output to a connection
- **Volume**: Adjust individual connection volume
- **Master Controls**: Global volume and mute controls

### E&M Signaling

The system automatically handles E&M signaling states:
- **Idle**: No activity on the line
- **Seized**: M-lead raised, initiating connection
- **Answered**: E-lead raised, connection answered
- **Connected**: Both parties connected, audio flowing
- **Disconnected**: Connection terminated

## Configuration

### Audio Device Configuration

Edit `/etc/asound.conf` to customize ALSA configuration for your specific USB sound cards.

### Network Configuration

Modify server configuration in `server/index.js` for custom network settings.

### E&M Signaling Parameters

Adjust signaling parameters in `scripts/em-signaling.sh` based on your hardware requirements.

## Monitoring

### System Status

The web interface provides real-time monitoring of:
- Connection status and count
- Audio device status
- System resource usage
- Audio levels and quality

### Logs

System logs are available at:
- Service logs: `sudo journalctl -u voice-streaming`
- E&M signaling logs: `/var/log/voice-streaming/em-signaling.log`

## Hardware Requirements

### USB Sound Cards

- Multiple USB audio interfaces (tested with USB Audio Class compliant devices)
- Minimum 2-channel input/output per device
- 48kHz sample rate support recommended

### E&M Signaling Interface

- Serial or GPIO interface for E&M lead control
- Optoisolated inputs recommended for E-lead detection
- Relay outputs for M-lead control

## Troubleshooting

### Audio Issues

1. **No Audio Devices Detected**:
   ```bash
   arecord -l  # List recording devices
   aplay -l    # List playback devices
   ```

2. **Permission Issues**:
   ```bash
   sudo usermod -a -G audio $USER
   ```

3. **PulseAudio Problems**:
   ```bash
   pulseaudio --kill
   pulseaudio --start
   ```

### Network Issues

1. **Connection Failed**:
   - Check firewall settings
   - Verify port 3001 is available
   - Check network connectivity

2. **WebSocket Errors**:
   - Restart the service
   - Check server logs

### E&M Signaling Issues

1. **Signaling Not Working**:
   ```bash
   sudo ./scripts/em-signaling.sh status
   ```

2. **Hardware Interface Problems**:
   - Check serial/GPIO connections
   - Verify device permissions
   - Test with multimeter

## Development

### Project Structure

```
├── server/           # Node.js backend
├── src/             # React frontend
│   ├── components/  # UI components
│   ├── hooks/       # Custom hooks
│   └── types/       # TypeScript types
├── scripts/         # System setup scripts
└── docs/           # Documentation
```

### API Endpoints

- **WebSocket Connection**: `ws://localhost:3001`
- **Audio Streaming**: RTP/UDP on dynamic ports
- **E&M Signaling**: Serial/GPIO interface

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For technical support and questions:
- Check the troubleshooting section
- Review system logs
- Submit issues with detailed error information