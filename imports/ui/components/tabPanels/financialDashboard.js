import './financialDashboard.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Files, FilesFS } from '../../../api/files/files';
import { Folder } from '../../../api/folder/folder';
import { FolderTemplate } from '../../../api/folderTemplate/folderTemplate';
import { PeriodTemplate } from '../../../api/periodTemplate/periodTemplate';
import { Activity } from '../../../api/activity/activity';

const SECTIONS = [
    { name: 'Assets' },
    { name: 'Liabilities' }
];

Template.financialDashboard.onCreated(function() {
    const year = (new Date()).getFullYear();
    this.firstYear = new ReactiveVar(year - 1);
    Session.set('assignFolderId', false);
});

Template.financialDashboard.helpers({
    sections() {
        return SECTIONS;
    },
    currentYear() {
        return Template.instance().firstYear.get();
    },
    nextYear() {
        return Template.instance().firstYear.get() + 1;
    },
    eoyStartYY() {
        return Template.instance().firstYear.get();
    },
    eoyCloseYY() {
        return Template.instance().firstYear.get() + 1;
    },
    periodTemplate(type, folder) {
        const year = (new Date()).getFullYear();
        const firstYear = Template.instance().firstYear.get();
        const secondYear = Template.instance().firstYear.get() + 1;
        const periodTemplate = PeriodTemplate.find({
            $and: [
                { "type": type },
                {
                    "year": {
                        $in: [firstYear, secondYear]
                    }
                }
            ]
        }, { sort: { year: 1, month: 1 } }).fetch();
        let currentPeriod;
        return periodTemplate.map((period) => {
            folder.periods.filter((el) => {
                if (el.periodTemplateId === period._id && el.red) {
                    period.color = 'red';
                }
                if (el.periodTemplateId === period._id && el.fileId) {
                    period.color = 'green';
                    period.fileId = el.fileId;
                    var file = Files.findOne({ _id: el.fileId });
                    if (file) {
                        period.url = file.url;
                    }
                }
            });
            var file = Files.findOne({ periodId: period._id });
            if (file && file.meta) {
                period.balance = Files.findOne({ periodId: period._id }).meta.balance;
            }
            return period;
        });
    },
    folderTemplates() {
        var folderData = FolderTemplate.find({ type: 'financial' }, { sort: { shortDescription: 1 } }).fetch();
        return folderData;
    },
    folders(folderTemplateId) {
        let userId;
        if (Session.get('activeLicenseeId')) {
            userId = Session.get('activeLicenseeId');
        } else {
            userId = Meteor.userId();
        }

        var data = Folder.find({ $and: [{ parentId: folderTemplateId }, { userId: userId }] }, { sort: { title: 1 } }).fetch();
        return data;
    },
    EoyView(fol) {
        return true;
    },
    //Find all balance from current file which is active in folder and get last from year
    findBalanceF(fol) {
        const periods = fol.periods;
        var data = [];
        for (var i = 0; i < periods.length; i++) {
            if (periods[i].fileId) {
                const periodTemplateId = periods[i].periodTemplateId;
                const per = PeriodTemplate.find(periodTemplateId).fetch();
                if (per.length > 0) {
                    if (parseInt(Template.instance().firstYear.get()) == per[0].year) {
                        const bal = Files.findOne({ _id: periods[i].fileId })
                        if (bal && bal.meta) {
                            data.push(bal.meta.balance)
                        }
                    }
                }
            }
        }
        if (data.length > 0) {
            return data[data.length - 1];
        }
    },
    findBalanceS(fol) {
        const periods = fol.periods;
        var data = [];
        for (var i = 0; i < periods.length; i++) {
            if (periods[i].fileId) {
                const periodTemplateId = periods[i].periodTemplateId;
                const per = PeriodTemplate.find(periodTemplateId).fetch();
                if (per.length > 0) {
                    if (parseInt(Template.instance().firstYear.get() + 1) == per[0].year) {
                        const bal = Files.findOne({ _id: periods[i].fileId })
                        if (bal && bal.meta) {
                            data.push(bal.meta.balance)
                        }
                    }
                }
            }
        }
        if (data.length > 0) {
            return data[data.length - 1];
        }
    },
    viewBalanceF(fol) {
        var issueDate = new Date(fol.issueDate);
        var yy = issueDate.getFullYear();
        if (parseInt(Template.instance().firstYear.get()) == yy) {
            var file = fol.file;
            return file[file.length - 1].balance;
        }
    },
    viewBalanceS(fol) {
        var issueDate = new Date(fol.issueDate);
        var yy = issueDate.getFullYear();
        if (parseInt(Template.instance().firstYear.get() + 1) == yy) {
            var file = fol.file;
            return file[file.length - 1].balance;
        }
    },
});

Template.financialDashboard.events({
    "click .nextYear": function(evt, instance) {
        const year = (new Date()).getFullYear();
        const y = Template.instance().firstYear.get() + 1;
        if (y != year) {
            instance.firstYear.set(instance.firstYear.get() + 1);
        }
    },
    //Grid Prev two year
    "click .prevYear": function(evt, instance) {
        const year = (new Date()).getFullYear();
        const y = Template.instance().firstYear.get() - 1;
        if (y != (year - 11)) {
            instance.firstYear.set(instance.firstYear.get() - 1);
        }
    },
    "click .viewDoc": function(evt, template) {
        var fileId = $(evt.currentTarget).attr('data-taggroup');
        var file = Files.findOne({ _id: fileId });
        if (file) {
            var userId;
            if (Session.get('activeLicenseeId')) {
                userId = Session.get('activeLicenseeId');

            } else {
                userId = Meteor.userId();
            }
            const profile = Meteor.user({}).profile;
            var userName = profile.firstName + ' ' + profile.lastName;


            console.log("Viewing from the financia dashboard: ", fileId)
                // "Aq447C7RFARGr6TDg112345";
            Meteor.call('getFileUrl', fileId, userId, file.url, function(err, res) {
                if (!err) {
                    console.log('res', res);
                    window.open(res);
                } else {
                    console.log('err', err);
                }
            });
            Meteor.call('addLogs', userId, "Viewed file" + " " + file.name + " from financial dashboard", null, userName, false);
        } else {
            console.log('file not found in database');
        }
    },
});