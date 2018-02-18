import { PeriodTemplate } from '../../api/periodTemplate/periodTemplate.js';
import { generatePeriodTemplate } from '../../api/periodTemplate/methods';


Meteor.startup(function() {
    // using settings file to add historic periods
    if (Meteor.settings.private && Meteor.settings.private.periodsArray) {
        _.each(Meteor.settings.private.periodsArray, function(year) {
            var yearExists = PeriodTemplate.findOne({
                year: year
            });
            if (!yearExists) {
                console.log("\nCreating year:", year);
                generatePeriodTemplate.run(year);
            } else {
                console.log(yearExists);
            }
        });
    } else {
        console.log("Meteor Settings:", Meteor.settings);
    };

    if (PeriodTemplate.find().count() === 1) {

        const year = new Date().getFullYear()
            //generatePeriodTemplate.run(year);
        generatePeriodTemplate.run(year - 1);
        generatePeriodTemplate.run(year - 2);
        generatePeriodTemplate.run(year - 3);
        generatePeriodTemplate.run(year - 4);
        generatePeriodTemplate.run(year - 5);
        generatePeriodTemplate.run(year - 6);
        generatePeriodTemplate.run(year - 7);
        generatePeriodTemplate.run(year - 8);
        generatePeriodTemplate.run(year - 9);
        generatePeriodTemplate.run(year - 10);
    }
});