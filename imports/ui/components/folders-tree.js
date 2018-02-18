import './folders-tree.html';

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


Template.foldersTree.helpers({
  view() {
    if (Session.get('headerTab') === "documents" || Session.get('headerTab') === "submitDocuments" || Session.get('headerTab') === "search") {
      return true;
    } else {
      return false;
    }
    //return Session.get('headerTab');
  },
  isAdmin() {
    return isAdmin();
  },
});
Template.foldersTree.onCreated(() => {
  Session.set('headerTab', 'financialDashboard');
});