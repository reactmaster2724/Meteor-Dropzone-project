import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';


const TOKEN = 'b05f9c461adb418c87997a5245c7368b';

Meteor.startup(() => {
    // UploadServer.init({
    //   tmpDir: process.env.PWD + '/.uploads/tmp',
    //   uploadDir: process.env.PWD + '/.uploads/',
    //   checkCreateDirectories: true,
    // });

    Meteor.methods({
        getToken() {
            return HTTP.get('http://fortress-api.herokuapp.com/api/token');
        },
        uploadFile(file) {
            //  console.log('file', file);

            var data = request.getSync(file.url, {
                encoding: null
            });

            let promise = new Promise((resolve, reject) => {
                const token = Meteor.call('getToken', (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        // console.log('res',res);
                        resolve(res);
                    }
                });
            });

            promise
                .then(
                    result => {
                        const files = {
                            file: {
                                contentType: file.type,
                                filename: file.name,
                                data: data.body
                            }
                        };

                        // console.log('files', files);
                        // console.log('files headers', data.response.headers['content-type']);

                        const url = `http://ec2-52-24-231-8.us-west-2.compute.amazonaws.com/api/documents?auth_token=${TOKEN}`;
                        // const url = `http://lvh.me:3000/api/documents?auth_token=${TOKEN}`;

                        // const formData = {
                        //   params: {
                        //     'document[id]': 'MgcG5bZbhrmxKsZgS',
                        //     'document[bucket_name]': 'b2z95yymkmpdgoyqq',
                        //     'document[data]': files
                        //   },
                        //   headers: {
                        //     'Content-Type': 'application/x-www-form-urlencoded'
                        //   }
                        // }

                        // files: {
                        //   value:  files,
                        //   options: {
                        //     filename: dest_filename,
                        //     contentType: content_type
                        //   }
                        // }


                        var formData = {
                            'document[id]': 'MgcG5bZbhrmxKsZgS',
                            'document[bucket_name]': 'b2z95yymkmpdgoyqq',
                            'document[data]': files
                        }

                        var options = { npmRequestOptions: { body: null, formData: formData } };

                        HTTP.post(
                            url,
                            options,
                            (err, res) => {
                                console.log(err, res);
                                if (err) {
                                    console.log('error', err);
                                } else {
                                    console.log('res', res);
                                    return res;
                                }
                            });


                        // ##### examples ###########

                        // formData: {
                        //    'regularField': 'someValue',
                        //    'regularFile': someFileStream,
                        //    'customBufferFile': {
                        //      value: fileBufferData,
                        //      options: {
                        //        filename: 'myfile.bin'
                        //      }
                        //    }


                        // var imgData = data.body;
                        // var content_type = data.response.headers['content-type'];
                        // var content_length = data.response.headers['content-length'];
                        // // More info on formData here: https://www.npmjs.com/package/request#forms
                        // var formData = {
                        //   // Pass a simple key-value pair
                        //   files: {
                        //     value:  ,
                        //     options: {
                        //       filename: dest_filename,
                        //       contentType: content_type
                        //     }
                        //   }
                        // }
                        // var options = { npmRequestOptions: {body: null, formData: formData}  };
                        // res= Meteor.http.call("POST", url, options, (err, res) => {
                        //   console.log(err, res);
                        // });

                        //############################

                    });

        }
    })
});