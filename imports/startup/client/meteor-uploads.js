import { Meteor } from 'meteor/meteor';
import { insertFiles } from '../../api/files/methods';

Meteor.startup(() => {



  // Uploader.finished = (index, fileInfo) => {
  //   fileInfo.userId = Session.get('activeLicenseeId') || Meteor.userId();
  //   fileInfo.fileFSId = Session.get('fileFSId');
  //   insertFiles.run(fileInfo);
  //   Meteor.call('uploadFile', fileInfo, (err, res) => {
  //     if (err) {
  //       console.log(err)
  //     } else {
  //       console.log(res)
  //     }
  //   })
  //   Session.set('fileFSId', null);
  // };
});