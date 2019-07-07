const AWS = require("aws-sdk");

AWS.config.update({
    region: "ap-northeast-1",
});

const docClient = new AWS.DynamoDB.DocumentClient();

const getMembers = async function () {
    const data = await docClient.scan({TableName: "izone"}).promise();
    return data.Items;
}

module.exports = {
    members: getMembers
}
