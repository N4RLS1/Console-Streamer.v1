#!/bin/bash

# E&M Voice Streaming System - Audio Setup Script
# For Debian Linux with USB Sound Cards

echo "Setting up E&M Voice Streaming System..."

# Update system
sudo apt-get update

# Install required audio packages
sudo apt-get install -y \
    alsa-utils \
    pulseaudio \
    pulseaudio-utils \
    pulseaudio-module-jack \
    jack-audio-connection-kit \
    qjackctl \
    sox \
    libsox-fmt-all

# Install development tools
sudo apt-get install -y \
    build-essential \
    cmake \
    pkg-config \
    libasound2-dev \
    libpulse-dev \
    libjack-jackd2-dev

# Configure ALSA for multiple USB devices
sudo tee /etc/asound.conf > /dev/null <<EOF
# ALSA configuration for multiple USB sound cards
pcm.!default {
    type hw
    card 0
}

ctl.!default {
    type hw
    card 0
}

# USB Sound Card 1
pcm.usb0 {
    type hw
    card USB0
}

# USB Sound Card 2
pcm.usb1 {
    type hw
    card USB1
}

# USB Sound Card 3
pcm.usb2 {
    type hw
    card USB2
}

# USB Sound Card 4
pcm.usb3 {
    type hw
    card USB3
}

# Multi-device setup for simultaneous recording
pcm.multi {
    type multi
    slaves.a.pcm "usb0"
    slaves.a.channels 2
    slaves.b.pcm "usb1"
    slaves.b.channels 2
    slaves.c.pcm "usb2"
    slaves.c.channels 2
    slaves.d.pcm "usb3"
    slaves.d.channels 2
    bindings.0.slave a
    bindings.0.channel 0
    bindings.1.slave a
    bindings.1.channel 1
    bindings.2.slave b
    bindings.2.channel 0
    bindings.3.slave b
    bindings.3.channel 1
    bindings.4.slave c
    bindings.4.channel 0
    bindings.5.slave c
    bindings.5.channel 1
    bindings.6.slave d
    bindings.6.channel 0
    bindings.7.slave d
    bindings.7.channel 1
}
EOF

# Create systemd service
sudo tee /etc/systemd/system/voice-streaming.service > /dev/null <<EOF
[Unit]
Description=E&M Voice Streaming Service
After=network.target sound.target

[Service]
Type=simple
User=voicestreaming
Group=audio
WorkingDirectory=/opt/voice-streaming
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
EOF

# Create user for service
sudo useradd -r -s /bin/false -G audio voicestreaming

# Set up directories
sudo mkdir -p /opt/voice-streaming
sudo mkdir -p /var/log/voice-streaming
sudo chown -R voicestreaming:audio /opt/voice-streaming
sudo chown -R voicestreaming:audio /var/log/voice-streaming

# Configure PulseAudio for system mode
sudo tee /etc/pulse/system.pa > /dev/null <<EOF
#!/usr/bin/pulseaudio -nF

# Load modules for USB audio devices
load-module module-udev-detect
load-module module-native-protocol-unix auth-anonymous=1 socket=/tmp/pulse-socket

# Network modules for streaming
load-module module-native-protocol-tcp auth-ip-acl=127.0.0.1;192.168.0.0/16
load-module module-rtp-send source=alsa_input.usb-0 destination=224.0.0.56 port=46998
load-module module-rtp-recv

# Echo cancellation
load-module module-echo-cancel source_name=ec_source sink_name=ec_sink

# Load necessary protocol modules
load-module module-cli-protocol-unix
load-module module-default-device-restore
load-module module-rescue-streams
load-module module-always-sink
load-module module-suspend-on-idle
load-module module-position-event-sounds
EOF

echo "Audio setup complete!"
echo "Please reboot the system to apply all changes."
echo ""
echo "After reboot, run the following to check USB audio devices:"
echo "  arecord -l"
echo "  aplay -l"
echo ""
echo "To start the voice streaming service:"
echo "  sudo systemctl enable voice-streaming"
echo "  sudo systemctl start voice-streaming"