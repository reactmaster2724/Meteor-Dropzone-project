import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';

import '/imports/ui/layouts/app-body.js';
import '/imports/ui/pages/app-not-found.js';
import '/imports/ui/pages/app-timeline.js';


FlowRouter.route('/', {
    name: 'App_timeline',
    subscriptions() {
        this.register('usersMe', Meteor.subscribe('usersMe'));
        this.register('usersAdmin', Meteor.subscribe('usersAdmin'));
        this.register('usersLicensees', Meteor.subscribe('usersLicensees'));
        this.register('files', Meteor.subscribe('files'));
        this.register('filesFS', Meteor.subscribe('filesFS'));
        this.register('folderTemplate', Meteor.subscribe('folderTemplate', 'personal'));
        this.register('folderTemplate', Meteor.subscribe('folderTemplate', 'financial'));
        this.register('folderTemplate', Meteor.subscribe('folderTemplate', 'archive'));
        this.register('folder', Meteor.subscribe('folder'));
        this.register('periodTemplate', Meteor.subscribe('periodTemplate'));
        this.register('configData', Meteor.subscribe('configData'));
        this.register('activity', Meteor.subscribe('activity'));
    },
    action() {
        if (!Meteor.userId()) {
            FlowRouter.go('/signIn');
        } else {
            BlazeLayout.render('App_body', { main: 'App_timeline' });
        }
    },
});

FlowRouter.notFound = {
    action() {
        BlazeLayout.render('App_body', { main: 'App_notFound' });
    },
};

AccountsTemplates.configureRoute('signIn', {
    name: 'signin',
    path: '/signin',
});

AccountsTemplates.configureRoute('changePwd', {
    name: 'changepwd',
    path: '/change-password',
});

// AccountsTemplates.configureRoute('signUp', {
//   name: 'join',
//   path: '/join',
// });

AccountsTemplates.configureRoute('forgotPwd', {
    name: 'forgotpwd',
    path: '/forgot-password',
});

AccountsTemplates.configureRoute('resetPwd', {
    name: 'resetPwd',
    path: '/reset-password',
});