import './file.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Files } from '../../../../api/files/files';
import { Folder } from '../../../../api/folder/folder';
import { Activity } from '../../../../api/activity/activity';
import { FolderTemplate } from '../../../../api/folderTemplate/folderTemplate';
import { PeriodTemplate } from '../../../../api/periodTemplate/periodTemplate';
import {
    insertFolderTemplate,
    removeFolderTemplate,
    updateFolderTemplate,
} from '../../../../api/folderTemplate/methods';


Template.file.onCreated(function() {

});

Template.file.onRendered(function() {
    $('.context').contextmenu({
        target: '#context-menu-move',
        onItem: function(context, e) {
            Session.set('showDocumentSettings', true);
            Session.set('contextmenuFileId', $(context).find('.item.file')[0].id);
        }
    })
    $('.context-submit').contextmenu({
        target: '#context-menu-submit',
        onItem: function(context, e) {
            Session.set('showDocumentSettings', true);
            Session.set('contextmenuFileId', $(context).find('.item.file')[0].id);
        }
    })
});

Template.file.helpers({
    extention(title) {
        var substr = title.substring(title.length - 4, title.length);
        if (substr[0] == '.') {
            return title.substring(title.length - 3, title.length);
        } else {
            return substr;
        }
    },
    HeaderData() {
        //  || Session.get('headerTab') === "submitDocuments"
        if (Session.get('headerTab') === "documents") {
            return true;
        } else {
            return false;
        }
    },
    fileTYpe(file) {
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(file)[1];
        if (ext == "pdf") {
            return "pdf";
        } else if (ext == "doc" || ext == "docx" || ext == "docm") {
            return "doc";
        } else if (ext == "xls" || ext == "xlsb" || ext == "xlsm" || ext == "xlsx") {
            return "xlsx";
        }
    },

});

Template.file.events({
    'click .js-file-contextmenu' (ev) {
        ev.preventDefault();
        Session.set('showDocumentSettings', true);
    },
    'click #submit-context-menu' () {
        Session.set('viewInfo', this);
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
        var fileId = this._id;
        var url = this.url
            // "Aq447C7RFARGr6TDg112345";

        Meteor.call('getFileUrl', fileId, this.userId, url, function(err, res) {
            if (!err) {
                console.log('res', res);
                var link = document.createElement('a');
                link.href = url;
                link.name = "test";
                link.download = res;
                link.dispatchEvent(new MouseEvent('click'));


            } else {
                console.log('err', err);
            }
        });

        if (this.folderId) {
            var folder = Folder.findOne({ _id: this.folderId });
            Meteor.call('addLogs', userId, "Downloaded file" + " " + this.originalTitle + " from " + folder.title, this._id, userName, this.folderId);
        } else {
            Meteor.call('addLogs', userId, "Downloaded file" + " " + this.originalTitle + " from submitted", this._id, userName, false);
        }
    },
    'click .viewDoc': function() {
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

            Meteor.call('addLogs', userId, "Viewed file" + " " + this.originalTitle + " from " + folder.title, this._id, userName, this.folderId);
        } else {
            Meteor.call('addLogs', userId, "Viewed file" + " " + this.originalTitle + " from submitted", this._id, userName, false);
        }
    },
    'click .viewFile': function() {
        var fileId = this._id;
        var url = this.url
            // "Aq447C7RFARGr6TDg112345";
        console.log('fileId', fileId, 'bucket_name', this.userId);

        Meteor.call('getFileUrl', fileId, this.userId, url, function(err, res) {
            if (!err) {
                console.log('res', res);
                window.open(res);
            } else {
                console.log('err', err);
            }
        });
        // Meteor.call('getTemp_key', fileId, this.userId, url,  function(err, res) {
        //     if (!err) {
        //         console.log('res', res);
        //
        //         window.open(res.data.temp_key);
        //     } else {
        //         console.log('err', err);
        //     }
        // });
    }
});
Template.folder.events({
    'click .folderData' () {
        Session.set('assignFolderId', this._id);
    }
});
Template.file.onDestroyed(() => {
    // Session.set('contextmenuFileId', null);
});