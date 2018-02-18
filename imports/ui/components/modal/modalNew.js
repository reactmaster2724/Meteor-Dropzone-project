import './modalNew.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Files } from '../../../api/files/files';
import { Folder } from '../../../api/folder/folder';

import {
    insertFolder
} from '../../../api/folder/methods';


Template.modalNewFolderForm.onRendered(function() {
    $('#account-opened').datepicker();
    $('#account-closed').datepicker();
});

Template.modalNewFolderForm.helpers({
    modalType() {
        if (Session.get('newFolderData')) {
            return Session.get('newFolderData').type;
        }
    }
});

Template.modalNewFolderForm.events({
    'keypress #new-folder-open-mm, keypress #new-folder-open-dd, keypress #new-folder-open-yy, keypress #new-folder-closed-mm, keypress #new-folder-closed-dd, keypress #new-folder-closed-yy': function(evt) {
        var k = evt.charCode || evt.keyCode;
        if (k >= 48 && k <= 57) {
            return true;
        } else {
            return false;
        }
    },
    'submit #form-modal': function(e, tmpl) {
        e.preventDefault();
        var title = tmpl.find('#new-folder-name').value;

        var openmm = tmpl.find('#new-folder-open-mm').value;
        var opendd = tmpl.find('#new-folder-open-dd').value;
        var openyy = tmpl.find('#new-folder-open-yy').value;
        if (openmm || opendd || openyy) {
            if (openmm <= 0 || openmm > 12 || opendd <= 0 || opendd > 31 || openyy.length != 4) {
                $('.errorDate').text("Date is not valid");
                return;
            } else {
                $('.errorDate').text("");
            }
        }

        var closedmm = tmpl.find('#new-folder-closed-mm').value;
        var closeddd = tmpl.find('#new-folder-closed-dd').value;
        var closedyy = tmpl.find('#new-folder-closed-yy').value;
        if (closedmm || closeddd || closedyy) {
            if (closedmm <= 0 || closedmm > 12 || closeddd <= 0 || closeddd > 31 || closedyy.length != 4) {
                $('.errorCloseDate').text("Date is not valid");
                return;
            } else {
                $('.errorCloseDate').text("");
            }
        }



        if (title) {
            $('.error').text("");
            let userId;
            if (Session.get('activeLicenseeId')) {
                userId = Session.get('activeLicenseeId');
            } else {
                userId = Meteor.userId();
            }
            var oldFolder = Folder.find({ $and: [{ parentId: Session.get('newFolderData').parent }, { "title": title }, { userId: userId }] }).fetch();
            if (oldFolder.length > 0) {
                $('.error').text("Folder name alredy exist.");
            } else {
                $('.error').text("");

                const currentYear = (new Date()).getFullYear();
                const folder = Session.get('newFolderData');
                folder.text = tmpl.find('#new-folder-name').value;
                folder.type = Session.get('newFolderData').type;

                if (Session.get('newFolderData').type == 'account') {
                    var logMessage = "Created account type folder";
                    folder.staticStringTitle = tmpl.find('#new-folder-file-name').value;


                    if (openmm || openmm || openmm) {
                        openmm = openmm || '01';
                        opendd = opendd || '01';
                        openyy = openyy || currentYear;
                        folder.accountOpened = openmm + "/" + opendd + "/" + openyy;
                    } else {
                        folder.accountOpened = null;
                    }


                    if (closedmm || closeddd || closedyy) {
                        closedmm = closedmm || '01';
                        closeddd = closeddd || '01';
                        closedyy = closedyy || currentYear;

                        folder.accountClosed = closedmm + "/" + closeddd + "/" + closedyy;
                    } else {
                        folder.accountClosed = null;
                    }

                    folder.periodType = tmpl.find('#frequently').value;
                } else if (Session.get('newFolderData').type == 'detail') {
                    var logMessage = "Created detail type folder";
                    // var openmm = tmpl.find('#new-folder-open-mm').value;
                    // var opendd = tmpl.find('#new-folder-open-dd').value;
                    // var openyy = tmpl.find('#new-folder-open-yy').value;

                    if (openmm || openmm || openmm) {
                        openmm = openmm || '01';
                        opendd = opendd || '01';
                        openyy = openyy || currentYear;

                        folder.issueDate = openmm + "/" + opendd + "/" + openyy;
                    } else {
                        folder.issueDate = null;
                    }

                    // var closedmm = tmpl.find('#new-folder-closed-mm').value;
                    // var closeddd = tmpl.find('#new-folder-closed-dd').value;
                    // var closedyy = tmpl.find('#new-folder-closed-yy').value;

                    if (closedmm || closeddd || closedyy) {
                        closedmm = closedmm || '01';
                        closeddd = closeddd || '01';
                        closedyy = closedyy || currentYear;

                        folder.expireDate = closedmm + "/" + closeddd + "/" + closedyy;
                    } else {
                        folder.expireDate = null;
                    }
                    folder.periodType = "month";
                } else {
                    var logMessage = "Created support type folder";
                }

                const profile = Meteor.user({}).profile;
                var userName = profile.firstName + ' ' + profile.lastName;
                Meteor.call('addLogs', userId, logMessage, false, userName, Session.get('newFolderData').parent);

                const d = $("#form-modal").searlizeObject();
                insertFolder.run(folder, d);
                $('#newFolderModal').modal('hide');
                $('#new-folder-name').val("");
                $('#new-folder-file-name').val("");
                $('#new-folder-open-mm').val("");
                $('#new-folder-open-dd').val("");
                $('#new-folder-open-yy').val("");
                $('#comment').val("");
                tmpl.find("form").reset();
            }
        } else {
            $('.error').text("Title field is required.");
            return;
        }

    },
});

$.fn.searlizeObject = function() {
    var array = this.serializeArray() || [];
    var formData = {};
    array.forEach(function(formElem) {
        formData[formElem.name] = formElem.value;
    });
    return formData;
}