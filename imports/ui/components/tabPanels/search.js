import './search.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Files } from '../../../api/files/files';
import { Folder } from '../../../api/folder/folder';
import { FolderTemplate } from '../../../api/folderTemplate/folderTemplate';
import { PeriodTemplate } from '../../../api/periodTemplate/periodTemplate';

Template.search.onRendered(function() {
    this.autorun(() => {});
});

Template.search.helpers({
    getQueriedFiles: function() {
        var query = Session.get('search_criteria');
        let userId;
        if (Session.get('activeLicenseeId')) {
            userId = Session.get('activeLicenseeId');
        } else {
            userId = Meteor.userId();
        }
        if (query) {
            var data = Files.find({
                $and: [{
                    $or: [{
                            "originalTitle": { $regex: query, $options: "i" }
                        },
                        {
                            "title": { $regex: query, $options: "i" }
                        }
                    ]
                }, { userId: userId }]
            }).fetch();
            if (data.length > 0) {
                data.map((el) => {
                    if (el.periodId) {
                        const period = PeriodTemplate.findOne(el.periodId);
                        if (period) {
                            el.year = period.year;
                            el.period = period.month;
                            return el;
                        }
                    }
                });
            }
            return data;
        } else {
            var data = Files.find({ userId: userId }).fetch();
            if (data.length > 0) {
                data.map((el) => {
                    if (el.periodId) {
                        const period = PeriodTemplate.findOne(el.periodId);
                        if (period) {
                            el.year = period.year;
                            el.period = period.month;
                            return el;
                        }
                    }
                });
            }
            return data;
        }
    }
});

Template.search.events({
    "click .displayFolder": function(evt) {
        if (this.folderId) {
            var folder = Folder.findOne({ _id: this.folderId });
            Session.set('folder', folder);
        } else {
            Session.set('folder', false);
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
});