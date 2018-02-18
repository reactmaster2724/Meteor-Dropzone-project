import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { FolderTemplate } from './folderTemplate.js';


const insertFolderTemplate = new ValidatedMethod({
  name: 'folderTemplate.insert',
  validate: FolderTemplate.schema.validator({ clean: true, filter: false }),
  run(tree) {
    const folder = {
      section: tree.section,
      code: tree.code,
      type: tree.type,
      shortDescription: tree.text,
      longDescription: '',
      defaultFrequency: '',
      sortOrder: 1,
      status: 'active',
      migrationTargetId: '',
      isDeleted: false,
    };

    return FolderTemplate.insert(folder, (err, res) => {
      if (err) console.error(err);
    });
  },
});

const removeFolderTemplate = new ValidatedMethod({
  name: 'folderTemplate.remove',
  validate: FolderTemplate.schema.validator({ clean: true, filter: false }),
  run(folderId) {
    FolderTemplate.remove(folderId, err => {
      if (err) console.error(err);
    });
  },
});

const updateFolderTemplate = new ValidatedMethod({
  name: 'folderTemplate.update',
  validate: FolderTemplate.schema.validator({ clean: true, filter: false }),
  run(folderId, folder) {
    FolderTemplate.update(
      folderId,
      { $set: {
        type:folder.type,
        code: folder.code,
        shortDescription:folder.text,
      } },
      err => {
        if (err) console.error(err);
      }
    );
  },
});


export { insertFolderTemplate, removeFolderTemplate, updateFolderTemplate };
