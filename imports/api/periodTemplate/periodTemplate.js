import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class PeriodTemplateCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    const result = super.insert(ourDoc, callback);

    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);

    return result;
  }
  remove(selector) {
    const result = super.remove(selector);

    return result;
  }
}

const PeriodTemplate = new PeriodTemplateCollection('periodTemplate');

PeriodTemplate.allow({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

PeriodTemplate.deny({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

PeriodTemplate.schema = new SimpleSchema({
  type: {
    type: String,
    optional: true,
  },
  year: {
    type: Number,
    optional: true,
  },
  quarter: {
    type: Number,
    optional: true,
  },
  month: {
    type: Number,
    optional: true,
  },
  isDeleted: {
    type: Boolean,
    optional: true,
  },

});

PeriodTemplate.attachSchema(PeriodTemplate.schema);

export { PeriodTemplate };
