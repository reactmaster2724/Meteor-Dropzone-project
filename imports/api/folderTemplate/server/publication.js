import { Meteor } from 'meteor/meteor';
import { FolderTemplate } from '/imports/api/folderTemplate/folderTemplate';

Meteor.publish('folderTemplate', (type) => {
  return FolderTemplate.find({
    type,
    isDeleted: false,
  });
});
