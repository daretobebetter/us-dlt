module.exports = {
  apps: [
    {
      name: 'server',
      script: './server.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      env_dev: {
        NODE_ENV: 'development'
      },
      env_test: {
        NODE_ENV: 'test'
      },
      env_demo: {
        NODE_ENV: 'demo'
      },
      env_preprod: {
        NODE_ENV: 'preprod'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      env_tic: {
        NODE_ENV: 'tic'
      }
    }
  ]

  // deploy : {
  //   production : {
  //     user : 'node',
  //     host : '212.83.163.1',
  //     ref  : 'origin/master',
  //     repo : 'git@github.com:repo.git',
  //     path : '/var/www/production',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
  //   }
  // }
};
