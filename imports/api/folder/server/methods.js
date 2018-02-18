import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Folder } from '../folder.js';
import { PeriodTemplate } from '../../periodTemplate/periodTemplate.js';
import { Files } from '../../files/files.js';



Meteor.methods({
    'folder.assign.file' (folderId, fileId, periodId) {
        check(folderId, String);
        check(fileId, String);
        check(periodId, String);
        console.log('folderId', folderId, 'fileId', fileId, 'periodId', periodId);

        const currentFolder = Folder.findOne({ _id: folderId });
        const period = PeriodTemplate.findOne(periodId);

        let index = '';
        switch (period.type) {
            case 'month':
                index = `${period.year}-${period.month.toString().length === 1 ? '0' + period.month : period.month}`;
                break;
            case 'quarter':
                index = `${period.year}-q${period.quarter}`;
                break;
            case 'annual':
                index = `${period.year}`;
                break;
            default:
                index;
        }

        const file = Files.findOne(fileId);

        let newFileTitle = `${currentFolder.staticString.title}-${index}.${file.title.split('.')[1]}`;

        if (period._id) {
            Folder.update({ _id: currentFolder._id, periods: { $elemMatch: { periodTemplateId: period._id } } }, { $set: { 'periods.$.fileId': fileId, 'periods.$.fileName': file.originalTitle, 'periods.$.green': true, 'periods.$.red': false } });

            Meteor.call(
                'files.updateTitle',
                fileId,
                newFileTitle
            );

        }
    },
    'folder.unAssign.file' (folderId, fileId) {
        check(folderId, String);
        check(fileId, String);

        Folder.update({ periods: { $elemMatch: { fileId: fileId } } }, { $set: { 'periods.$.fileId': null, 'periods.$.fileName': null, 'periods.$.red': true, 'periods.$.green': false } })
    },
});

//   'folder.assign.file'(folderId, fileId, periodId) {
//     check(folderId, String);
//     check(fileId, String);
//     check(periodId, String);

//     const currentFolder = Folder.findOne({ _id: folderId });
//     const period = PeriodTemplate.findOne(periodId);

//     // let index = '';
//     // switch (period.type) {
//     //   case 'month':
//     //     index = `${period.year}-${period.month.toString().length === 1 ? '0' + period.month : period.month}`;
//     //     break;
//     //   case 'quarter' :
//     //     index = `${period.year}-q${period.quarter}`;
//     //     break;
//     //   case 'annual' :
//     //     index = `${period.year}`;
//     //     break;
//     //   default: index;
//     // }

//     // const file = Files.findOne(fileId);

//     // let newFileTitle = `${currentFolder.staticString.title}-${index}.${file.title.split('.')[1]}`;

//     if(period._id) {
//       Folder.update(
//         { _id: currentFolder._id, periods: { $elemMatch: { periodTemplateId: period._id } } },
//         { $set: { 'periods.$.fileId': fileId } }
//       );

//       // Meteor.call(
//       //   'files.updateTitle',
//       //   fileId,
//       //   newFileTitle
//       // );

//     }
//   },
//   'folder.unAssign.file'(folderId, fileId) {
//     check(folderId, String);
//     check(fileId, String);

//     Folder.update({ periods: { $elemMatch: { fileId: fileId } } },
//       { $set: { 'periods.$.fileId': null } },
//       { multi: true }
//       )
//   },
// });