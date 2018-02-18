import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class FolderCollection extends Mongo.Collection {

    insert(doc, callback) {
        // // insert into diffLogs collection with document created
        const ourDoc = doc;
        const result = super.insert(ourDoc, callback);

        return result;
    }
    update(selector, modifier) {

        const userId = this.userId || Meteor.userId();
        const orig = Folder.findOne({ _id: selector });
        //console.log("folder update:",selector, modifier,orig,userId);
        // insert into diffLogs collection with before and after record stares
        const result = super.update(selector, modifier);
        return result;
    }
    remove(selector) {
        const result = super.remove(selector);

        //return result;
        return false;
    }
}

const Folder = new FolderCollection('folder');

Folder.allow({
    insert: () => true,
    update: () => true,
    remove: () => true,
});

Folder.deny({
    insert: () => false,
    update: () => false,
    remove: () => false,
});

Folder.schema = new SimpleSchema({

    folder: {
        type: String,
        optional: true,
    },
    type: {
        allowedValues: ['account', 'detail', 'support', 'archive'],
        type: String,
        optional: true,
    },
    userId: {
        type: String,
        optional: true,
    },
    accountOpened: {
        type: String,
        optional: true,
    },
    accountClosed: {
        type: String,
        optional: true,
    },
    issueDate: {
        type: String,
        optional: true,
    },
    expireDate: {
        type: String,
        optional: true,
    },
    parentId: {
        type: String,
        optional: true,
    },
    title: {
        type: String,
        optional: true,
    },
    periodType: {
        type: String,
        optional: true,
    },
    periods: {
        type: [Object],
        optional: true,
    },
    'periods.$.periodTemplateId': {
        type: String,
        optional: true,
    },
    'periods.$.fileId': {
        type: String,
        optional: true,
    },
    'periods.$.fileName': {
        type: String,
        optional: true,
    },
    'periods.$.red': {
        type: Boolean,
        optional: true,
    },
    'periods.$.green': {
        type: Boolean,
        optional: true,
    },
    meta: {
        type: String,
        optional: true,
    },
    folderTemplateId: {
        type: String,
        optional: true,
    },
    isDeleted: {
        type: Boolean,
        optional: true,
    },
    staticString: {
        type: Object,
        optional: true,
    },
    'staticString.title': {
        type: String,
        optional: true,
    },
    comment: {
        type: String,
        optional: true
    },
    file: {
        type: [Object],
        optional: true
    },
    'file.$.balance': {
        type: String,
        optional: true
    },
    'file.$.fileUrl': {
        type: String,
        optional: true
    }
});

Folder.attachSchema(Folder.schema);

export { Folder };