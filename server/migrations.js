Migrations.add({
  version: 1,
  name: 'Create superuser',
  up: function() {

    // create dhf user
    var options = {
      username: 'admin',
      email: 'admindhf@admin.com',
      password: 'fortress1230820$',
      profile: {
        avatar: null,
        firstName: 'admindhf',
        lastName: 'Admin',
      },
    };

    const su = Accounts.createUser(options);

    Meteor.users.update(su, { $set: {
      suRole: true,
      adminRole: true,
      adminManagerRole: false,
      isDeleted: false,
      licenseesManaged: [],
      staffManaged: []
    }})

    // create testing admin/admin user
    var options = {
      username: 'adminadmin.com',
      email: 'admin@admin.com',
      password: 'adminadminpass123!',
      profile: {
        avatar: null,
        firstName: 'admin',
        lastName: 'admin',
      },
    };

    const suAdmin = Accounts.createUser(options);

    Meteor.users.update(suAdmin, { $set: {
      suRole: true,
      adminRole: false,
      adminManagerRole: false,
      isDeleted: false,
      licenseesManaged: [],
      staffManaged: []
    }})
  },
});