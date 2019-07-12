const dynamo = require("./dynamoDB");

const getAll = async function () {
    const data = await dynamo.scan({TableName: "line_auth"}).promise();
    return data.Items;
}

module.exports = {
    all: getAll
}
