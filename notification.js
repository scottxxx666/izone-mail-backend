const got = require('got');
const FormData = require('form-data');

const sendNotification = async function sendNotificationToSubscriber(member, blog, token) {
  console.log(member, blog, token);

  const form = new FormData();
  form.append('message', `${member.name} 發了封新 mail 唷！\n${blog.link}`);

  const url = 'https://notify-api.line.me/api/notify';
  const headers = { Authorization: `Bearer ${token}` };

  await got(url, { headers, body: form });
};

module.exports = {
  send: sendNotification,
};
