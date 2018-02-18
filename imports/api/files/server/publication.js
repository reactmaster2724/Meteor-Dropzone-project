import { Meteor } from 'meteor/meteor';
import { Files  } from '/imports/api/files/files';

Meteor.publish('files', function publishFiles() {
  let publishIds = [];
  const user = Meteor.users.findOne(this.userId);
  if (user && user.licenseesManaged) {
    publishIds = user.licenseesManaged;
  }
  publishIds.push(this.userId);
  return Files.find({ userId: { $in: publishIds } });

});

Meteor.publish('filesFS', function () {
  return Files.find();
});