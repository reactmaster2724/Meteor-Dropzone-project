module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: '172.31.0.176',
      username: 'fortress',
      pem: './.ssh/Fortress.pem'

      // password: 'server-password'
      // or neither for authenticate from ssh-agent
    }
  },

  meteor: {
    // TODO: change app name and path
    name: 'app',
    path: '/fortress',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://

      //ROOT_URL: 'http://app.com',
      //MONGO_URL: 'mongodb://localhost/meteor',

      ROOT_URL: 'http://ec2-34-212-243-186.us-west-2.compute.amazonaws.com',
      MONGO_URL: 'mongodb://fortress-dev:ml1Ex5Kids@ds143342.mlab.com:43342/fortress-dev',
    },

    // ssl: { // (optional)
    //   // Enables let's encrypt (optional)
    //   autogenerate: {
    //     email: 'email.address@domain.com',
    //     // comma seperated list of domains
    //     domains: 'website.com,www.website.com'
    //   }
    // },

    docker: {
      // change to 'kadirahq/meteord' if your app is not using Meteor 1.4
      image: 'abernix/meteord:base',
      // imagePort: 80, // (default: 80, some images EXPOSE different ports)
    },

    // This is the maximum time in seconds it will wait
    // for your app to start
    // Add 30 seconds if the server has 512mb of ram
    // And 30 more if you have binary npm dependencies.
    deployCheckWaitTime: 60,

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    oplog: true
  }
  //   port: 27017,
  //   version: '3.4.1',
  //   servers: {
  //     one: {}
  //   }
  // }
};