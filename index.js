'use strict';

const PrTable = require('./airtable');
const Github = require('./github');

function updateRecord(record){
    PrTable.findRecordByPr(record._prNum, function(err, response){
        if (err) console.log(err.message);
        if (response === null){
            PrTable.addNewRecord(record, function (err, res) {
                if (err) console.log(err.message);
                else console.log(res);
            });
        } else {
            if(!deepCompare(record, response)){
             PrTable.updateRecordByPr(record, function (err, res) {
                 if (err) console.log(err.message);
             });
            } else {
                console.log('Record not changed...skipping.')
            }

        }
    });
}

//Returns true if the two objects fields are equivalent
function deepCompare(ghRecord, atRecord) {
    return ghRecord._prNum === atRecord["PR Number"];
}

module.exports.run = (event, context) => {
    Github.GetData(function (err, res) {
        if (err) console.log(err.message);
        //update Airtable
        res.map(updateRecord);
    });
};
