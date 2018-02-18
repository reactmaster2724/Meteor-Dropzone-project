import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


// const FilesFS = new FS.Collection("filesFS", {
//   stores: [new FS.Store.FileSystem('files', { path: "~/.fs-uploads" })],
// });
// FilesFS.allow({
//   insert() {
//     return true;
//   },
//   update() {
//     return true;
//   },
//   remove() {
//     return true;
//   },
//   download() {
//     return true;
//   }
// });


class FilesCollection extends Mongo.Collection {
    insert(doc, callback) {
        const ourDoc = doc;
        const result = super.insert(ourDoc, callback);
        return result;
    }
    update(selector, modifier) {
        const result = super.update(selector, modifier);
        return result;
    }

    remove(selector) {
        console.log('selector', selector);
        const result = super.remove(selector);
        return result;
    }

}

const Files = new FilesCollection('files');

Files.allow({
    insert: () => true,
    update: () => true,
    remove: () => true,
});

Files.deny({
    insert: () => false,
    update: () => false,
    remove: () => false,
});

Files.schema = new SimpleSchema({

    name: {
        type: String,
        optional: true,
    },
    size: {
        type: Number,
        optional: true
    },
    title: {
        type: String,
        optional: true,
    },

    type: {
        type: String,
        optional: true,
    },
    complete: {
        type: Boolean,
        optional: true,
    },
    extension: {
        type: String,
        optional: true,
    },

    Progress: {
        type: Number,
        optional: true,
    },
    store: {
        type: String,
        optional: true,
    },
    token: {

        type: String,
        optional: true,

    },
    uploadedAt: {
        type: Date,
        optional: true,

    },
    uploading: {
        type: Boolean,
        optional: true,
    },

    originalTitle: {
        type: String,
        optional: true
    },
    meta: {
        type: Object,
        optional: true,
    },
    'meta.fileType': {
        type: String,
        optional: true
    },
    'meta.fileSizeKB': {
        type: Number,
        optional: true
    },
    'meta.previewUrl': {
        type: String,
        optional: true
    },
    'meta.balance': {
        type: String,
        decimal: true,
        optional: true
    },
    'meta.issueDate': {
        type: String,
        optional: true
    },
    'meta.expireDate': {
        type: String,
        optional: true
    },
    'meta.comment': {
        type: Object,
        optional: true
    },
    'meta.comment.text': {
        type: String,
        optional: true
    },
    'meta.reason': {
        type: Object,
        optional: true
    },
    'meta.periodIds': {
        type: Object,
        optional: true
    },
    'meta.reason.delete': {
        type: String,
        optional: true
    },
    'meta.reason.restore': {
        type: String,
        optional: true
    },
    'meta.reason.move': {
        type: String,
        optional: true
    },
    userId: {
        type: String,
        optional: true,
    },
    folderId: {
        type: String,
        optional: true,
    },
    folderTemplateId: {
        type: String,
        optional: true,
    },
    periodId: {
        type: String,
        optional: true,
    },
    url: {
        type: String,
        optional: true,
    },
    statusId: {
        type: String,
        optional: true,
    },
    isDeleted: {
        type: Boolean,
        optional: true,
    },
});

Files.attachSchema(Files.schema);

//, FilesFS 
export { Files };