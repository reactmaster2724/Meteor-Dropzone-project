import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class ActivityCollection extends Mongo.Collection {
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
        //const result = super.remove(selector);

        // return result;
        return false;
    }
}

const Activity = new ActivityCollection('activity');

Activity.allow({
    insert: () => true,
    update: () => true,
    remove: () => false,
});

Activity.deny({
    insert: () => false,
    update: () => false,
    remove: () => true,
});

Activity.schema = new SimpleSchema({
    // collectionName: { // The name of the collection changed
    //     type: String
    // },
    // changeType: { // insert or update
    //     type: String
    // },
    licenseeId: {
        type: String
    },
    userId: { // which userId made the change
        type: String
    },
    parentUser: {
        type: String,
        optional: true
    },
    // licenseeId: { // which licenseeId the change was made for
    //     type: String
    // },
    // changeDate: { // date and time the change was made
    //     type: Date
    // },
    // originalDoc: { // which licenseeId the change was made for
    //     type: Object,
    //     blackbox: true
    // },
    // changeMade: {
    //     type: Object,
    //     blackbox: true
    // },

    reason: {
        type: String,
        optional: true
    },
    createdAt: {
        type: String,
        optional: true
    },
    fileId: {
        type: String,
        optional: true
    },
    parentId: {
        type: String,
        optional: true
    },
    folderId: {
        type: String,
        optional: true
    }
});

Activity.attachSchema(Activity.schema);

export { Activity };