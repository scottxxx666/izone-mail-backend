const AWS = require("aws-sdk");
const got = require('got');

AWS.config.update({
    region: "ap-northeast-1",
});

const docClient = new AWS.DynamoDB.DocumentClient();

const getMembers = async function () {
    const data = await docClient.scan({TableName: "izone"}).promise();
    return data.Items;
}

const updateLastId = async function (member, lastId) {
    const params = {
        TableName: "izone",
        Key: {
            "id": member.id,
        },
        UpdateExpression: "set lastId = :id",
        ExpressionAttributeValues: {
            ":id": lastId,
        },
        ReturnValues: "UPDATED_NEW"
    };
    if (lastId !== -Infinity) {
        return await docClient.update(params).promise();
    }
}

const getNewBlogs = async function (member) {
    return await getBlogContains(member.uid, member.containerId, member.lastId, member.keyword);
}

const getBlogContains = async function (uid, containerId, lastId, keyword) {
    const url = `https://m.weibo.cn/api/container/getIndex?containerid=${containerId}`;
    try {
        const r = await got(url, {json: true});
        return r.body.data.cards.filter((item) => item.mblog && !item.mblog.isTop && item.mblog.id > lastId && item.mblog.text.toLowerCase().includes(keyword))
            .map((item) => ({
                id: item.mblog.id,
                user: item.mblog.user.screen_name,
                pubDate: item.mblog.created_at,
                link: `https://weibo.com/${uid}/${item.mblog.bid}`,
            }))
            .sort((a, b) => a.id - b.id);
    } catch (error) {
        console.error(error);
        return [];
    }
}

module.exports = {
    members: getMembers,
    updateLastId: updateLastId,
    getNewBlogs: getNewBlogs,
}
