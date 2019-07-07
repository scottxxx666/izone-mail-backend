const AWS = require("aws-sdk");

AWS.config.update({
    region: "ap-northeast-1",
});

const docClient = new AWS.DynamoDB.DocumentClient();

const getMembers = async function () {
    const data = await docClient.scan({TableName: "izone"}).promise();
    return data.Items;
}

const updateLastId = async function (member, result) {
    const params = {
        TableName: "izone",
        Key: {
            "id": member.id,
        },
        UpdateExpression: "set lastId = :id",
        ExpressionAttributeValues: {
            ":id": result.id,
        },
        ReturnValues: "UPDATED_NEW"
    };
    if (result.id > member.lastId) {
        return await docClient.update(params).promise();
    }
}

module.exports = {
    members: getMembers,
    updateLastId: updateLastId,
}
