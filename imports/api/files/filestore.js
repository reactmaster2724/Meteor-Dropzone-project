import { UploadFS } from 'meteor/jalik:ufs';
import { GridFSStore } from 'meteor/jalik:ufs-gridfs';
import { Files } from './files.js';

//https://github.com/jalik/jalik-ufs

const FilesStore = new GridFSStore({
    collection: Files,
    name: 'files',
    filter: new UploadFS.Filter({
        contentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.oasis.opendocument.text']
    }),
    permissions: new UploadFS.StorePermissions({
        insert(userId, doc) {
            //return userId;
            return true;
        },
        update(userId, doc) {
            //return userId === doc.userId;
            return true;
        },
        remove(userId, doc) {
            // console.log('doc.userId', doc.userId, 'userId', userId);
            // return userId === doc.userId;
            return true;
        }
    }),
    onRead: function(fileId, file, request, response) {

        return true;

    },
    //  onFinishUpload(file) {
    //       console.log(`Store.onFinishUpload`, file);
    //   },
    onReadError(err, fileId, file) {
        //   console.log(`Store.onReadError`, file);
        console.error(err);
    },
    // onWriteError(err, fileId, file) {
    //     console.log(`Store.onWriteError`, file);
    //     console.error(err);
    // },
    // onValidate(file) {
    //     console.log(`Store.onValidate`, file);
    //     // if something is wrong, throw an error
    //     // throw new Meteor.Error('invalid-file-for-x-reason');
    // },
})

function loggedIn(userId) {
    return !!Meteor.userId();
}

export { FilesStore };