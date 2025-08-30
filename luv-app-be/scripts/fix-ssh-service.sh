#!/bin/bash

# Quick fix for SSH service name issue on Ubuntu 24.04 LTS
# This script fixes the common "sshd.service not found" error

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

# Check SSH service status
check_ssh_service() {
    log "Checking SSH service status..."
    
    # Check if ssh service exists
    if systemctl list-units --type=service | grep -q "ssh.service"; then
        success "SSH service found as 'ssh.service'"
        systemctl status ssh --no-pager
    elif systemctl list-units --type=service | grep -q "sshd.service"; then
        success "SSH service found as 'sshd.service'"
        systemctl status sshd --no-pager
    else
        error "SSH service not found!"
        exit 1
    fi
}

# Fix SSH service configuration
fix_ssh_config() {
    log "Checking SSH configuration..."
    
    # Test SSH configuration
    if sshd -t; then
        success "SSH configuration is valid"
    else
        error "SSH configuration has errors"
        exit 1
    fi
}

# Restart SSH service with correct name
restart_ssh_service() {
    log "Restarting SSH service..."
    
    # Try ssh first (Ubuntu/Debian standard)
    if systemctl restart ssh; then
        success "SSH service restarted successfully (using 'ssh')"
    elif systemctl restart sshd; then
        success "SSH service restarted successfully (using 'sshd')"
    else
        error "Failed to restart SSH service"
        exit 1
    fi
}

# Check UFW firewall
check_firewall() {
    log "Checking firewall status..."
    
    if command -v ufw >/dev/null 2>&1; then
        ufw status
        
        # Check if SSH is allowed
        if ufw status | grep -q "22"; then
            success "SSH port 22 is allowed in firewall"
        else
            warning "SSH port 22 might not be allowed in firewall"
            log "Consider running: sudo ufw allow ssh"
        fi
    else
        warning "UFW firewall not installed"
    fi
}

# Display service information
show_service_info() {
    log "SSH Service Information:"
    echo
    
    echo "Ubuntu 24.04 LTS SSH Service Details:"
    echo "- Service name: ssh (not sshd)"
    echo "- Configuration file: /etc/ssh/sshd_config"
    echo "- Default port: 22"
    echo "- Log location: /var/log/auth.log"
    echo
    
    echo "Common commands:"
    echo "- Check status: sudo systemctl status ssh"
    echo "- Restart: sudo systemctl restart ssh"
    echo "- Enable: sudo systemctl enable ssh"
    echo "- Test config: sudo sshd -t"
    echo "- View logs: sudo journalctl -u ssh -f"
}

# Main function
main() {
    log "🔧 SSH Service Fix for Ubuntu 24.04 LTS"
    echo "========================================"
    echo
    
    check_ssh_service
    echo
    fix_ssh_config
    echo
    restart_ssh_service
    echo
    check_firewall
    echo
    show_service_info
    
    success "🎉 SSH service check completed!"
    
    echo
    echo -e "${YELLOW}Important Notes:${NC}"
    echo "1. On Ubuntu 24.04, SSH service is named 'ssh' not 'sshd'"
    echo "2. Always test SSH configuration before restarting: sudo sshd -t"
    echo "3. Keep a backup terminal session open when making SSH changes"
    echo "4. If locked out, use VPS console access from DigitalOcean dashboard"
}

# Show help
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "SSH Service Fix Script for Ubuntu 24.04"
    echo ""
    echo "This script diagnoses and fixes common SSH service issues"
    echo "specifically the 'sshd.service not found' error."
    echo ""
    echo "Usage: $0"
    echo ""
    echo "What it does:"
    echo "- Checks SSH service status"
    echo "- Validates SSH configuration"
    echo "- Restarts SSH service with correct name"
    echo "- Checks firewall settings"
    echo "- Provides troubleshooting information"
    echo ""
    exit 0
fi

# Run main function
main
