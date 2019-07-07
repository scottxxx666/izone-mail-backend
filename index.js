const got = require('got');
const AWS = require("aws-sdk");
const FormData = require('form-data');
const user = require('./repositories/user');
const izone = require('./repositories/izone');

AWS.config.update({
    region: "ap-northeast-1",
});

const docClient = new AWS.DynamoDB.DocumentClient();

async function searchContains(uid, containerId, lastId, keyword) {
    const url = `https://m.weibo.cn/api/container/getIndex?containerid=${containerId}`;
    try {
        const r = await got(url, {json: true});
        return r.body.data.cards.filter((item) => item.mblog && !item.mblog.isTop && item.mblog.id > lastId && item.mblog.text.toLowerCase().includes(keyword))
            .map((item) => ({
                id: item.mblog.id,
                user: item.mblog.user.screen_name,
                pubDate: item.mblog.created_at,
                link: `https://weibo.com/${uid}/${item.mblog.bid}`,
            }));
    } catch (error) {
        console.log(r.body);
        console.error(error);
        return [];
    }
}

async function updateLastId(member, result) {
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

async function sendNotification(member, blog, token) {
    console.log(member, blog, token)

    const form = new FormData();
    form.append('message', member.name + ' 發了封新 mail 唷！\n' + blog.link);

    const url = 'https://notify-api.line.me/api/notify';
    const headers = {Authorization: 'Bearer ' + token};

    await got(url, {headers: headers, body: form});
}


exports.handler = async function () {
    const users = await user.all();
    const members = await izone.members();
    for (let i in members) {
        let member = members[i];
        const blogs = await searchContains(member.uid, member.containerId, member.lastId, member.keyword);
        blogs.forEach(async blog => {
            await Promise.all(users.map(user => sendNotification(member, blog, user.access_token)));
            await updateLastId(member, blog);
        })
    }
    return 'Success';
};
