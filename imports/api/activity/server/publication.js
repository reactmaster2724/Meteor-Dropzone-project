import { Meteor } from 'meteor/meteor';
import { Activity } from '/imports/api/activity/activity';



Meteor.publish('activity', function publishFiles() {
    return Activity.find({});
});