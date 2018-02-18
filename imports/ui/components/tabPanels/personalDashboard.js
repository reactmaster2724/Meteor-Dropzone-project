import './personalDashboard.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Files } from '../../../api/files/files';
import { Folder } from '../../../api/folder/folder';
import { FolderTemplate } from '../../../api/folderTemplate/folderTemplate';
import { PeriodTemplate } from '../../../api/periodTemplate/periodTemplate';
import { Activity } from '../../../api/activity/activity';


Template.personalDashboard.onCreated(function() {
    const year = (new Date()).getFullYear();
    this.firstYear = new ReactiveVar(year - 1);

});

Template.personalDashboard.helpers({
    accountOpened(fol) {
        if (fol.type == "detail") {
            return fol.issueDate;
        } else {
            return fol.accountOpened;
        }
    },
    accountClosed(fol) {
        if (fol.type == "detail") {
            return fol.expireDate;
        } else {
            return fol.accountClosed;
        }
    },
    folderTemplates() {
        return FolderTemplate.find({ type: 'personal' }, { sort: { shortDescription: 1 } });
    },
    currentYear() {
        return Template.instance().firstYear.get();
    },
    nextYear() {
        return Template.instance().firstYear.get() + 1;
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
    periodTemplate(type, folder) {
        const year = (new Date()).getFullYear();
        const firstYear = Template.instance().firstYear.get();
        const secondYear = Template.instance().firstYear.get() + 1;
        var yearData = [];
        for (var i = firstYear; i <= secondYear; i++) {
            yearData.push(i)
        }
        const periodTemplate = PeriodTemplate.find({
            $and: [
                { "type": type },
                {
                    "year": {
                        $in: yearData
                    }
                }
            ]
        }, { sort: { year: 1, month: 1 } }).fetch();
        if (folder.type == "detail") {
            var d = new Date(folder.expireDate);
        } else {
            var d = new Date(folder.accountClosed);
        }

        const y = d.getFullYear();
        const m = (d.getMonth()) + 1;
        const dateNow = new Date()
        let currentPeriod;
        return periodTemplate.map((period) => {
            const yy = period.year;
            const mm = period.month;
            if (yy == y && mm == m) {
                period.color = 'yellow';
            }
            folder.periods.filter((el) => {
                // if (el.periodTemplateId === period._id && el.red) {
                //     //period.color = 'red';
                // }
                // if (el.fileId) {
                //     period.color = 'green';
                // }

            });
            return period;
        });
    },
    files(periodId) {
        return Files.find({ periodId });
    },
    docColor(fol) {
        if (fol.type == "detail" || fol.type == "support") {
            var file = fol.file;
            if (file) {
                if (file[file.length - 1].fileUrl) {
                    return "green";
                } else {
                    return "red";
                }
            }
        } else {
            const data = fol.periods;
            for (let i = 0; i < data.length; i++) {
                if (data[i].fileId) {
                    return "green";
                }
            }
            return "red";
        }

    },
    docColorUrl(fol) {
        if (fol.type == "detail") {
            var file = fol.file;
            if (file) {
                if (file[file.length - 1].fileUrl) {
                    return file[file.length - 1].fileUrl;
                }
            }
        } else {
            const data = fol.periods;
            for (let i = 0; i < data.length; i++) {
                if (data[i].fileId) {
                    var file = Files.findOne({ _id: data[i].fileId });
                    //console.log('file', file);
                    if (file) {
                        return file.url;
                    }
                }
            }
            return false;
        }
    }
});

Template.personalDashboard.events({
    "click .nextYear": function(evt, instance) {
        const year = (new Date()).getFullYear();
        const y = Template.instance().firstYear.get() + 1;
        if (y != year) {
            instance.firstYear.set(instance.firstYear.get() + 1);
        }
    },
    //Grid Prev two year
    "click .prevYear": function(evt, instance) {
        instance.firstYear.set(instance.firstYear.get() - 1);
    },
    // "click .viewDoc": function(evt, template) {
    //     var fileId = $(evt.currentTarget).attr('data-taggroup');
    //     console.log('fileId', fileId);
    //     var file = Files.findOne({ _id: fileId });
    // var userId;
    //     if (Session.get('activeLicenseeId')) {
    //         userId = Session.get('activeLicenseeId');

    //     } else {
    //         userId = Meteor.userId();
    //     }
    //     const profile = Meteor.user({}).profile;
    //     var userName = profile.firstName + ' ' + profile.lastName;

    // Meteor.call('addLogs', userId, "Viewed file" + " " + file.name + " from personal dashboard", null,userName,false);
    // },
});