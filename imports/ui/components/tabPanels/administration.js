import './administration.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { FolderTemplate } from '../../../api/folderTemplate/folderTemplate';
import {
    insertFolderTemplate,
    removeFolderTemplate,
    updateFolderTemplate,
} from '../../../api/folderTemplate/methods';

import { Folder } from '../../../api/folder/folder';
import {
    insertFolder,
    removeFolder
} from '../../../api/folder/methods';

import { generatePeriodTemplate } from '../../../api/periodTemplate/methods';
import { PeriodTemplate } from '../../../api/periodTemplate/periodTemplate.js';

import { isAdmin } from '../../helpers/helpers';

import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import { Accounts } from 'meteor/accounts-base';

Template.administration.helpers({
    periodTemplates() {
        return PeriodTemplate.find({});
    },
    isSU() {
        if (Meteor.user()) {
            return !Meteor.user().suRole;
        }
    },
    admins() {
        return Meteor.users.find({
            $or: [
                { adminRole: true },
                { suRole: true },
            ],
            isDeleted: false
        });
    },
    admin() {
        if (Session.get('activeAdminId')) {
            return Meteor.users.findOne(Session.get('activeAdminId'));
        } else {
            return false;
        }
    },
    disabled() {
        var period = PeriodTemplate.find({}).fetch();
        if (period.length > 0) {
            return 'disabled'
        } else {
            return;
        }
    }
});

Template.administration.onCreated(function() {
    this.showDeletedUsers = new ReactiveVar(false);
});

Template.administration.onRendered(function renderAdministration() {
    this.autorun(() => {
        let data = [];
        //let dataF = [];

        if (Meteor.users.find({}).count() > 0) {
            data = Meteor.users.find({ isDeleted: Template.instance().showDeletedUsers.get() }).fetch().map((el) => {
                return {
                    userId: el._id,
                    email: el.emails[0].address,
                    firstName: el.profile ? el.profile.firstName : '',
                    lastName: el.profile ? el.profile.lastName : '',
                    password: '',
                    admin: el.adminRole || false,
                    su: el.suRole || false,
                };
            });
        }

        $('#jsGrid_users').jsGrid({
            height: 'auto',
            width: '100%',

            inserting: true,
            editing: true,
            sorting: true,
            paging: true,
            autoload: true,

            deleteConfirm: 'Do you really want to delete this user?',

            data,

            fields: [{
                    name: 'email',
                    type: 'text',
                    headerTemplate: 'Email',
                    width: 100,
                    insertcss: 'email'
                },
                {
                    name: 'firstName',
                    type: 'text',
                    headerTemplate: 'First Name',
                    width: 100,
                    insertcss: 'firstName'
                },
                {
                    name: 'lastName',
                    type: 'text',
                    width: 100,
                    headerTemplate: 'Last Name',
                    insertcss: 'lastName'
                },
                {
                    name: 'password',
                    type: 'text',
                    headerTemplate: 'Password',
                    width: 50,
                    insertcss: 'password'
                },
                {
                    name: 'admin',
                    type: 'checkbox',
                    headerTemplate: 'Admin',
                    width: 50,
                    insertcss: 'adminRole'
                },
                {
                    name: 'su',
                    type: 'checkbox',
                    headerTemplate: 'Super User',
                    width: 50,
                    insertcss: 'suRole'
                },
                {
                    type: 'control',
                    headerTemplate: 'Avatar',
                    itemTemplate: '',
                    editTemplate() {
                        return $('<button>')
                            .attr('type', 'button')
                            .text('Add')
                            .on('click', (e) => {
                                console.log(this);
                                e.stopPropagation();
                            });
                    },
                    insertTemplate() {
                        return $('<button>')
                            .attr('type', 'button')
                            .text('Add')
                            .on('click', (e) => {
                                console.log(this);
                                e.stopPropagation();
                            });
                    },
                    width: 50,
                    deleteButton: false,
                    editButton: false,
                },
                {
                    type: 'control',
                    insertTemplate() {
                        var grid = $("#jsGrid_users").data("JSGrid");
                        return $("<input>").addClass("jsgrid-button")
                            .addClass("jsgrid-update-button")
                            .addClass("user-insert")
                            .attr({
                                type: "button",
                            })
                            .on("click", function() {
                                grid.insertItem().done(function() {
                                    grid.option("inserting", false)
                                });
                            })
                            .add($("<input>")
                                .addClass("jsgrid-button")
                                .addClass("jsgrid-cancel-edit-button")
                                .attr({
                                    type: "button",
                                })
                                .on("click", function() {
                                    grid.option("inserting", false);
                                }));
                    }
                },
            ],

            onItemInserting(args) {
                console.log("users", args);
                Meteor.call('user.create', args.item, (err, res) => {
                    if (err) {
                        console.error(err);
                        args.cancel = true;
                    } else {
                        Meteor.call('users.update.profile', res, args.item,
                            (error) => {
                                if (error) { console.error('update error', error) }
                            });
                    }
                });
            },

            onItemDeleting(args) {
                Meteor.call('users.delete', args.item.userId, (err) => {
                    if (err) {
                        console.error(err);
                        args.cancel = true;
                    }
                });
            },

            onItemUpdating(args) {
                if (args.item.email === '') {
                    console.error('"email" is required!');
                    args.cancel = true;
                } else {
                    Meteor.call('users.update', args.item, (err) => {
                        if (err) {
                            console.error(err);
                            args.cancel = true;
                        }
                    });
                }
            },

        });

        // let dataTemplateF = [];
        let gridDataTemplateF = [];
        //if (FolderTemplate.find({}).count() > 0) {
        const dataFolders = [];

        let options = {};
        switch (Session.get('headerTab')) {
            case 'financialDashboard':
                options = { type: 'financial' };
                break;
            case 'personalDashboard':
                options = { type: 'personal' };
                break;
            default:
                options = {};
        }

        // dataTemplateF = FolderTemplate.find(options).fetch().map((el) => {
        //   const obj = {
        //     code: el.code || "",
        //     section: el.section,
        //     id: el._id,
        //     type: el.type,
        //     parent: '#',
        //     text: el.shortDescription || "",
        //     icon: '',
        //     state: {
        //       opened: false,
        //       disabled: false,
        //       selected: false,
        //     },
        //     li_attr: {
        //       class: 'title',
        //     },
        //     a_attr: {},
        //   }
        //   return obj;
        // });

        gridDataTemplateF = FolderTemplate.find({}).fetch().map((el) => {
            return {
                code: el.code || "",
                section: el.section,
                id: el._id,
                type: el.type,
                text: el.shortDescription || "",
            };
        });

        //var gridDataTemplateF = dataTemplateF;
        //console.log(gridDataTemplateF,data);

        /*      dataTemplateF.map((temp) => {
                let options = { folderTemplateId: temp.id };
                if (Session.get('activeLicenseeId')) {
                  options.userId = Session.get('activeLicenseeId');
                } else {
                  options.userId = Meteor.userId();
                }
                console.log('options', options);
                console.log('options', Folder.find(options).fetch());
                Folder.find(options).fetch().forEach((folder) => {
                  const obj = {
                    id: folder._id,
                    parent: folder.parentId,
                    text: folder.title,
                    icon: '',
                    state: {
                      opened: false,
                      disabled: false,
                      selected: false
                    },
                    li_attr: {
                      class: 'title'
                    },
                    a_attr: {}
                  };
                  dataFolders.push(obj);
                });
              });

              Session.set('jstree-data', dataTemplateF.concat(dataFolders));*/
        //}

        $("#jsGrid_foldersTemplate").jsGrid({
            height: 'auto',
            width: '100%',

            inserting: true,
            editing: true,
            sorting: true,
            paging: true,
            autoload: true,

            deleteConfirm: 'Do you really want to delete the client?',

            data: gridDataTemplateF,

            fields: [{
                    name: 'type',
                    headerTemplate: 'Type',
                    type: 'select',
                    items: [
                        { name: 'Financial', value: 'financial' },
                        { name: 'Personal', value: 'personal' },
                    ],
                    insertcss: 'type',
                    valueField: 'value',
                    textField: 'name',
                    width: 50
                },
                {
                    name: 'section',
                    headerTemplate: 'Section',
                    type: 'select',
                    items: [
                        { name: 'Assets', value: 'Assets' },
                        { name: 'Liabilities', value: 'Liabilities' },
                        { name: 'None', value: '' }
                    ],
                    insertcss: 'section',
                    valueField: 'value',
                    textField: 'name',
                    width: 50
                },
                {
                    name: 'code',
                    headerTemplate: 'Code',
                    type: 'text',
                    insertcss: 'code',
                    width: 50
                },
                {
                    name: 'text',
                    headerTemplate: 'Text',
                    type: 'text',
                    insertcss: 'text',
                    width: 150
                },
                {
                    type: 'control'
                },
            ],

            onItemInserted(args) {
                insertFolderTemplate.run(args.item);
                args.cancel = true;
            },

            onItemDeleting(args) {
                removeFolderTemplate.run(args.item.id);
            },

            onItemUpdated(args) {
                const code = args.grid.data.find((el) => {
                    return el.id === args.item.id;
                }).code;
                updateFolderTemplate.run(args.previousItem.id, args.item);
            }
        });
        //}
    });
});


Template.administration.events({
    'click .js-show-deleted' (ev, template) {
        ev.preventDefault();
        template.showDeletedUsers.set(!template.showDeletedUsers.get());
    },
    'click .js-generate-periods' (ev) {
        ev.preventDefault();

        generatePeriodTemplate.run(2007);
        generatePeriodTemplate.run(2008);
        generatePeriodTemplate.run(2009);
        generatePeriodTemplate.run(2010);
        generatePeriodTemplate.run(2011);
        generatePeriodTemplate.run(2012);
        generatePeriodTemplate.run(2013);
        generatePeriodTemplate.run(2014);
        generatePeriodTemplate.run(2015);
        generatePeriodTemplate.run(2016);
        generatePeriodTemplate.run(2017);
        // if(PeriodTemplate.find().count() === 0) {
        //   const currentYear = (new Date()).getFullYear()
        //   generatePeriodTemplate.run(currentYear);
        // }

        // const maxYear = PeriodTemplate.findOne({},{sort: {year: -1}});
        // if(maxYear) {
        //   generatePeriodTemplate.run(maxYear.year + 1);
        // } else {
        //   generatePeriodTemplate.run(2017);
        // }

    },
    'click .js-admin-dropdown' (ev, template) {
        ev.preventDefault();
        Session.set('activeAdminId', ev.target.id);
    },
    'click .jsgrid-insert-mode-button.jsgrid-mode-on-button' (ev) {
        ev.preventDefault();
        $('#jsGrid_foldersTemplate').jsGrid("clearInsert");
        $('#jsGrid_users').jsGrid("clearInsert");
    },
});

Template.administration.onDestroyed(() => {
    Session.set('activeAdminId', null);
});