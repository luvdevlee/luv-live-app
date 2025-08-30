module.exports = {
  apps: [
    {
      name: 'luv-app-be',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_file: '.env.production',
      error_file: './logs/pm2-err.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000,
      listen_timeout: 3000,
      // Auto restart if memory usage exceeds 80%
      max_memory_restart: '800M',
      // Graceful reload
      wait_ready: true,
      // Health check
      health_check_grace_period: 3000,
      // Log configuration
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Process management
      autorestart: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      // Environment specific settings
      source_map_support: true,
      node_args: ['-r', 'tsconfig-paths/register']
    }
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'https://github.com/your-username/luv-app-be.git',
      path: '/var/www/luv-app-be',
      'post-deploy': 'npm ci --only=production && npm run build && pm2 reload ecosystem.config.js --env production && pm2 save',
      'pre-setup': 'apt update && apt install -y git node npm'
    }
  }
};
