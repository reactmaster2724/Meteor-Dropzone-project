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

            const instance = $('#jstree_div_personal').jstree(true);
            instance.delete_node(Session.get('node'));
            Session.set('node', null);
        },
    }).modal('show');
}

Template.foldersTreeP.events({
    "click .jstree-ocl": function() {
        Session.set('assignFolderId', null);
    },
});
Template.foldersTreeP.onRendered(function renderApp() {
    $('#jstree_div_personal').jstree({
        core: {
            data(node, cb) {
                if (Session.get('jstree-data-personal')) {
                    cb(Session.get('jstree-data-personal'));
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
        plugins: isAdmin() ? ['contextmenu'] : [],
        contextmenu: {
            items($node) {
                const tree = $('#jstree_div_personal').jstree(true);
                if (FolderTemplate.findOne($node.id)) {
                    return {
                        'New': {
                            label: 'New',
                            separator_after: true,
                            submenu: {
                                account: {
                                    label: 'Account',
                                    action(data) {
                                        $node = tree.create_node($node);
                                        tree.edit($node, null, (newNode) => {
                                            newNode.type = 'account';
                                            newNode.userId = Session.get('activeLicenseeId');
                                            Session.set('newFolderData', newNode);
                                        });
                                        openNewFolderModal();
                                        Session.set('node', $node);
                                    },
                                },
                                detail: {
                                    label: 'Detail',
                                    action(data) {
                                        $node = tree.create_node($node);
                                        tree.edit($node, null, (newNode) => {
                                            newNode.type = 'detail';
                                            newNode.userId = Session.get('activeLicenseeId');
                                            Session.set('newFolderData', newNode);
                                        });
                                        openNewFolderModal();
                                        Session.set('node', $node);
                                    },
                                },
                                support: {
                                    label: 'Support',
                                    action(data) {
                                        $node = tree.create_node($node);
                                        tree.edit($node, null, (newNode) => {
                                            newNode.type = 'support';
                                            newNode.userId = Session.get('activeLicenseeId');
                                            Session.set('newFolderData', newNode);
                                        });
                                        openNewFolderModal();
                                        Session.set('node', $node);
                                    },
                                },
                            },
                        },
                    };
                } else {
                    return {
                        'New': {
                            label: 'New',
                            separator_after: true,
                            submenu: {
                                account: {
                                    label: 'Account',
                                    action(data) {
                                        $node = tree.create_node($node);
                                        tree.edit($node, null, (newNode) => {
                                            newNode.type = 'account';
                                            newNode.userId = Session.get('activeLicenseeId');
                                            Session.set('newFolderData', newNode);
                                        });
                                        openNewFolderModal();
                                        Session.set('node', $node);
                                    },
                                },
                                detail: {
                                    label: 'Detail',
                                    action(data) {
                                        $node = tree.create_node($node);
                                        tree.edit($node, null, (newNode) => {
                                            newNode.type = 'detail';
                                            newNode.userId = Session.get('activeLicenseeId');
                                            Session.set('newFolderData', newNode);
                                        });
                                        openNewFolderModal();
                                        Session.set('node', $node);
                                    },
                                },
                                support: {
                                    label: 'Support',
                                    action(data) {
                                        $node = tree.create_node($node);
                                        tree.edit($node, null, (newNode) => {
                                            newNode.type = 'support';
                                            newNode.userId = Session.get('activeLicenseeId');
                                            Session.set('newFolderData', newNode);
                                        });
                                        openNewFolderModal();
                                        Session.set('node', $node);
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
            }
        },
    }).bind("select_node.jstree",
        function(evt, data) {
            data.instance.open_node(data.node);
            $('#jstree_div_financial').jstree('deselect_all');
            $('#jstree_div_archive').jstree('deselect_all');
            const templateFolder = FolderTemplate.findOne(data.node.id);
            if (!templateFolder) {
                if (Session.get('headerTab') == "search") {
                    $(".js-documents-tab").click();
                }
            }
            Session.set('assignFolderId', data.node.id);
        }
    ).bind("redraw.jstree", function() {
        //$('#jstree_div_personal').jstree('open_all');
        Session.set('assignFolderId', null);
    });


    this.autorun(() => {

        Session.set('ViewFolderId', false);
        Session.set('assignFolderId', false);
        let folder = Session.get('folder');
        if (folder) {
            var ty = FolderTemplate.findOne({ _id: folder.parentId });
            if (ty && ty.type === "personal") {
                $("#" + folder._id + '_anchor').addClass("jstree-clicked");
            }
        } else {
            $('.jstree-anchor').removeClass("jstree-clicked");
        }
        const dataFoldersP = [];

        var dataP = FolderTemplate.find({ type: 'personal' }, { sort: { shortDescription: 1 } }).fetch().map((el) => {
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

        dataP.map((temp) => {
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
                dataFoldersP.push(obj);
            });
        });
        Session.set('jstree-data-personal', dataP.concat(dataFoldersP));
    });
});