const AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-northeast-1",
});

const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = docClient
