const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AT_TOKEN}).base(process.env.AT_TABLE);
const PR_TABLE = 'K8s 1.12 Milestone PRs';

exports.findRecordByPr = (prNum, callback) => {
    base(PR_TABLE).select({
        maxRecords: 1,
        filterByFormula: `{PR NUMBER} = ${prNum}`,
        view: "Grid view"
    }).all(function(err, records) {
        if (err) { callback(err, null); }
        if (records.length > 0){
            callback(null, records[0]._rawJson.fields);
        } else {
            callback(null, null)
        }
    });
};

exports.updateRecordByPr = (record, callback) => {
    getAtId(record._prNum, function (err, res){
        if (err) { callback(err, null); }
        else {
            if (res != null){
                base(PR_TABLE).update(res, {
                    "PR Number": record._prNum,
                    "PR Name": record._prName,
                    "Link": record._prLink,
                    "Opened Date": record._createdDate,
                    "Last Activity": record._updatedDate,
                    "Kind": record._kind,
                    "Status": record._status,
                    "LGTM'ed?": record._isLgtm,
                    "Approved": record._isApproved,
                    "Sig": record._responsibleSig
                }, function(err, record) {
                    if (err) { console.error(err); return; }
                    console.log(record);
                });
            }
        }
    });
};

exports.addNewRecord = (record, callback) => {
    base(PR_TABLE).create({
        "PR Number": record._prNum,
        "PR Name": record._prName,
        "Link": record._prLink,
        "Opened Date": record._createdDate,
        "Last Activity": record._updatedDate,
        "Kind": record._kind,
        "Status": record._status,
        "LGTM'ed?": record._isLgtm,
        "Approved": record._isApproved,
        "Sig": record._responsibleSig
    }, function(err, record) {
        if (err) { callback(err, null); }
        callback(null, record);
    });
};

function getAtId(prNum, callback){
    base(PR_TABLE).select({
        maxRecords: 1,
        filterByFormula: `{PR NUMBER} = ${prNum}`,
        view: "Grid view"
    }).all(function(err, records) {
        if (err) { callback(err, null); }
        if (records.length > 0){
            callback(null, records[0].id);
        } else {
            callback(null, null)
        }
    });
}