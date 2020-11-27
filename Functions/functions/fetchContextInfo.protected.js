const zendesk = require("node-zendesk");
const _ = require("lodash");

exports.handler = async function(context, event, callback) {
  const client = zendesk.createClient({
    username: context.ZENDESK_USERNAME,
    token: context.ZENDESK_TOKEN,
    remoteUri: context.ZENDESK_URI
  });
  const users = await client.users.list();
  const user = _.find(users, u => {
    return u.phone === event.From;
  });

  if (user) {
    return callback(null, {
      user: user.id,
      userName: user.name,
      userEmail: user.email,
      orderTime: process.env.ORDER_TIME,
      companyName: process.env.COMPANY_NAME
    });
  }
  return callback(null, {
    user: null,
    userName: null,
    userEmail: null,
    orderTime: process.env.ORDER_TIME,
    companyName: process.env.COMPANY_NAME
  });
};
