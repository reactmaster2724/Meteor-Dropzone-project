import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class ConfigCollection extends Mongo.Collection {
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
        const result = super.remove(selector);

        return result;
    }
}

const Config = new ConfigCollection('config');

Config.allow({
    insert: () => true,
    update: () => true,
    remove: () => true,
});

Config.deny({
    insert: () => false,
    update: () => false,
    remove: () => false,
});

Config.schema = new SimpleSchema({
    name: {
        type: String,
        optional: false,
    },
    runEnv: {
        allowedValues: ['development', 'production'],
        type: String,
        optional: true,
    },
    meta: {
        type: Object,
    },
    gridfsUrl: {
        type: String,
        optional: true,
    },
    repoURL: {
        type: String,
        optional: true,
    },
    repoToken: {
        type: String,
        optional: true,
    },
    userTimeOut: {
        type: String,
        optional: true
    }
});




Config.attachSchema(Config.schema);

export { Config };