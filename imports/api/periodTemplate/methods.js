import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { PeriodTemplate } from './periodTemplate.js';


const PERIODS = {
  month: 12,
  quarter: 4,
  annual: 1,
};

const generatePeriodTemplate = new ValidatedMethod({
  name: 'periodTemplate.generate',
  validate: PeriodTemplate.schema.validator({ clean: true, filter: false }),
  run(year) {
    // if (PeriodTemplate.find().count() === 0) {
      for (const period in PERIODS) {
        for (let i = 0; i < PERIODS[period]; i++) {
          let options;
          switch (period) {
            case 'month':
              options = {
                type: 'month',
                year,
                quarter: 0,
                month: i + 1,
                isDeleted: false,
              };
              break;
            case 'quarter':
              options = {
                type: 'quarter',
                year,
                quarter: i + 1,
                month: 0,
                isDeleted: false,
              };
              break;
            case 'annual':
              options = {
                type: 'annual',
                year,
                quarter: 0,
                month: 0,
                isDeleted: false,
              };
              break;
            default:
              return;
          }
          PeriodTemplate.insert(options, err => {
            if (err) console.error(err);
          });
        }
      // }
    }
  },
});


export { generatePeriodTemplate };
