import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Folder } from './folder.js';
import { PeriodTemplate } from '../periodTemplate/periodTemplate.js';


const insertFolder = new ValidatedMethod({
    name: 'folder.insert',
    validate: Folder.schema.validator({ clean: true, filter: false }),
    run(tree, d) {
        const periods = [];
        if (PeriodTemplate.find().count() === 0) {
            alert('Create periods in Administration');
            return;
        }
        var Currentdate = new Date();
        var curYY = Currentdate.getFullYear();
        var curMM = Currentdate.getMonth() + 1;
        var openYY = parseInt(d.accountopenedyy || 2007);
        var closeYY = parseInt(d.accountclosedyy || curYY);
        var startMonth = parseInt(d.accountopenedmm || 1);
        var closeMonth = parseInt(d.accountclosedmm || 12);
        var deDate = "01/01/2007";

        var issueDate = tree.issueDate || deDate;
        var expireDate = tree.expireDate || curMM + '/' + 1 + '/' + curYY;
        if (closeYY == curYY && closeMonth > curMM) {
            closeMonth = curMM;
        }
        if (openYY < 2007) {
            openYY = 2007;
        }
        if (closeYY > curYY) {
            closeYY = curYY;
        }
        switch (tree.periodType) {
            case 'month':
                for (var d = new Date(openYY, startMonth, 1); d <= new Date(closeYY, closeMonth, 1); d.setMonth(d.getMonth() + 1)) {
                    if (tree.type == "account") {
                        var red = true;
                    } else {
                        var red = null;
                    }
                    if (parseInt(d.getMonth()) == 0) {
                        var mon = 12
                        var y = d.getFullYear();
                        y = y - 1;
                    } else {
                        var mon = d.getMonth();
                        var y = d.getFullYear();
                    }
                    const obj = {
                        periodTemplateId: PeriodTemplate.find({ $and: [{ "type": "month" }, { "year": y }, { "month": mon }] }).fetch()[0]._id,
                        red: red,
                        fileId: null,
                        fileName: null,
                        green: false
                    };
                    periods.push(obj);
                }
                break;
            case 'quarter':
                var startPeriod = Math.floor((startMonth / 3) + ((startMonth % 3 == 0 ? 0 : 1))) //first quarter to load 1 - 4
                var endPeriod = Math.floor((closeMonth / 3) + ((closeMonth % 3 == 0 ? 0 : 1))) //last quarter to load 1 - 4
                for (var yy = openYY; yy <= closeYY; yy++) {

                    if (yy == openYY) {
                        var firstPeriod = startPeriod;
                    } else {
                        var firstPeriod = 1;
                    }

                    if (yy == closeYY) {
                        var lastPeriod = endPeriod;
                    } else {
                        var lastPeriod = 4;
                    }
                    for (var startp = firstPeriod; startp <= lastPeriod; startp++) {
                        const obj = {
                            periodTemplateId: PeriodTemplate.find({ $and: [{ type: 'quarter' }, { year: yy }, { quarter: startp }] }).fetch()[0]._id,
                            fileId: null,
                            fileName: null,
                        };
                        periods.push(obj);
                    }
                }
                break;
            case 'annual':
                for (var yy = openYY; yy <= closeYY; yy++) {
                    periods.push({
                        periodTemplateId: PeriodTemplate.find({ type: 'annual', year: yy }).fetch()[0]._id,
                        fileId: null,
                        fileName: null,
                    });
                }
                break;
        }

        //const period = tree.type == "account" ? "month" : null;

        const folder = {
            folder: null,
            type: tree.type,
            userId: tree.userId || Meteor.userId(),
            parentId: tree.parent,
            title: tree.text,
            periodType: tree.periodType || null,
            periods,
            accountOpened: tree.accountOpened,
            accountClosed: tree.accountClosed,
            issueDate: issueDate,
            expireDate: expireDate,
            meta: null,
            comment: d.comment,
            folderTemplateId: tree.parents[tree.parents.length - 2], // dhf what is this
            isDeleted: false,
            staticString: {
                title: tree.staticStringTitle,
            },
            file: [{
                balance: null,
                fileUrl: null
            }]
        };

        return Folder.insert(folder, (err, res) => {
            if (err) console.error(err);
        });
    },
});

const updateFolder = new ValidatedMethod({
    name: 'folder.update',
    validate: Folder.schema.validator({ clean: true, filter: false }),
    run(folderId, tree, d) {
        const periods = [];
        var fol = Folder.find({ _id: folderId }).fetch();

        var Currentdate = new Date();
        var curYY = Currentdate.getFullYear();
        var curMM = Currentdate.getMonth() + 1;
        var openYY = parseInt(d.accountopenedyy || 2007);
        var closeYY = parseInt(d.accountclosedyy || curYY);
        var startMonth = parseInt(d.accountopenedmm || 1);
        var closeMonth = parseInt(d.accountclosedmm || 12);
        var accountClosed = tree.accountClosed || "12/31/" + curYY;

        var issueDate = tree.issueDate || "01/01/2007";
        var expireDate = tree.expireDate || curMM + "/01/" + curYY;
        if (closeYY == curYY && closeMonth > curMM) {
            closeMonth = curMM;
        }
        if (openYY < 2007) {
            openYY = 2007;
        }
        if (closeYY > curYY) {
            closeYY = curYY;
        }
        var Fol_period = fol[0].periods;

        console.log('fol', fol);
        console.log('tree', tree);
        switch (tree.periodType) {
            case 'month':
                for (var d = new Date(openYY, startMonth, 1); d <= new Date(closeYY, closeMonth, 1); d.setMonth(d.getMonth() + 1)) {
                    if (fol[0].type == "account") {
                        var red = true;
                    } else {
                        var red = null;
                    }
                    if (parseInt(d.getMonth()) == 0) {
                        var mon = 12
                        var y = d.getFullYear();
                        y = y - 1;
                    } else {
                        var mon = d.getMonth();
                        var y = d.getFullYear();
                    }
                    var per_id = PeriodTemplate.find({ $and: [{ "type": "month" }, { "year": y }, { "month": mon }] }).fetch()[0]._id

                    function findCherries(fruit) {
                        return fruit.periodTemplateId === per_id;
                    }

                    if (Fol_period.find(findCherries)) {
                        var obj = Fol_period.find(findCherries);
                        periods.push(obj);
                    } else {
                        var obj = {
                            periodTemplateId: per_id,
                            red: red,
                            fileId: null,
                            green: false
                        };
                        periods.push(obj);
                    }
                }
                break;
            case 'quarter':
                var startPeriod = Math.floor((startMonth / 3) + ((startMonth % 3 == 0 ? 0 : 1))) //first quarter to load 1 - 4
                var endPeriod = Math.floor((closeMonth / 3) + ((closeMonth % 3 == 0 ? 0 : 1))) //last quarter to load 1 - 4
                for (var yy = openYY; yy <= closeYY; yy++) {

                    if (yy == openYY) {
                        var firstPeriod = startPeriod;
                    } else {
                        var firstPeriod = 1;
                    }

                    if (yy == closeYY) {
                        var lastPeriod = endPeriod;
                    } else {
                        var lastPeriod = 4;
                    }

                    for (var startp = firstPeriod; startp <= lastPeriod; startp++) {
                        const obj = {
                            periodTemplateId: PeriodTemplate.find({ $and: [{ type: 'quarter' }, { year: yy }, { quarter: startp }] }).fetch()[0]._id,
                            fileId: null,
                        };
                        periods.push(obj);
                    }
                }
                break;
            case 'annual':
                for (var yy = openYY; yy <= closeYY; yy++) {
                    periods.push({
                        periodTemplateId: PeriodTemplate.find({ type: 'annual', year: yy }).fetch()[0]._id,
                        fileId: null,
                    });
                }
                break;
        }
        files = Folder.findOne(folderId).periods;


        // periods.map((period) => {
        //     files.filter((el) => {
        //         if (el.periodTemplateId === period.periodTemplateId && el.fileId) {
        //             period.fileId = el.fileId;
        //         } else {
        //             period.fileId = null;
        //         }
        //     })
        //     return period;
        // });


        Folder.update(
            folderId, {
                $set: {
                    periodType: tree.periodType,
                    title: tree.title,
                    accountOpened: tree.accountOpened,
                    accountClosed: accountClosed,
                    issueDate: issueDate,
                    expireDate: expireDate,
                    comment: d.comment,
                    periods,
                    'staticString.title': tree.staticStringTitle,
                }
            },
            err => {
                if (err) console.error(err);
            }
        );
    },
});


const removeFolder = new ValidatedMethod({
    name: 'folder.remove',
    validate: Folder.schema.validator({ clean: true, filter: false }),
    run(folderId) {
        Folder.remove(folderId, err => {
            if (err) console.error(err);
        });
    },
});

const insertSubFolder = new ValidatedMethod({
    name: 'subFolder.insert',
    validate: Folder.schema.validator({ clean: true, filter: false }),
    run(tree) {
        const parentFolder = Folder.findOne(tree.parent);

        parentFolder.periods.forEach((el) => {
            if (el.fileId !== null) {
                el.fileId = null;
            }
            return el;
        });

        const folder = {
            folder: null,
            userId: tree.userId || Meteor.userId(),
            parentId: tree.parent,
            title: tree.text,


            // dhf Not sure why this defaulting to parent's periods
            // a parent could be an account and the sub folder most likely would be a support or possibly a detail
            //  dhf  periodType: parentFolder.periodType,
            periodType: tree.periodType || "none",
            periods: parentFolder.periods,

            accountOpened: null,
            meta: null,
            folderTemplateId: tree.parents[tree.parents.length - 2],
            isDeleted: false,
            staticString: parentFolder.staticString
        };

        return Folder.insert(folder, (err, res) => {
            if (err) console.error(err);
        });
    },
});






export { insertFolder, removeFolder, updateFolder, insertSubFolder };