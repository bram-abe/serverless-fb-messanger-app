"use-strict";

/**
 * Database handler module using AWS DynamoDb
 * Please read the SDK docs. here : https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/index.html#aws-sdkclient-dynamodb
 */

const { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");

//Var
const dbClient = new DynamoDBClient();
const storeItem = (params) => new PutItemCommand(params);
const getItem = (params) => new GetItemCommand(params);
const updateItem = (params) => new UpdateItemCommand(params);

/**
 * Create new user
 * @param {string} userId
 * @param {number} regisStage
 * @returns SUCCESS or FAILED
 */
async function createNewUser(userId, regisStage) {
  //Prepare statement
  const dbResp = await dbClient.send(
    storeItem({
      TableName: process.env.USERS_MASTER_TABLE,
      Item: {
        id: { S: userId },
        regis_stage: { N: regisStage.toString() },
      },
      ConditionExpression: "attribute_not_exists(id)",
    })
  );
  console.log("DB RESP: ", dbResp);
  return dbResp.$metadata.httpStatusCode === 200 ? "SUCCESS" : "FAILED";
}

/**
 * Get item from database
 * @param {string} id
 * @returns All related item attribute if the data found or NOT_FOUND status if not
 */
async function get(userId) {
  //Prepare statement and call db
  const dbResp = await dbClient.send(
    getItem({
      TableName: process.env.USERS_MASTER_TABLE,
      Key: {
        id: { S: userId },
      },
      ConsistentRead: true,
    })
  );

  console.log("DB RESP: ", dbResp);
  return dbResp?.Item ? dbResp?.Item : "NOT_FOUND";
}

/**
 * Update user data
 * @param {string} userId
 * @param {string} userName
 * @param {string} dob
 * @param {number} regisStage
 * @returns SUCCESS or FAILED
 */
async function update(userId, userName, dob, regisStage) {
  //Prepare statement and call db
  const dbResp = await dbClient.send(
    updateItem({
      TableName: process.env.USERS_MASTER_TABLE,
      Key: {
        id: { S: userId },
      },
      ExpressionAttributeValues: {
        ":user_name": { S: userName },
        ":dob": { S: dob ? dob : "" },
        ":regisStage": { N: regisStage.toString() },
      },
      UpdateExpression: "SET user_name = :user_name, dob = :dob, regis_stage = :regisStage",
    })
  );
  console.log("DB RESP: ", dbResp);
  return dbResp?.$metadata?.httpStatusCode === 200 ? "SUCCESS" : "FAILED";
}

/**
 * Store user message into database
 * @param {string} msgId
 * @param {string} msgText
 * @param {string} userId
 * @param {string} userName
 * @returns SUCESS or FAILED
 */
async function storeMessage(msgId, msgText, userId, userName) {
  //Prepare statement and call db
  const dbResp = await dbClient.send(
    storeItem({
      TableName: process.env.CHAT_HISTORY_TABLE,
      Item: {
        user_id: { S: userId },
        msg_id: { S: msgId },
        user_name: { S: userName ? userName : "" },
        message: { S: msgText ? msgText : "" },
        timestamp: { S: new Date(Date.now()).toISOString()}
      },
    })
  );
  return dbResp?.$metadata?.httpStatusCode === 200 ? "SUCCESS" : "FAILED";
}

module.exports = {
  createNewUser: createNewUser,
  get: get,
  update: update,
  storeMessage: storeMessage,
};
