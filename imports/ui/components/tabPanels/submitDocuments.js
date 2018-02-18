import './submitDocuments.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Files, FilesFS } from '../../../api/files/files';
import { Folder } from '../../../api/folder/folder';
import { FolderTemplate } from '../../../api/folderTemplate/folderTemplate';
import { PeriodTemplate } from '../../../api/periodTemplate/periodTemplate';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';
import { Activity } from '../../../api/activity/activity';

import {
    insertFolderTemplate,
    removeFolderTemplate,
    updateFolderTemplate,
} from '../../../api/folderTemplate/methods';

import { updateFiles, uploadGridFS } from '../../../api/files/methods';
import { isAdmin } from '../../helpers/helpers';

Template.submitDocuments.onCreated(function() {
    this.disabled = new ReactiveVar(null);
});

Template.submitDocuments.helpers({
    isAdmin() {
        return isAdmin();
    },
    files() {
        const files = Files.find({
            userId: Session.get('activeLicenseeId') || Meteor.userId(),
            isDeleted: false,
            folderId: null
        }, {
            sort: { originalTitle: 1 }
        }).fetch();

        files.map((el) => {
            el.topTitle = el.originalTitle;
            el.bottomTitle = el.title;
            return el;
        });

        //debugger;
        return files;

        // const fileToShowId = Session.get('fileToShowId'); // check if it use
        // if(Session.get('fileToShowId')) {
        //   return Files.find({
        //     _id: fileToShowId,
        //     isDeleted:false,
        //     folderId:null
        //   });
        // } else {
        //   return Files.find({
        //     userId: Session.get('activeLicenseeId') || Meteor.userId(),
        //     isDeleted:false,
        //     folderId:null
        //   });
        // }
    },
    folder() {
        return Folder.findOne(Session.get('assignFolderId'));
    },
    folderPeriods() {
        const folder = Folder.findOne(Session.get('assignFolderId'));
        return folder.periods.filter((el, i) => {
            const period = PeriodTemplate.findOne(el.periodTemplateId);
            i++;
            if (folder.periodType == 'month') {
                el.text = ((i).toString().length == 1 ? `0${i}` : i.toString()) + '/' + period.year.toString();
            } else if (folder.periodType == 'quarter') {
                el.text = `Q${i}/${period.year}`;
            } else if (folder.periodType == 'annual') {
                el.text = period.year;
            }
            return !el.fileId
        });
    },
    extention(title) {
        var substr = title.substring(title.length - 4, title.length);
        if (substr[0] == '.') {
            return title.substring(title.length - 3, title.length);
        } else {
            return substr;
        }
    },
    panelVisible() {
        return Session.get('fileToShowId');
    },
    disabled() {
        let disabled = Template.instance().disabled.get();
        return disabled || 'disabled';
    },
});

Template.submitDocuments.events({
    'click .js-assign-file' (e, template) {
        e.preventDefault();
        Session.set('fileToShowId', e.target.id);
        $('.js-panel-right').removeClass('hide');
    },
    'click .js-panel-cancel' (e, template) {
        e.preventDefault();
        $('.js-panel-right').addClass('hide');
        Session.set('fileToShowId', null);
        template.disabled.set(null);
    },
    'change #folderPeriodType' (e, template) {
        e.preventDefault();
        template.disabled.set($(e.target).val());
    },
    'click .js-panel-submit' (e, template) {
        const fileId = Session.get('fileToShowId');
        const period = $('#folderPeriodType').val();

        const balance = parseFloat($('#fileBalance').val()).toFixed(2);

        updateFiles.run(fileId, Session.get('assignFolderId'), template.disabled.get(), balance);
        Meteor.call('folder.assign.file', Session.get('assignFolderId'), fileId, period, (err) => {
            if (err) { console.error(err) }
        });
        Session.set('fileToShowId', null);
        $('.js-panel-right').addClass('hide');
    },
    // REPOSITORY
    'drop .js-dropzone' (e, template) {
        //debugger;
        e.preventDefault();
        var userId;
        if (Session.get('activeLicenseeId')) {
            userId = Session.get('activeLicenseeId');

        } else {
            userId = Meteor.userId();
        }
        var file = e.originalEvent.dataTransfer.files;

        for (var i = 0; i < file.length; i++) {

            const fileData = {
                name: file[i].name,
                type: file[i].type,
                size: file[i].size,
                originalTitle: file[i].name,
                title: file[i].name,
                isDeleted: false,
                userId: userId,
                folderId: null,
                folderTemplateId: null,
                periodId: null,
                meta: {
                    balance: 0,
                    comment: {
                        text: '',
                    },
                    reason: {
                        delete: null,
                        move: null,
                        restore: null
                    },
                },
            };


            uploadGridFS(fileData, file[i]).then((result) => {
                console.log('result', result);
                Session.set('fileFSId', result._id)
            });
        }




        const profile = Meteor.user({}).profile;
        var userName = profile.firstName + ' ' + profile.lastName;
        Meteor.call('addLogs', userId, "Droped file" + " " + file.name + " to submitted", null, userName, false);

    },
    'change #UploadFile': function(e, template) {
        if (e.currentTarget.files.length > 0) {
            uploadGridFS(e.currentTarget.files[0]).then((result) => {
                console.log(result);
            });
        }
    },
    'click .delete-context-menu' () {
        Session.set('DeleteFromSubmited', Session.get('contextmenuFileId'));
    },
    'click .viewFile': function() {
        if (Session.get('contextmenuFileId')) {
            console.log('file', Session.get('contextmenuFileId'));
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
                    console.log('res', res);
                    // window.open(res);
                    Session.set('url', res);
                } else {
                    console.log('err', err);
                }
            });
        }
    },
});

Template.submitDocuments.onDestroyed(function() {
    Session.set('fileToShowId', null);
    Template.instance().disabled.set(null);
});