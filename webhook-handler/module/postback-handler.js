"use-strict";

const db = require("./db-handler");
const callSendAPI = require("./sendApi-handler");

/**
 * Handles postbacks events
 * @param {string} senderId The message sender ID
 * @param {object} received_postback Postback object
 */
async function handlePostback(senderId, received_postback) {
  console.log("process postback");
  console.log(received_postback);

  //Get user data
  const userData = await db.get(senderId);

  //Var
  const postback = { ...received_postback };
  let messageId = postback?.mid;
  let payload = postback?.payload;
  let userName = userData?.user_name?.S;
  let dob = userData?.dob?.S;
  let response = {};

  if (userData !== "NOT_FOUND") {
    console.log("USER ID FOUND", userData);
    
    //Store recieved messages
    const storeMsgResp = await db.storeMessage(messageId, payload, senderId, userName);
    console.log("Store user message status: ", storeMsgResp);

    let dobParsed = dob.split("-");
    const date = new Date();
    const yearsModifier = date.getMonth() < dobParsed[1] ? 0 : 1;
    const currentDate = new Date(date.toUTCString()).toDateString();
    const nextBirtday = new Date(Date.UTC(date.getFullYear() + yearsModifier, dobParsed[1] - 1, dobParsed[2])).toDateString();
    const remainingDay = Math.floor((Date.parse(nextBirtday) - Date.parse(currentDate)) / 86400000);

    if (postback.payload === "yes") {
      response.text = `There are ${remainingDay} days left until your next birthday, Can't wait !!`;
    } else {
      response.text = "Goodbye, see you soon";
    }
  } else {
    response.text = "Hmmm...we can't find anything about you. Are you ghost ?";
  }

  //Send response
  return await callSendAPI(senderId, response);
}

module.exports = handlePostback;
