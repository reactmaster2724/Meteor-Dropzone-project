import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.registerHelper( '$equal', (a, b) => {
  if(a === b) {
    return true
  } else {
    return false
  }
});

Template.registerHelper( '$or', (a, b) => {
  if(a || b) {
    return true
  } else {
    return false
  }
});

function isAdmin(licenseeId) {
  let user;
  if(licenseeId) {
    user = Meteor.users.findOne(licenseeId);
  } else {
    user = Meteor.user();
  }
//console.log(user);
  if(user && user.adminRole) {
    return user.adminRole;
  } else {
    return false;
  }
}

export { isAdmin };
