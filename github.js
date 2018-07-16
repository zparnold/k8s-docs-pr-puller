var PullRequest = require('./models/pull_request');

let token = process.env.GH_TOKEN;

let client = require('graphql-client')({
    url: 'https://api.github.com/graphql',
    headers: {
        Authorization: 'Bearer ' + token
    }
});

const milestoneQuery = `query {
  repository(owner: "kubernetes", name: "kubernetes") {
    milestone(number: 39) {
      pullRequests(states: [OPEN, CLOSED, MERGED], first: 100) {
        edges {
          node {
            number
            title
            url
            createdAt
            updatedAt
            labels(first: 50) {
              edges {
                node {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
}`;

exports.GetData = (callback) => {
    let prArray = [];
    client.query(milestoneQuery, function(req, res) {
        if (res.status === 401) {
            throw new Error('Not authorized');
        }
    })
        .then(function(body) {
            let prs = body.data.repository.milestone.pullRequests.edges;
            prArray = prs.map(parsePullRequest);
            callback(null, prArray);
        })
        .catch(function (err) {
            callback(err, null);
        });
};


function parsePullRequest(pullRequest) {
    let prNode = pullRequest.node;
    let labelArray = prNode.labels.edges.map(parseLabel);
    let kind = extractValue(labelArray, 'kind/');
    let status = extractValue(labelArray, 'status/');
    let isLgtm = extractValue(labelArray, 'lgtm');
    let isApproved = extractValue(labelArray, 'approved');
    let sig = extractValue(labelArray, 'sig/');
    let boolLgtm = false;
    if (isLgtm != null){
        boolLgtm = true;
    }
    let boolIsApproved = false;
    if (isApproved != null){
        boolIsApproved = true;
    }
    return new PullRequest(prNode.number, prNode.title, prNode.url, prNode.createdAt, prNode.updatedAt, kind, status, boolLgtm, boolIsApproved, sig);
}

function parseLabel(label) {
    return label.node.name;
}

function extractValue(labelArray, searchVal){
    let kind = null;
    labelArray.forEach(function(elt) {
        if (elt.includes(searchVal)){
            if (searchVal.includes("/")){
                kind = elt.substring(searchVal.length);
            } else {
                kind = elt;
            }
        }
    });
    return kind;
}