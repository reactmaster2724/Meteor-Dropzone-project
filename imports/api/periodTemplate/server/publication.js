import { Meteor } from 'meteor/meteor';
import { PeriodTemplate } from '/imports/api/periodTemplate/periodTemplate';

Meteor.publish('periodTemplate', () => {
  return PeriodTemplate.find({
    isDeleted: false,
  });
});
