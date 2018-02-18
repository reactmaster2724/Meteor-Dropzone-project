import {WebApp} from 'meteor/webapp';
import {Files} from '../../api/files/files';
import {FilesStore} from '../../api/files/filestore';

WebApp.connectHandlers.use('/file/', async (req, res) => {
 const parts = req.url.split('/');
 const params = parts.slice(1);
 const id = params[0];
 const _file=  Files.findOne({_id:id});
  res.writeHead(200, {
    'Content-Type': 'application/'+_file.extension,
    'Content-Disposition': `attachment; filename=${new Date()+_file.title}`,
    'Pragma': 'no-cache',
    'Expires': '0',
  });
  let readStream = FilesStore.getReadStream(id, _file);
 readStream.on('error', Meteor.bindEnvironment(function (error) {
    console.error(err);
    return next(); 
}));
readStream.on('data', Meteor.bindEnvironment(function (data) {
     res.end(data);
}));

 
});



// getFileUrl: function(doc_id, bucket_name, file_url) {
//         // var bucket_name = "b2z95yymkmpdgoyqq";
//         this.unblock();
//         // process.env.NODE_ENV will be production or development
//         console.log('getFileUrl: Current environment', process.env.NODE_ENV);
//         if (file_url) {
//             // var configData = Config.find({"name": "gridfs", "runEnv": process.env.NODE_ENV}).fetch()
//             console.log("Using Local url: ", file_url)
//             return file_url
//         }

//         // Handle the Repository request
//         var configData = Config.find({ "name": "repository", "runEnv": process.env.NODE_ENV }).fetch();

//         console.log("configData: ", configData)
//         var url = configData[0].meta.getURL //gridfsUrl;

//         var data = { "queue_request": { "document_id": doc_id, "bucket_name": bucket_name } }

//         if (Meteor.isServer) {
//             res = Meteor.http.call('POST', url, { data: data });
//             console.log("temp_key: ", res.data.temp_key)
//             return res.data.temp_key // The temporary file url
//         }
//     },
