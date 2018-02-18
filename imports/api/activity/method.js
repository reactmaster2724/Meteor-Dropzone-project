import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Activity } from './activity.js';
import { check } from 'meteor/check';


const insertFiles = new ValidatedMethod({
    name: 'log.insert',
    validate: Activity.schema.validator({ clean: true, filter: false }),
    run(logs) {

        return Activity.insert(logs);
    },
});

const updateFiles = new ValidatedMethod({

    name: 'logs.update',
    validate: Activity.schema.validator({ clean: true, filter: false }),
    run(fileId, folderId, periodId, balance, par) {

    },
});

Meteor.methods({
    'addLogs' (userId, reason, fileId, parentUser, folderId) {
        var data = {
            licenseeId: Meteor.userId(),
            userId: userId,
            reason: reason,
            createdAt: (new Date()).toISOString(),
            fileId: fileId,
            parentUser: parentUser,
            folderId: folderId
                // parentId: folderId
        }
        Activity.insert(data);
    },
});

export { insertFiles, updateFiles };