import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class FolderTemplateCollection extends Mongo.Collection {
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

const FolderTemplate = new FolderTemplateCollection('folderTemplate');

FolderTemplate.allow({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

FolderTemplate.deny({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

FolderTemplate.schema = new SimpleSchema({
  section: {
    type: String,
    optional: true,
  },
  code: {
    type: String,
    optional: true,
  },
  type: {
    type: String,
    optional: true,
  },
  shortDescription: {
    type: String,
    optional: true,
  },
  longDescription: {
    type: String,
    optional: true,
  },
  defaultFrequency: {
    type: String,
    optional: true,
  },
  sortOrder: {
    type: Number,
    optional: true,
  },
  status: {
    type: String,
    optional: true,
  },
  migrationTargetId: {
    type: String,
    optional: true,
  },
  isDeleted: {
    type: Boolean,
    optional: true,
  },
  jsTreeStructure: {
    type: Object,
    optional: true,
  },
});

FolderTemplate.attachSchema(FolderTemplate.schema);

export { FolderTemplate };
