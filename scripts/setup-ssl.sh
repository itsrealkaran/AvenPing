#!/bin/bash

# SSL Setup Script for WebSocket Server
# This script helps set up SSL certificates with proper permissions

echo "🔐 SSL Certificate Setup for WebSocket Server"
echo "=============================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script needs to be run as root (use sudo)"
    echo "Usage: sudo bash scripts/setup-ssl.sh"
    exit 1
fi

# Default paths
DEFAULT_CERT_PATH="/etc/letsencrypt/live/avenping.com/fullchain.pem"
DEFAULT_KEY_PATH="/etc/letsencrypt/live/avenping.com/privkey.pem"
CERT_DEST="/opt/avenping/ssl/cert.pem"
KEY_DEST="/opt/avenping/ssl/key.pem"

echo "📁 Creating SSL directory..."
mkdir -p /opt/avenping/ssl

echo "🔑 Copying SSL certificates..."
if [ -f "$DEFAULT_CERT_PATH" ] && [ -f "$DEFAULT_KEY_PATH" ]; then
    cp "$DEFAULT_CERT_PATH" "$CERT_DEST"
    cp "$DEFAULT_KEY_PATH" "$KEY_DEST"
    echo "✅ Certificates copied successfully"
else
    echo "❌ Default certificates not found at:"
    echo "   Certificate: $DEFAULT_CERT_PATH"
    echo "   Private Key: $DEFAULT_KEY_PATH"
    echo ""
    echo "Please provide the correct paths:"
    read -p "Certificate path: " CERT_PATH
    read -p "Private key path: " KEY_PATH
    
    if [ -f "$CERT_PATH" ] && [ -f "$KEY_PATH" ]; then
        cp "$CERT_PATH" "$CERT_DEST"
        cp "$KEY_PATH" "$KEY_DEST"
        echo "✅ Certificates copied successfully"
    else
        echo "❌ Invalid certificate paths provided"
        exit 1
    fi
fi

echo "🔒 Setting proper permissions..."
chown -R $SUDO_USER:$SUDO_USER /opt/avenping/ssl
chmod 600 "$KEY_DEST"
chmod 644 "$CERT_DEST"

echo "📝 Updating environment variables..."
# Create or update .env file
cat > .env << EOF
USE_SSL=true
SSL_CERT_PATH=$CERT_DEST
SSL_KEY_PATH=$KEY_DEST
EOF

echo "✅ SSL setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Restart PM2: pm2 restart all"
echo "2. Check logs: pm2 logs avenping-websocket"
echo ""
echo "🔍 To verify SSL setup:"
echo "   - Check certificate: openssl x509 -in $CERT_DEST -text -noout"
echo "   - Test WebSocket: wscat -c wss://avenping.com:3002" 