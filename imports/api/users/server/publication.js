import { Meteor } from 'meteor/meteor';

Meteor.publish('usersMe', function publishUsers() {
  return Meteor.users.find({_id: this.userId});
});

Meteor.publish('usersLicensees', function publishUsers() {
  const currentUser = Meteor.users.findOne(this.userId);
  if(currentUser && currentUser.licenseesManaged && currentUser.licenseesManaged.length > 0) {
    const publishIds = currentUser.licenseesManaged;
    return Meteor.users.find({ _id: { $in: publishIds } });
  }
});

Meteor.publish('usersAdmin', function publishUsers() {
  const currentUser = Meteor.users.findOne(this.userId);
  if(currentUser && currentUser.suRole) {
    return Meteor.users.find();
  }
});