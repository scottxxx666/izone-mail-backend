const got = require('got');
const AWS = require("aws-sdk");
const FormData = require('form-data');
const user = require('./repositories/user');
const izone = require('./repositories/izone');

AWS.config.update({
    region: "ap-northeast-1",
});

const docClient = new AWS.DynamoDB.DocumentClient();

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
    await Promise.all(members.map(async member => {
        const blogs = await izone.getBlogContains(member.uid, member.containerId, member.lastId, member.keyword);
        await Promise.all(blogs.map(async blog => {
            await Promise.all(users.map(user => sendNotification(member, blog, user.access_token)));
        }));
        const lastId = Math.max(...blogs.map(blog => blog.id));
        await izone.updateLastId(member, lastId);
    }));
    return 'Success';
};
