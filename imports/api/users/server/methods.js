import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';


Meteor.methods({
  'user.create' (user) {
    var options = {
      username: '',
      email: user.email,
      password: user.password,
      profile: {
        avatar: null,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
    var user = Accounts.createUser(options);
    return user;
  },
  'users.update.profile' (userId, user) {
    check(userId, String);
    check(user, Object);

    Meteor.users.update(userId, {
      $set: {
        licenseesManaged: [],
        managedByAdmins: [],
        suRole: user.su,
        adminRole: user.admin,
        isDeleted: false,
      }
    }, (error, result) => {
      if (error) { console.error(error) }
    });
  },

  'users.update' (users) {
    check(users, Object);
    Meteor.users.update(
      users.userId, {
        $set: {
          'emails.0.address': users.email,
          'profile.firstName': users.firstName,
          'profile.lastName': users.lastName,
          suRole: users.su,
          adminRole: users.admin,
        }
      },
      err => {
        if (err) console.error(err);
      }

    );
    Accounts.setPassword(users.userId, users.password)
  },
  'users.delete' (userId) {
    check(userId, String);

    Meteor.users.update(
      userId, { $set: { isDeleted: true } },
      (err) => {
        if (err) console.error(err);
      }
    );
  },
  'users.assign.licensee' (adminId, licenseeId) {
    check(adminId, String);
    check(licenseeId, String);

    Meteor.users.update(licenseeId, { $push: { managedByAdmins: adminId } })
    Meteor.users.update(adminId, { $push: { licenseesManaged: licenseeId } })
  },
  'users.unAssign.licensee' (adminId, licenseeId) {
    check(adminId, String);
    check(licenseeId, String);

    Meteor.users.update(licenseeId, { $pull: { managedByAdmins: adminId } })
    Meteor.users.update(adminId, { $pull: { licenseesManaged: licenseeId } })
  },
});