const zendesk = require("node-zendesk");
const _ = require("lodash");

exports.handler = async function(context, event, callback) {
  const client = zendesk.createClient({
    username: context.ZENDESK_USERNAME,
    token: context.ZENDESK_TOKEN,
    remoteUri: context.ZENDESK_URI
  });

  console.log(event);

  const user = event.user;
  const subject = event.subject;
  const comment = event.comment;
  try {
    const ticketBody = {
      ticket: {
        requester_id: user,
        subject,
        tags: ["Return"]
      }
    };

    if (comment !== "no") {
      ticketBody.ticket.comment = { body: `Reason for return: ${comment}` };
    }
    const ticket = await client.tickets.create(ticketBody);
    console.log({ ticketId: ticket.id });
    return callback(null, { ticketId: ticket.id });
  } catch (err) {
    console.error(error);
    return callback(true);
  }
};
