import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Config } from './config.js';

const generateConfig = new ValidatedMethod({
    name: 'config.generate',
    validate: Config.schema.validator({ clean: true, filter: false }),
    run() {
        // if (Config.find().count() === 0) {
        var data = {
            name: "repository",
            runEnv: "production",
            meta: {
                getURL: "https://r.gpi-corp.com/api/queue_request?auth_token=b05f9c461adb418c87997a5245c7368b",
                token: "b05f9c461adb418c87997a5245c7368b",
                postURL: "https://r.gpi-corp.com/api/document?auth_token=b05f9c461adb418c87997a5245c7368b",
            },
            gridfsUrl: "https://r.gpi-corp.com/api/queue_request?auth_token=b05f9c461adb418c87997a5245c7368b",
            repoURL: "",
            repoToken: "b05f9c461adb418c87997a5245c7368b",
            userTimeOut: 30
        }
      var data = {
        name: "repository",
        runEnv: "development",
        meta: {
          getURL: "http://ec2-52-24-231-8.us-west-2.compute.amazonaws.com/api/queue_request?auth_token=b05f9c461adb418c87997a5245c7368b",
          token: "b05f9c461adb418c87997a5245c7368b",
          postURL: "https://r.gpi-corp.com/api/documents?auth_token=b05f9c461adb418c87997a5245c7368b",
        },
        gridfsUrl: "https://r.gpi-corp.com/api/queue_request?auth_token=b05f9c461adb418c87997a5245c7368b",
        repoURL: "",
        repoToken: "b05f9c461adb418c87997a5245c7368b",
        userTimeOut: 30
      }
        Config.insert(data);
        var data = {
            name: "gridFS",
            runEnv: "production",
            gridfsUrl: "localhost:3000",
            repoURL: "test/abc/xyz",
            repoToken: "repo/url/test",
            userTimeOut: 30
        }
        Config.insert(data);
    },
});

export { generateConfig };

//http://ec2-52-24-231-8.us-west-2.compute.amazonaws.com/api/documents?auth_token=${TOKEN}