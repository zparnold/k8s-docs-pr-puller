# K8s Docs PR Puller

The purpose of this serverless repo is to be used to synchronize and aggregate
open PR's against the `kubernetes/kubernetes` repo, and the docs release
team efforts.

## Locally
It's a serverless app, so this will help get you started: https://serverless.com

Beyond that, it's straightforward NodeJS

It uses the GraphQL library and the Airtable library for ease of use.

## Adopting for your own purposes

Feel free! Just keep in mind, at runtime this program is expecting the following
env vars:
`GH_TOKEN` which is a Github app token that has read access on your account
`AT_TOKEN` which is an Airtable API key that should have write access on your account
`AT_TABLE` which is a `baseID` for an Airtable for proper client initialization to manipulate
data in the right table