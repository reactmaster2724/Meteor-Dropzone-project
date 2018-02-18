import './licenseeDropdown.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';


Template.licenseeDropdown.helpers({
    showName() {
        if (Session.get('activeLicenseeId')) {
            const user = Meteor.users.findOne(Session.get('activeLicenseeId'));
            if (user && user.profile) {
                return `${user.profile.firstName} ${user.profile.lastName}`;
            }
        } else {
            if (Meteor.user()) {
                return `${Meteor.user().profile.firstName} ${Meteor.user().profile.lastName}`;
            }
        }
    },
    isAdmin() {
        if (Meteor.user()) {
            return !Meteor.user().adminRole;
        }
    },
    licensees() {
        if (Meteor.user() && Meteor.user().licenseesManaged) {
            const licenseeIds = Meteor.user().licenseesManaged;
            var Data = [];
            licenseeIds.forEach(function(id) {
                const user = Meteor.users.findOne(id);
                if (user && user.profile) {
                    Data.push({
                        id: id,
                        name: `${user.profile.firstName} ${user.profile.lastName}`,
                    })
                }
            });
            return Data;
        }
    },
});

Template.licenseeDropdown.onRendered(function() {
    // Meteor.setTimeout(function() {
    //   $('.ui.dropdown').dropdown();
    // }, 2000);
});

Template.licenseeDropdown.events({
    'click .js-licensee-dropdown' (ev, template) {
        ev.preventDefault();
        if (Session.get('showDocumentSettings') || Session.get('confirmRemove') || Session.get('viewInfo')) {
            alert('Can not change user, Please complete current process first.');
        } else {
            Session.set('activeLicenseeId', ev.target.id);
        }
    }
});

Template.licenseeDropdown.onDestroyed(() => {
    Session.set('activeLicenseeId', null);
});