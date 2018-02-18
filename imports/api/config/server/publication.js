import { Meteor } from 'meteor/meteor';
import { Config } from '/imports/api/config/config';

Meteor.publish('configData', function publishConfig() {
    return Config.find();
});