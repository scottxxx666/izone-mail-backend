const user = require('./repositories/user');
const izone = require('./repositories/izone');
const notification = require('./notification');

async function notifyUsers(blogs, member) {
    const users = await user.all();
    await Promise.all(blogs.map(async blog => {
        await Promise.all(users.map(user => notification.send(member, blog, user.access_token)));
    }));
}

async function updateLastId(blogs, member) {
    const lastId = Math.max(...blogs.map(blog => blog.id));
    await izone.updateLastId(member, lastId);
}

exports.handler = async function () {
    const members = await izone.members();
    await Promise.all(members.map(async member => {
        const blogs = await izone.getNewBlogs(member);
        await notifyUsers(blogs, member);
        await updateLastId(blogs, member);
    }));
    return 'Success';
};
