import './app-timeline.html';

import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Users } from '../../api/users/users';
import { Files } from '../../api/files/files';
import { Folder } from '../../api/folder/folder';
import { FolderTemplate } from '../../api/folderTemplate/folderTemplate';

import { Activity } from '../../api/activity/activity';
import { Config } from '../../api/config/config.js';

Template.App_timeline.onCreated(function() {
    TemplateVar.set('meReady', false);
    TemplateVar.set('templateFolderReady', false);
    TemplateVar.set('dateFrom', false);
    TemplateVar.set('dateTo', false);
});

Template.App_timeline.onRendered(function() {
    $('.ui.checkbox').checkbox();
    /*  FlowRouter.subsReady("usersMe", function() {
        TemplateVar.set('meReady',true);
      });*/
});


var timer;

Template.App_timeline.helpers({
    showDocumentSettings() {
        return Session.get('showDocumentSettings');
    },
    userActive() {
        var configData = Config.find({ "runEnv": process.env.NODE_ENV }).fetch();
        if (configData.length > 0) {
            timer = setTimeout(showModal, 60000 * configData[0].userTimeOut);
        }
    },
    folderName() {
        if (Session.get('assignFolderId')) {
            var folder = Folder.find({ _id: Session.get('assignFolderId') }).fetch();
            if (folder.length > 0) {
                return folder[0].title;
            }

            var folderTemplate = FolderTemplate.find({ _id: Session.get('assignFolderId') }).fetch();
            if (folderTemplate.length > 0) {
                return folderTemplate[0].shortDescription;
            }
        }
    },
    activitys() {

        let userId;
        if (Session.get('activeLicenseeId')) {
            userId = Session.get('activeLicenseeId');
        } else {
            userId = Meteor.userId();
        }
        var dateFrom = TemplateVar.get('dateFrom');
        var dateTo = TemplateVar.get('dateTo');
        var folderId = Session.get('assignFolderId');
        var folderIdData = [];
        var folder = Folder.find({ parentId: folderId }).fetch();
        folderIdData.push(folderId);
        folder.forEach(function(ele) {
            folderIdData.push(ele._id);
        });
        if (folderId) {
            if (dateFrom || dateTo) {
                var activity = Activity.find({
                    $and: [
                        { userId: userId },
                        {
                            'createdAt': {
                                $gte: dateFrom,
                                $lte: dateTo
                            }
                        },
                        { "folderId": { $in: folderIdData } }
                    ]
                }, {
                    sort: {
                        "createdAt": -1
                    }
                }).fetch();
            } else {
                var activity = Activity.find({
                    $and: [
                        { userId: userId },
                        { "folderId": { $in: folderIdData } }
                    ]
                }, {
                    sort: {
                        "createdAt": -1
                    }
                }).fetch();
            }
        } else {
            var activity = Activity.find({ userId: userId }, {
                sort: {
                    "createdAt": -1
                }
            }).fetch();
        }
        var data = [];

        for (var i = 0; i < activity.length; i++) {
            const profile = Meteor.user({ _id: activity[i].parentUserId }).profile;
            var file = Files.findOne({ _id: activity[i].fileId });
            data.push({
                user: `${profile.firstName[0]}${profile.lastName[0]}`,
                userName: activity[i].parentUser,
                reason: activity[i].reason,
                date: DateFormat(activity[i].createdAt)
            })
        }
        return data;
    },
    meReady() {
        if (FlowRouter.subsReady("usersMe")) {
            TemplateVar.set('meReady', true);
            // console.log(Meteor.user());
        };

        if (FlowRouter.subsReady("folderTemplate")) {
            TemplateVar.set('templateFolderReady', true);
            //console.log(Meteor.user());
        };

        if ((Session.get('jstree-data') || TemplateVar.get('templateFolderReady')) && TemplateVar.get('meReady')) {
            // console.log("render tree");
            return true;
        }

        /*    if((Session.get('jstree-data') || TemplateVar.get('templateFolderReady')) && TemplateVar.get('meReady')) {
              console.log("render tree");
              return true;
            }*/

        return false;


        //return TemplateVar.get('meReady');
    },
    isSU() {
        var user = Users.findOne({
            _id: Meteor.userId()
        });
        //console.log(user.fetch());
        //console.log(user.suRole);
        if (user && user.suRole) {
            console.log(user.suRole);
            //return Meteor.user().suRole;
            return user.suRole;
        }

        /*    if(Meteor.user() && Meteor.user().suRole) {

            }*/
        return false;
    }
});



showModal = function() {
    Meteor.logout();
};


Template.App_timeline.events({
    'mousemove, mousedown, touchstart, keypress': function() {
        clearTimeout(timer);
        var configData = Config.find({ "runEnv": process.env.NODE_ENV }).fetch();
        if (configData.length > 0) {
            timer = setTimeout(showModal, 60000 * configData[0].userTimeOut);
        }
    },
    'change .dateFrom' (evt) {
        if (Date.parse($('#dateFrom').val())) {
            var date = new Date($('#dateFrom').val()).toISOString();
            TemplateVar.set('dateFrom', date);
        } else {
            TemplateVar.set('dateFrom', false);
        }
    },
    'change .dateTo' (evt) {
        if (Date.parse($('#dateTo').val())) {
            var dateD = new Date($('#dateTo').val());
            var d = new Date();
            var newdate = new Date(dateD.setHours(d.getHours() + 1)).toISOString();
            TemplateVar.set('dateTo', newdate);
        } else {
            TemplateVar.set('dateTo', false);
        }
    },
    'click #open-activity-block' (ev) {
        ev.preventDefault();
        $('#activity-block').fadeIn();
    },
    'click #activity-block > .bg' (ev) {
        ev.preventDefault();
        $('#activity-block').fadeOut();
    },
});

Template.App_timeline.onDestroyed(function() {
    //console.log('destroy');
    Session.set('headerTab', null);
});

function DateFormat(date) {
    var d = new Date(date);
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    var month = d.getMonth() + 1;
    return month + '-' + d.getDate() + '-' + d.getFullYear().toString().substr(-2) + ' ' + strTime;

}