"use-strict";

const db = require("./db-handler");
const callSendAPI = require("./sendApi-handler");
const greetingKeywords = ["hai", "hei", "hi", "hello", "hallo", "helo", "halo"];

/**
 * Handles messages events
 * @param {string} senderId The message sender ID
 * @param {object} received_message Message object
 */
async function handleMessage(senderId, received_message) {
  console.log("process messages");
  console.log(received_message);

  //Get user data
  const userData = await db.get(senderId);

  //Var
  let userInput = received_message?.text;
  let messageId = received_message?.mid;
  let userName = userData?.user_name?.S;
  let regisStage = ~~userData?.regis_stage?.N;
  let response = {};
  const template = {
    type: "template",
    payload: {
      template_type: "button",
      text: `Wants to know how many days till yours next birthday ?`,
      buttons: [
        {
          type: "postback",
          title: "Yes",
          payload: "yes",
        },
        {
          type: "postback",
          title: "No",
          payload: "no",
        },
      ],
    },
  };

  //If user ID found
  if (userData !== "NOT_FOUND") {
    console.log("USER ID FOUND", userData);
    
    //Store received messages
    const storeMsgResp = await db.storeMessage(messageId, userInput, senderId, userName);
    console.log("Store user message status: ", storeMsgResp);

    switch (regisStage) {
      //Already registered
      case 1:
        if (!greetingKeywords.includes(userInput)) {
          const dbResp = await db.update(senderId, userInput, null, 2);
          dbResp === "SUCCESS" ? (response.text = `When is your birthday ? format: YYYY-MM-DD`) : (response.text = "Sorry, please try again later :)");
        } else {
          response.text = "Hai there, please write your first name to continue :)";
        }
        break;
      //Already have a name
      case 2:
        if (!greetingKeywords.includes(userInput) && userInput.length === 10) {
          const dbResp = await db.update(senderId, userName, userInput, 3);
          dbResp === "SUCCESS" ? (response.attachment = { ...template }) : (response.text = "Sorry, please try again later :)");
        } else {
          response.text = `Please input your birthday with the correct format, YYYY-MM-DD (ex: 1990-07-18)`;
        }
        break;
      //Already have a name and D.O.B
      case 3:
        response.attachment = { ...template };
        break;
    }

    //Send response
    return await callSendAPI(senderId, response);
  }
  //If user ID not found
  else {
    console.log("USER ID NOT FOUND");
    const createNewUser = await db.createNewUser(senderId, 1);
    createNewUser === "SUCCESS"
      ? (response.text = "Hai there, please write your first name to continue :)")
      : (response.text = "I'am sorry there is a trouble on our side, please try again :)");
    return await callSendAPI(senderId, response);
  }
}

module.exports = handleMessage;
