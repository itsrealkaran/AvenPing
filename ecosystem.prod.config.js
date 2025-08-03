module.exports = {
  apps: [
    {
      name: 'avenping-nextjs',
      script: 'npm',
      args: 'start',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/nextjs-error.log',
      out_file: './logs/nextjs-out.log',
      log_file: './logs/nextjs-combined.log',
      time: true
    },
    {
      name: 'avenping-websocket',
      script: 'websocket-server.cjs',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        USE_SSL: process.env.USE_SSL || 'true',
        SSL_CERT_PATH: process.env.SSL_CERT_PATH || '/etc/letsencrypt/live/avenping.com/fullchain.pem',
        SSL_KEY_PATH: process.env.SSL_KEY_PATH || '/etc/letsencrypt/live/avenping.com/privkey.pem'
      },
      error_file: './logs/websocket-error.log',
      out_file: './logs/websocket-out.log',
      log_file: './logs/websocket-combined.log',
      time: true
    }
  ]
}; 