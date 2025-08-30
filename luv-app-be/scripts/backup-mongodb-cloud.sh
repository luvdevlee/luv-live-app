#!/bin/bash

# MongoDB Cloud Backup Guide for Luv App
# Since we're using MongoDB Atlas, this script provides guidance rather than direct backup

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

warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

show_atlas_backup_guide() {
    log "📋 MongoDB Atlas Backup Configuration Guide"
    echo
    
    echo -e "${GREEN}MongoDB Atlas provides automatic backup features:${NC}"
    echo
    echo "1. 🔄 Continuous Backup (Point-in-time Recovery)"
    echo "   - Available for M10+ clusters"
    echo "   - Retains backups for 7 days (can be extended)"
    echo "   - Allows restore to any point in time"
    echo
    echo "2. 📅 Cloud Provider Snapshots"
    echo "   - Available for all cluster tiers"
    echo "   - Daily snapshots retained based on retention policy"
    echo "   - Can be configured in Atlas UI"
    echo
    echo "3. 🎯 On-Demand Snapshots"
    echo "   - Manual snapshots before major deployments"
    echo "   - Custom retention periods"
    echo "   - Can be triggered via Atlas API"
    echo
}

show_backup_configuration() {
    log "⚙️  How to configure backups in MongoDB Atlas:"
    echo
    echo "1. Login to MongoDB Atlas (https://cloud.mongodb.com/)"
    echo "2. Navigate to your cluster"
    echo "3. Go to 'Backup' tab"
    echo "4. Configure backup settings:"
    echo "   - Enable Continuous Backup (recommended for production)"
    echo "   - Set retention period (minimum 7 days)"
    echo "   - Configure snapshot schedule"
    echo "5. Test restore functionality"
    echo
}

show_api_backup_example() {
    log "🔧 API-based backup example (requires Atlas API key):"
    echo
    echo "# Create on-demand snapshot"
    echo "curl --user 'PUBLIC_KEY:PRIVATE_KEY' --digest \\"
    echo "  --header 'Accept: application/json' \\"
    echo "  --header 'Content-Type: application/json' \\"
    echo "  --request POST \\"
    echo "  'https://cloud.mongodb.com/api/atlas/v1.0/groups/{GROUP-ID}/clusters/{CLUSTER-NAME}/backup/snapshots' \\"
    echo "  --data '{"
    echo "    \"description\": \"On-demand backup - $(date)\"," 
    echo "    \"retentionInDays\": 7"
    echo "  }'"
    echo
}

show_monitoring_setup() {
    log "📊 Backup Monitoring Setup:"
    echo
    echo "1. Enable Atlas alerts for backup failures"
    echo "2. Set up email/SMS notifications"
    echo "3. Monitor backup status in Atlas UI"
    echo "4. Configure Slack/webhook integrations if needed"
    echo
    echo "Example alert conditions:"
    echo "- Backup snapshot failed"
    echo "- Continuous backup checkpoint failure"
    echo "- Oplog behind by more than X hours"
    echo
}

show_best_practices() {
    log "✅ Backup Best Practices:"
    echo
    echo "1. 🔐 Security:"
    echo "   - Use strong passwords for Atlas accounts"
    echo "   - Enable 2FA for Atlas access"
    echo "   - Regularly rotate API keys"
    echo
    echo "2. 🧪 Testing:"
    echo "   - Regularly test restore procedures"
    echo "   - Document restore steps"
    echo "   - Practice disaster recovery scenarios"
    echo
    echo "3. 📋 Documentation:"
    echo "   - Document cluster configuration"
    echo "   - Keep connection strings secure"
    echo "   - Maintain inventory of collections and indexes"
    echo
    echo "4. 🔄 Automation:"
    echo "   - Use MongoDB Atlas CLI for automation"
    echo "   - Integrate with CI/CD pipelines"
    echo "   - Set up monitoring and alerting"
    echo
}

show_local_export_option() {
    log "💾 Optional: Export data for local backup:"
    echo
    echo "If you want to create local exports as additional backup:"
    echo
    echo "# Install MongoDB Database Tools"
    echo "wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2004-x86_64-100.7.0.deb"
    echo "sudo dpkg -i mongodb-database-tools-ubuntu2004-x86_64-100.7.0.deb"
    echo
    echo "# Export entire database"
    echo "mongodump --uri='mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/luv-app'"
    echo
    echo "# Export specific collection"
    echo "mongoexport --uri='mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/luv-app' \\"
    echo "  --collection=users --out=users_backup.json"
    echo
    warning "Note: Store connection strings securely and never commit them to version control!"
}

main() {
    echo -e "${BLUE}🌟 MongoDB Atlas Backup Guide for Luv App${NC}"
    echo "=========================================="
    echo
    
    show_atlas_backup_guide
    show_backup_configuration
    show_api_backup_example
    show_monitoring_setup
    show_best_practices
    show_local_export_option
    
    echo
    success "📚 Backup guide completed!"
    echo
    echo -e "${YELLOW}Important Links:${NC}"
    echo "- Atlas Backup Documentation: https://docs.atlas.mongodb.com/backup-overview/"
    echo "- Atlas API Documentation: https://docs.atlas.mongodb.com/api/"
    echo "- MongoDB Database Tools: https://docs.mongodb.com/database-tools/"
    echo
}

# Show help
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "MongoDB Atlas Backup Guide"
    echo ""
    echo "This script provides guidance for configuring backups"
    echo "with MongoDB Atlas (Cloud) instead of local MongoDB."
    echo ""
    echo "Usage: $0"
    echo ""
    exit 0
fi

# Run main function
main
