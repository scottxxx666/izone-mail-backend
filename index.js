const userRepo = require('./repositories/user');
const izoneRepo = require('./repositories/izone');
const notification = require('./notification');

const notifyUsers = async function notifyUsers(blogs, member) {
  const users = await userRepo.all();
  await Promise.all(blogs.map(async (blog) => {
    await Promise.all(users.map(user => notification.send(member, blog, user.access_token)));
  }));
};

const updateLastId = async function updateLastId(blogs, member) {
  const lastId = Math.max(...blogs.map(blog => blog.id));
  await izoneRepo.updateLastId(member, lastId);
};

const handler = async function handler() {
  const members = await izoneRepo.members();
  await Promise.all(members.map(async (member) => {
    const blogs = await izoneRepo.getNewBlogs(member);
    await notifyUsers(blogs, member);
    await updateLastId(blogs, member);
  }));
  return 'Success';
};

exports.handler = handler;
