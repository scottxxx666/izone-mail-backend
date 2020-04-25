const AWS = require("aws-sdk");
const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

const sendNotification = function sendNotificationToSubscriber(member, blog, token) {
  console.log(member, blog, token);

  const params = {
    MessageAttributes: {
      "OpenId": {
        DataType: "String",
        StringValue: token,
      }
    },
    MessageBody: `${member.name} 發了封新 mail 唷！\n${blog.link}`,
    QueueUrl: process.env.QUEUE_URL,
  };
  return sqs.sendMessage(params)
    .promise();
};

module.exports = {
  send: sendNotification,
};
