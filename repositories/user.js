const AWS = require("aws-sdk");

AWS.config.update({
    region: "ap-northeast-1",
});

const docClient = new AWS.DynamoDB.DocumentClient();

const getAll = async function () {
    const data = await docClient.scan({TableName: "line_auth"}).promise();
    return data.Items;
}

module.exports = {
    all: getAll
}
