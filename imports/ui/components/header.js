import './header.html';

import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';


const WITH_FOLDERS_TREE = ['documents', 'submitDocuments', 'search']

Template.header.onRendered(function() {
  Meteor.setTimeout(function() {
    $('.ui.dropdown').dropdown();
  }, 2000);
});

Template.header.helpers({
  avatar() {
    const profile = Meteor.user().profile;
    if (profile && profile.avatar) {
      return profile.avatar;
    } else {
      return `${profile.firstName[0]}${profile.lastName[0]}`
    }
  },
  isSU() {
    if (Meteor.user()) {
      return Meteor.user().suRole;
    }
  },
  SearchisActive() {
    if (Session.get('search_criteria')) {
      return true;
    } else {
      $(".js-documents-tab").click();
      return false;
    }
  }
});

Template.header.events({
  'click .js-tab-header' (ev) {
    ev.preventDefault();
    $('.js-tab-header.active').removeClass('active');
    $(ev.target).addClass('active');
    Session.set('headerTab', ev.target.attributes[2].nodeValue);

    if (WITH_FOLDERS_TREE.indexOf(ev.target.attributes[2].nodeValue) === -1) {
      $('.left-sidebar').hide();
    } else {
      $('.left-sidebar').show();
    }
    Session.set('showDocumentSettings', false);
  },
  'click .js-logout' (ev) {
    ev.preventDefault();
    Meteor.logout();
    $('#newFolderModal').remove();
    $('#editFolderModal').remove();
  },
  'keyup #search_for_files_field': function(ev, template) {
    Session.set('search_criteria', $("#search_for_files_field").val());
    // For move to search result tab
    $(".js-search-tab").click();
  }
});