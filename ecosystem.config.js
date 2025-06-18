module.exports = {
  apps: [
    {
      name: 'progress-accountants',
      script: 'tsx',
      args: 'server/index.ts',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};