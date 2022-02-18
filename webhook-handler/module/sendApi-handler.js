"use-strict";

const axios = require("axios").default;

/**
 * Sends response messages via the Send API
 * @param {string} senderId where message to be sent
 * @param {object} response Message object to be sent
 */
async function callSendAPI(senderId, response) {
  try {
    let request_body = {
      messaging_type: "RESPONSE",
      recipient: {
        id: senderId,
      },
      message: {
        ...response,
      },
    };

    console.log("Call send API");
    console.log(request_body);
    //Send response back to fb server
    const sendResponse = await axios.post(`${process.env.API_BASE_URL}?access_token=${process.env.PAGE_ACCESS_TOKEN}`, {
      ...request_body,
    });

    if (sendResponse.status >= 200 && sendResponse.status <= 299) {
      return "SUCCESS";
    }
  } catch (error) {
    console.error("Failed to send messages !", error.response.data);
    return "FAILED";
  }
}

module.exports = callSendAPI;
