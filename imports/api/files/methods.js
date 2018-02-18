import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Files } from './files.js';
import { Folder } from '../folder/folder';
import { Config } from '../config/config';
import { check } from 'meteor/check';
import { FilesStore } from './filestore.js';


const insertFiles = new ValidatedMethod({
    name: 'files.insert',
    validate: Files.schema.validator({ clean: true, filter: false }),
    run(fileInfo) {
        console.log('fileInfo', fileInfo);
        var url = fileInfo.url;
        var arr = url.split("/");
        console.log('arr', arr);
        var nUrl = url.replace("http:", "https:");
        var x = fileInfo.name;
        var title = (x.substr(0, x.lastIndexOf('.')) || x).replace(/-\s*$/, "");
        const file = {
            title: title,
            originalTitle: fileInfo.name,
            meta: {
                fileType: fileInfo.type,
                fileSizeKB: fileInfo.size,
                previewUrl: nUrl,
                balance: 0,
                comment: {
                    text: '',
                },
                reason: {
                    delete: null,
                    move: null,
                    restore: null
                },
            },
            userId: fileInfo.userId,
            fileFSId: fileInfo.fileFSId,
            folderId: null,
            folderTemplateId: null,
            periodId: null,
            url: nUrl,
            statusId: null,
            isDeleted: false,
        };
        return Files.insert(file);
    },
});

const updateFiles = new ValidatedMethod({

    name: 'files.update',
    validate: Files.schema.validator({ clean: true, filter: false }),
    run(fileId, folderId, periodId, balance, par) {
        const currentFile = Files.findOne(fileId);
        const folderTemplateId = Folder.findOne(folderId).folderTemplateId;

        Files.update(
            currentFile._id, {
                $set: {
                    folderId,
                    folderTemplateId,
                    periodId,
                    'meta.balance': balance,
                }
            },
            err => {
                if (err) console.error(err);
            }
        );
    },
});

function repo_url(fileId){
 // private  name functionality  private
}





Meteor.methods({
  //if (Meteor.isServer) {
  'files.updateTitle' (fileId, title) {
    check(fileId, String);
    check(title, String);

    var title = (title.substr(0, title.lastIndexOf('.')) || title).replace(/-\s*$/, "");
    Files.update(
      fileId, {
        $set: {
          title,
        }
      }
    );
  },
  'files.updateDetails' (folderId, fileId, title, issueDate, expireDate, comment, balance) {
    check(folderId, String);
    check(fileId, String);
    check(title, String);
    check(issueDate, String);
    check(expireDate, String);
    check(comment, String);

    var title = (title.substr(0, title.lastIndexOf('.')) || title).replace(/-\s*$/, "");
    Files.update(
      fileId, {
        $set: {
          folderId,
          title,
          'meta.issueDate': issueDate,
          'meta.expireDate': expireDate,
          'meta.comment.text': comment,
          'meta.balance': balance,

        }
      }
    );
  },

  'files.updateSupport' (folderId, fileId, title) {
    check(folderId, String);
    check(fileId, String);
    check(title, String);

    var title = (title.substr(0, title.lastIndexOf('.')) || title).replace(/-\s*$/, "");
    Files.update(
      fileId, {
        $set: {
           folderId,
          title,
        }
      }
    );
  },
  // 'files.get_url' (fileId) {
  // function name is visible not the actual code
  //unless fileId.blank?
  // var url = null
  // lookup file in mongo
  // if file.url.blank
  //    url = files.repo_url
  // else
  //    url = file.url
  // end
  //
  // },
    getFileUrl: function(doc_id, bucket_name, file_url) {
        // var bucket_name = "b2z95yymkmpdgoyqq";
        this.unblock();
        // process.env.NODE_ENV will be production or development
        console.log('getFileUrl: Current environment', process.env.NODE_ENV);
        if (file_url) {
            // var configData = Config.find({"name": "gridfs", "runEnv": process.env.NODE_ENV}).fetch()
            console.log("Using Local url: ", file_url)
            return file_url
        }

        // Handle the Repository request
        var configData = Config.find({ "name": "repository", "runEnv": process.env.NODE_ENV }).fetch();

        console.log("configData: ", configData)
        var url = configData[0].meta.getURL //gridfsUrl;

        var data = { "queue_request": { "document_id": doc_id, "bucket_name": bucket_name } }

        if (Meteor.isServer) {
            res = Meteor.http.call('POST', url, { data: data });
            console.log("temp_key: ", res.data.temp_key)
            return res.data.temp_key // The temporary file url
        }
    },
    getTemp_key: function(doc_id, bucket_name, file_url) {
        // var bucket_name = "b2z95yymkmpdgoyqq";
        this.unblock();
        // process.env.NODE_ENV will be production or development
        console.log('Current environment', process.env.NODE_ENV);
        if (file_url) {
            // var configData = Config.find({"name": "gridfs", "runEnv": process.env.NODE_ENV}).fetch()
            console.log("Using Local url: ", file_url)
            return file_url
        }

        // Handle the Repository request
        var configData = Config.find({ "name": "repository", "runEnv": process.env.NODE_ENV }).fetch();

        console.log("configData: ", configData)
        var url = configData[0].meta.getURL //gridfsUrl;

        var data = { "queue_request": { "document_id": doc_id, "bucket_name": bucket_name } }
        console.log("\n\nRequesting data: ", data)
        console.log("   From: ", url)
        if (Meteor.isServer) {
            res = Meteor.http.call('POST', url, { data: data });
            console.log("res: ", res)
            console.log("content: ", res.content)
            console.log("temp_key: ", res.data.temp_key)
            return res
        }
    }
});

// declare const UploadFS: any;
function uploadGridFS(file, data) {
    return new Promise((resolve, reject) => {
        // pick from an object only: name, type and size

        const upload = new UploadFS.Uploader({
            file,
            data,
            store: FilesStore,
            onError: reject,
            onComplete: resolve
        });
        upload.start();

    });
}


export { insertFiles, updateFiles, uploadGridFS };