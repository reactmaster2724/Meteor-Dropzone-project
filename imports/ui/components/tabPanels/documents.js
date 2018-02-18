import './documents.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Files } from '../../../api/files/files';
import { Folder } from '../../../api/folder/folder';
import { FolderTemplate } from '../../../api/folderTemplate/folderTemplate';
import { PeriodTemplate } from '../../../api/periodTemplate/periodTemplate';
import {
    insertFolderTemplate,
    removeFolderTemplate,
    updateFolderTemplate,
} from '../../../api/folderTemplate/methods';
import { isAdmin } from '../../helpers/helpers';


Template.documents.onCreated(function() {
    Session.set('toggleViewTable', true);
    Session.set('showDocumentSettings', false);
});

Template.documents.onRendered(function() {
    this.autorun(() => {});
});

Template.documents.helpers({
    changeView() {
        return Session.get('toggleViewTable');
    },
    isAdmin() {
        return isAdmin();
    },
    files() {
        var fileId = Session.get('assignFolderId');
        if (fileId) {
            const files = Files.find({ isDeleted: false, folderId: fileId }, { sort: { originalTitle: 1 } }).fetch();

            files.map((el) => {
                el.topTitle = Session.get('documentsShowName') ? el.title : el.originalTitle;
                el.bottomTitle = Session.get('documentsShowName') ? el.originalTitle : el.title;
                const period = PeriodTemplate.findOne(el.periodId)
                if (period) {
                    switch (period.type) {
                        case 'month':
                            el.period = period.month;
                            break;
                        case 'quarter':
                            el.period = period.quarter;
                            break;
                        case 'annual':
                            el.period = '';
                            break;
                    }
                    el.url = el.url;
                    el.year = period.year;
                }
                return el;
            });
            return files;
        }
        return false;
    },
    folders() {
        var userId;
        if (Session.get('activeLicenseeId')) {
            userId = Session.get('activeLicenseeId');
        } else {
            userId = Meteor.userId();
        }
        var folderId = Session.get('assignFolderId');
        if (folderId) {
            var folder = Folder.find({ $and: [{ parentId: folderId }, { userId: userId }] }).fetch();
            folder.map((el) => {
                el.topTitle = Session.get('documentsShowName') ? el.title : el.originalTitle;
                el.bottomTitle = Session.get('documentsShowName') ? el.originalTitle : el.title;

                const period = PeriodTemplate.findOne(el.periodId)
                if (period) {
                    switch (period.type) {
                        case 'month':
                            el.period = period.month;
                            break;
                        case 'quarter':
                            el.period = period.quarter;
                            break;
                        case 'annual':
                            el.period = '';
                            break;
                    }
                }
                return el;
            });
            return folder;
        }
        return false;
    },
    extention(title) {
        var substr = title.substring(title.length - 4, title.length);
        if (substr[0] == '.') {
            return title.substring(title.length - 3, title.length);
        } else {
            return substr;
        }
    },
    restore() {
        return Session.get('restore');
    }
});

Template.documents.events({
    'click .viewFile': function() {
        if (Session.get('contextmenuFileId')) {
            var fileId = Session.get('contextmenuFileId');
            var file = Files.findOne({ _id: fileId });
            var userId;
            if (Session.get('activeLicenseeId')) {
                userId = Session.get('activeLicenseeId');
            } else {
                userId = Meteor.userId();
            }
            const profile = Meteor.user({}).profile;
            var userName = profile.firstName + ' ' + profile.lastName;
            var url = file.url;
            // "Aq447C7RFARGr6TDg112345";
            Meteor.call('getFileUrl', fileId, userId, url, function(err, res) {
                if (!err) {
                    // window.open(res);
                    Session.set('url', res);
                } else {
                    console.log('err', err);
                }
            });
        }
    },
    'click .viewFileDoc': function() {
        var fileId = this._id;
        var userId;
        if (Session.get('activeLicenseeId')) {
            userId = Session.get('activeLicenseeId');
        } else {
            userId = Meteor.userId();
        }
        const profile = Meteor.user({}).profile;
        var userName = profile.firstName + ' ' + profile.lastName;
        var url = this.url;
        // "Aq447C7RFARGr6TDg112345";
        Meteor.call('getFileUrl', fileId, userId, url, function(err, res) {
            if (!err) {
                window.open(res);
            } else {
                console.log('err', err);
            }
        });

    },
    'click .block.layout.icon' (ev) {
        ev.preventDefault();
        Session.set('toggleViewTable', true);
    },
    'click .list.layout.icon' (ev) {
        ev.preventDefault();
        Session.set('toggleViewTable', false);
    },
    'click .ui.checkbox' (ev) {
        ev.preventDefault();
        Session.set('documentsShowName', $(jsCheckbox)[0].checked);
    },
    "click .js-file-contextmenu" () {
        Session.set('moveFile', true);
        Session.set('assignFolderId', Session.get('contextmenuFileId'));
    },
    "click .js-edit" () {
        Session.set('EditInfo', Session.get('contextmenuFileId'));
        Session.set('contextmenuFileId', false);
        Session.set('DeleteFile', false);
    },
    "click .js-restore" () {
        Session.set('EditInfo', false);
        Session.set('DeleteFromSubmited', false);
        Session.set('DeleteFile', false);
        Session.set('Restore', Session.get('contextmenuFileId'));
        // Session.set('contextmenuFileId', false);
    },
    "click .js-delete" () {
        Session.set('EditInfo', false);
        if (Session.get('contextmenuFileId')) {
            var fi = Files.findOne({ _id: Session.get('contextmenuFileId') });
            var fo = Folder.findOne({ _id: fi.folderId });
            if (fo.type == "archive") {
                Session.set('DeleteFromSubmited', Session.get('contextmenuFileId'));
            } else {
                Session.set('DeleteFile', Session.get('contextmenuFileId'));
            }
            Session.set('contextmenuFileId', false);
        }
    },
    "click .downloadFile": function() {
        var userId;
        if (Session.get('activeLicenseeId')) {
            userId = Session.get('activeLicenseeId');

        } else {
            userId = Meteor.userId();
        }
        const profile = Meteor.user({}).profile;
        var userName = profile.firstName + ' ' + profile.lastName;

        if (this.folderId) {
            var folder = Folder.findOne({ _id: this.folderId });

            Meteor.call('addLogs', userId, "Downloaded file" + " " + this.originalTitle + " from " + folder.title, this._id, userName, this.folderId);
        } else {
            Meteor.call('addLogs', userId, "Downloaded file" + " " + this.originalTitle + " from submitted", this._id, userName, false);
        }
    },
    'click .js-file-contextmenu' (ev) {
        ev.preventDefault();
        Session.set('showDocumentSettings', true);
    },
    'click #submit-context-menu' () {
        Session.set('viewInfo', this);
        var fileId = this._id;
        var userId;
        if (Session.get('activeLicenseeId')) {
            userId = Session.get('activeLicenseeId');
        } else {
            userId = Meteor.userId();
        }
        const profile = Meteor.user({}).profile;
        var userName = profile.firstName + ' ' + profile.lastName;
        var url = this.url;
        // "Aq447C7RFARGr6TDg112345";
        Meteor.call('getFileUrl', fileId, userId, url, function(err, res) {
            if (!err) {
                // window.open(res);
                Session.set('url', res);
            } else {
                console.log('err', err);
            }
        });
    },
    'mousedown .context': function() {
        var folder = Folder.findOne({ _id: this.folderId });
        if (folder && folder.type == "archive") {
            Session.set('restore', this);
        } else {
            Session.set('restore', false);
        }
    }
});

Template.documents.onDestroyed(() => {
    Session.set('showDocumentSettings', false);
});