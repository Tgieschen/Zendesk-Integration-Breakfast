const zendesk = require("node-zendesk");
const _ = require("lodash");
const TokenValidator = require("twilio-flex-token-validator").functionValidator;

exports.handler = TokenValidator(async function(context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

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
    const tickets = await client.tickets.list();
    const userTickets = _.find(
      tickets,
      ticket =>
        ticket.requester_id === user.id &&
        (ticket.status === "open" || ticket.status === "new")
    );

    response.body({
      ticketId: userTickets ? userTickets.id : null
    });
    return callback(null, response);
  }
  response.body({
    ticketId: null
  });
  return callback(null, response);
});
