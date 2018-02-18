import './app-body.html';

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { ActiveRoute } from 'meteor/zimme:active-route';
import { FlowRouter } from 'meteor/kadira:flow-router';
// import { TAPi18n } from 'meteor/tap:i18n';


import '/imports/ui/components/loading.js';
import '/imports/ui/components/nav-header.js';

import '/imports/ui/components/header.js';
import '/imports/ui/components/licenseeDropdown.js';
import '/imports/ui/components/leftSideBar.js';

import '/imports/ui/components/drop-zone.js';
import '/imports/ui/components/folders-tree.js';

import '/imports/ui/components/folders-treeF.js';
import '/imports/ui/components/folders-treeP.js';
import '/imports/ui/components/folders-treeA.js';

import '/imports/ui/components/tabPanels/financialDashboard.js';
import '/imports/ui/components/tabPanels/personalDashboard.js';
import '/imports/ui/components/tabPanels/documents.js';
import '/imports/ui/components/tabPanels/document-settings.js';
import '/imports/ui/components/tabPanels/submitDocuments.js';
import '/imports/ui/components/tabPanels/search.js';
import '/imports/ui/components/tabPanels/administration.js';

import '/imports/ui/components/tabPanels/files/file.js';

import '/imports/ui/components/tabPanels/periodTemplate.js';
import '/imports/ui/components/tabPanels/assignedLicenseeGrid.js';
import '/imports/ui/components/tabPanels/unAssignedLicenseeGrid.js';

import '/imports/ui/components/modal/modalNew.js';
import '/imports/ui/components/modal/modalEdit.js';