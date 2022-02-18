"use strict";

const postbackHandler = require("./module/postback-handler");
const messageHandler = require("./module/message-handler");
exports.handler = async (event, context) => {
  try {
    console.log("Received event: ", JSON.stringify(event, null, 2));

    let VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

    // Parse the query params
    let mode = event?.queryStringParameters?.["hub.mode"];
    let token = event?.queryStringParameters?.["hub.verify_token"];
    let challenge = event?.queryStringParameters?.["hub.challenge"];
    const response = {};

    //Evaluate when method is GET
    if (event?.httpMethod === "GET") {
      // Checks if the token and mode is exist
      if (mode && token) {
        // Checks if the received mode and token is correct
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
          // Responds with the challenge token from the request
          response.statusCode = 200;
          response.body = `${challenge}`;
        } else {
          // Responds with '403 Forbidden' if verify tokens do not match
          response.statusCode = 403;
        }
      }
    }

    //Evaluate when method is POST
    if (event?.httpMethod === "POST") {
      let body = JSON.parse(event?.body);
      let webhook_event = body?.entry?.[0]?.messaging?.[0];
      let senderId = body?.entry?.[0]?.messaging?.[0]?.sender?.id;

      console.log("Received webhook_event :");
      console.log(body?.entry?.[0]?.messaging?.[0]);

      // Checks this is an event from a page subscription
      if (body.object === "page") {
        //Check if contain message
        if (webhook_event?.message) {
          const sendRespond = await messageHandler(senderId, webhook_event.message);
          console.log("Message sent to user ?", sendRespond);
          response.statusCode = sendRespond === "SUCCESS" ? 200 : 500;
        }
        //Check if message has been readed
        else if (webhook_event?.read?.watermark) {
          console.log("Message has been read by user");
          response.statusCode = 200;
        }
        //Check if message has been delivered
        else if (webhook_event?.delivery?.watermark) {
          console.log("Message has been delivered");
          response.statusCode = 200;
        }
        //check if user reqeust contain postback
        else if (webhook_event?.postback) {
          console.log("Handle postback");
          const sendRespond = await postbackHandler(senderId, webhook_event.postback);
          console.log("Message sent to user ?", sendRespond);
          response.statusCode = sendRespond === "SUCCESS" ? 200 : 500;
        } else {
          //Send bad request
          response.statusCode = 400;
        }
      } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        response.statusCode = 404;
      }
    }

    //Send response
    console.log("Send response: ", JSON.stringify(response));
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
