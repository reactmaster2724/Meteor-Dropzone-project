import { Meteor } from 'meteor/meteor';
import { Folder } from '/imports/api/folder/folder';

Meteor.publish('folder', function publishFolders() {
  let publishIds = [];
  const user = Meteor.users.findOne(this.userId);
  if(user && user.licenseesManaged) {
    publishIds = user.licenseesManaged;
  }
  publishIds.push(this.userId);
  return Folder.find({
    userId: { $in: publishIds },
    isDeleted: false,
  });
});