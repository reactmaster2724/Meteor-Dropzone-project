import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { FolderTemplate } from '../../api/folderTemplate/folderTemplate';
import { Folder } from '../../api/folder/folder';
import {
    insertFolderTemplate,
    removeFolderTemplate,
    updateFolderTemplate,
} from '../../api/folderTemplate/methods';
import { insertFolder, removeFolder } from '../../api/folder/methods';
import { PeriodTemplate } from '../../api/periodTemplate/periodTemplate';
import { isAdmin } from '../helpers/helpers';


function openNewFolderModal() {
    $('#newFolderModal').modal({
        onHide: function() {
            Session.set('newFolderData', null);
            $("#new-folder-name").val('');
            $("#new-folder-file-name").val('');
            $("#new-folder-open-mm").val('');
            $("#new-folder-open-dd").val('');
            $("#new-folder-open-yy").val('');

            const instance = $('#jstree_div_financial').jstree(true);
            instance.delete_node(Session.get('node'));
            Session.set('node', null);
        },
    }).modal('show');
}

Template.foldersTreeF.onRendered(function renderApp() {
    $('#jstree_div_archive').jstree({
        core: {
            data(node, cb) {
                if (Session.get('jstree-data-archive')) {
                    cb(Session.get('jstree-data-archive'));
                }
            },
            multiple: false,
            check_callback(op, node) {
                return true;
            },
            themes: {
                dots: false,
                icons: false,
                stripes: false,
            },
        },
        plugins: ['contextmenu'],
        contextmenu: {
            items($node) {
                const tree = $('#jstree_div_archive').jstree(true);
                return {
                    'New': {
                        label: 'New',
                        separator_after: true,
                        submenu: {
                            folder: {
                                label: 'Folder',
                                submenu: {
                                    month: {
                                        label: 'Month',
                                        action(data) {
                                            $node = tree.create_node($node);
                                            tree.edit($node, null, (newNode) => {
                                                newNode.periodType = 'month';
                                                newNode.userId = Session.get('activeLicenseeId');
                                                Session.set('newFolderData', newNode);
                                            });
                                            openNewFolderModal();
                                            Session.set('node', $node);
                                            $('.js-newModal-select').val('month');
                                        },
                                    },
                                    quarter: {
                                        label: 'Quarter',
                                        action() {
                                            $node = tree.create_node($node);
                                            tree.edit($node, null, (newNode) => {
                                                newNode.periodType = 'quarter';
                                                newNode.userId = Session.get('activeLicenseeId');
                                                Session.set('newFolderData', newNode);
                                            });
                                            openNewFolderModal();
                                            Session.set('node', $node);
                                            $('.js-newModal-select').val('quarter');
                                        },
                                    },
                                    year: {
                                        label: 'Year',
                                        action() {
                                            $node = tree.create_node($node);
                                            tree.edit($node, null, (newNode) => {
                                                newNode.periodType = 'annual';
                                                newNode.userId = Session.get('activeLicenseeId');
                                                Session.set('newFolderData', newNode);
                                            });
                                            openNewFolderModal();
                                            Session.set('node', $node);
                                            $('.js-newModal-select').val('annual');
                                        },
                                    },
                                },
                            },

                            file: {
                                label: 'File',
                                action() {
                                    console.log('add file');
                                },
                            },
                        },
                    },
                    rename: {
                        label: 'Edit',
                        "_class": "js-edit-contextmenu",
                        action(data) {
                            const inst = $.jstree.reference(data.reference),
                                obj = inst.get_node(data.reference);
                            Session.set('modalFolderId', obj.id);
                            $('#editFolderModal').modal({
                                onShow() {
                                    const folderId = obj.id;
                                    $('.js-editModal-select').val(Folder.findOne(Session.get('modalFolderId')).periodType);
                                },
                                onDeny() {
                                    Session.set('modalFolderId', null);
                                },
                            }).modal('show');
                        },
                    },
                    remove: {
                        label: 'Delete',
                        "_class": "js-delete-contextmenu",
                        action(data) {
                            const inst = $.jstree.reference(data.reference),
                                obj = inst.get_node(data.reference);
                            if (inst.is_selected(obj)) {
                                inst.delete_node(inst.get_selected());
                            } else {
                                inst.delete_node(obj);
                            }
                            removeFolder.run(obj.id)
                        },
                    },
                };
            }
        },
    }).bind("redraw.jstree", function() {
        $('#jstree_div_archive').jstree('open_all');
    });


    this.autorun(() => {
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

        var dataArchive = FolderTemplate.find({ type: 'archive' }).fetch().map((el) => {
            const obj = {
                code: el.code,
                section: el.section,
                id: el._id,
                type: el.type,
                parent: '#',
                text: el.shortDescription,
                icon: '',
                state: {
                    opened: false,
                    disabled: false,
                    selected: false,
                },
                li_attr: {
                    class: 'title',
                },
                a_attr: {},
            }
            return obj;
        });

        dataArchive.map((temp) => {
            let options = { folderTemplateId: temp.id };
            if (Session.get('activeLicenseeId')) {
                options.userId = Session.get('activeLicenseeId');
            } else {
                options.userId = Meteor.userId();
            }

            Folder.find(options, { sort: { title: 1 } }).fetch().forEach((folder) => {
                const obj = {
                    id: folder._id,
                    parent: folder.parentId,
                    text: folder.title,
                    icon: '',
                    state: {
                        opened: false,
                        disabled: false,
                        selected: false,
                    },
                    li_attr: {
                        class: 'title',
                    },
                    a_attr: {},
                };
                dataFolders.push(obj);
            });
        });
        Session.set('jstree-data-archive', dataArchive.concat(dataFolders));
    });
});