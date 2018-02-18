import './unAssignedLicenseeGrid.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { generatePeriodTemplate } from '../../../api/periodTemplate/methods';
import { PeriodTemplate } from '../../../api/periodTemplate/periodTemplate.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';



Template.unAssignedLicenseeGrid.onRendered(function renderLicenseeGrid() {
    this.autorun(() => {
        let data = [];

        if (Meteor.users.find({}).count() > 0) {
            data = Meteor.users.find({
                $and: [
                    { adminRole: false },
                    { suRole: false },
                    { managedByAdmins: { $nin: [Session.get('activeAdminId')] } }
                ],
                isDeleted: false
            }).fetch().map((el) => {
                var user = [];
                el.managedByAdmins.reduce((str, adminId) => {
                    const admin = Meteor.users.findOne(adminId);
                    user.push(admin.profile.firstName + ' ' + admin.profile.lastName);

                }, '');
                return {
                    userId: el._id,
                    email: el.emails[0].address,
                    firstName: el.profile ? el.profile.firstName : '',
                    lastName: el.profile ? el.profile.lastName : '',
                    otherAssignedAdmins: user.join(' ,'),
                };
            });
        }

        $('#jsGrid_unAssignedLicensee').jsGrid({
            height: 'auto',
            width: '100%',

            inserting: false,
            editing: false,
            sorting: true,
            paging: true,
            autoload: true,

            deleteConfirm: 'Do you really want to delete this user?',

            data,

            fields: [
                { name: 'firstName', type: 'text', headerTemplate: 'First Name', width: 70 },
                { name: 'lastName', type: 'text', headerTemplate: 'Last Name', width: 70 },
                { name: 'email', type: 'text', headerTemplate: 'Email', width: 70 },
                { name: 'otherAssignedAdmins', type: 'text', headerTemplate: 'Other assigned Admins', width: 100 },
                {
                    type: 'control',
                    editButton: false,
                    itemTemplate(value, data) {
                        return $('<button>')
                            .attr('type', 'button')
                            .text('Add')
                            .on('click', (e) => {
                                const activeAdminId = Session.get('activeAdminId');
                                Meteor.call('users.assign.licensee', activeAdminId, data.userId);
                                e.stopPropagation();
                            });
                    },

                },
            ],
        });
    });
});