import './modalEdit.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Files } from '../../../api/files/files';
import { Folder } from '../../../api/folder/folder';

import {
    updateFolder
} from '../../../api/folder/methods';

Template.modalEditFolderForm.onCreated(() => {
    Session.set('newName', false);
});

Template.modalEditFolderForm.helpers({

    folder() {
        const folderId = Session.get('modalFolderId');
        const folder = Folder.findOne(folderId);

        if (folder) {
            let openedDate;
            let closedDate;
            /*      folder.opened = {
                    mm: '',
                    dd: '',
                    yy: '',
                  }
                  folder.closed = {
                    mm: '',
                    dd: '',
                    yy: '',
                  }*/
            if (folder.type === 'account') {
                if (folder.accountOpened) {
                    openedDate = folder.accountOpened.split('/');
                    folder.opened = {
                        mm: openedDate[0],
                        dd: openedDate[1],
                        yy: openedDate[2],
                    };
                };
                if (folder.accountClosed) {
                    closedDate = folder.accountClosed.split('/');
                    folder.closed = {
                        mm: closedDate[0],
                        dd: closedDate[1],
                        yy: closedDate[2],
                    };
                }
            } else if (folder.type === 'detail') {
                if (folder.issueDate) {
                    openedDate = folder.issueDate.split('/');
                    folder.opened = {
                        mm: openedDate[0],
                        dd: openedDate[1],
                        yy: openedDate[2],
                    }
                }
                if (folder.expireDate) {
                    closedDate = folder.expireDate.split('/');
                    folder.closed = {
                        mm: closedDate[0],
                        dd: closedDate[1],
                        yy: closedDate[2],
                    };
                };
            };
        };
        return folder
    }
});

Template.modalEditFolderForm.onRendered(function() {
    $('#account-opened-edit').datepicker();
    $('#account-closed-edit').datepicker();
});

Template.modalEditFolderForm.events({
    'input .folderName': function(event) {
        Session.set('newName', event.currentTarget.value);
    },
    'click .js-modalEdit-save': function(e, tmpl) {
        e.preventDefault();

        var title = tmpl.find('#edit-folder-name').value;
        let userId;
        if (Session.get('activeLicenseeId')) {
            userId = Session.get('activeLicenseeId');
        } else {
            userId = Meteor.userId();
        }

        var parentId = Folder.findOne({ _id: Session.get('modalFolderId') }).parentId;
        var oldFolder = Folder.find({ $and: [{ parentId: parentId }, { "title": title }, { userId: userId }] }).fetch();

        if (Session.get('newName') && oldFolder.length > 0) {
            $('.Editerror').text("Folder name alredy exist.");
            Session.set('newName', false);
            return;
        } else {
            $('.Editerror').text("");
            Session.set('newName', false);

            const origfolder = Folder.findOne(Session.get('modalFolderId'));
            const data = $("#form-modal-edit").searlizeObject();
            ////////////////////

            const currentYear = (new Date()).getFullYear();

            const folder = {
                title: tmpl.find('#edit-folder-name').value
            };

            //const folder = Session.get('newFolderData');
            //folder.text = ;
            //folder.type = Session.get('newFolderData').type;

            if (origfolder.type == 'account') {
                folder.staticStringTitle = tmpl.find('#edit-file-name').value;


                var openmm = tmpl.find('#edit-folder-open-mm').value;
                var opendd = tmpl.find('#edit-folder-open-dd').value;
                var openyy = tmpl.find('#edit-folder-open-yy').value;

                if (openmm || openmm || openmm) {
                    openmm = openmm || '01';
                    opendd = opendd || '01';
                    openyy = openyy || currentYear;

                    folder.accountOpened = openmm + "/" + opendd + "/" + openyy;
                } else {
                    folder.accountOpened = null;
                }

                var closedmm = tmpl.find('#edit-folder-closed-mm').value;
                var closeddd = tmpl.find('#edit-folder-closed-dd').value;
                var closedyy = tmpl.find('#edit-folder-closed-yy').value;

                if (closedmm || closeddd || closedyy) {
                    closedmm = closedmm || '01';
                    closeddd = closeddd || '01';
                    closedyy = closedyy || currentYear;

                    folder.accountClosed = closedmm + "/" + closeddd + "/" + closedyy;
                } else {
                    folder.accountClosed = null;
                }

                folder.periodType = tmpl.find('#edit-frequently').value;

            } else if (origfolder.type == 'detail') {

                var openmm = tmpl.find('#edit-folder-open-mm').value;
                var opendd = tmpl.find('#edit-folder-open-dd').value;
                var openyy = tmpl.find('#edit-folder-open-yy').value;

                if (openmm || openmm || openmm) {
                    folder.issueDate = openmm + "/" + opendd + "/" + openyy;
                } else {
                    folder.issueDate = null;
                }

                var closedmm = tmpl.find('#edit-folder-closed-mm').value;
                var closeddd = tmpl.find('#edit-folder-closed-dd').value;
                var closedyy = tmpl.find('#edit-folder-closed-yy').value;

                if (closedmm || closeddd || closedyy) {
                    closedmm = closedmm || '01';
                    closeddd = closeddd || '01';
                    closedyy = closedyy || currentYear;

                    folder.expireDate = closedmm + "/" + closeddd + "/" + closedyy;
                } else {
                    folder.expireDate = null;
                }

            };

            updateFolder.run(Session.get('modalFolderId'), folder, data, (err) => {
                if (!err) {
                    //Session.set('modalFolderId', null);

                }
            });
            return;
        }
    }
});

Template.modalEditFolderForm.onDestroyed(() => {
    Session.set('updateTitle', false);
});
$.fn.searlizeObject = function() {
    var array = this.serializeArray() || [];
    var formData = {};
    array.forEach(function(formElem) {
        formData[formElem.name] = formElem.value;
    });
    return formData;
}