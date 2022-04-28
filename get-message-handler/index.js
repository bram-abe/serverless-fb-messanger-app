const { DynamoDBClient, ScanCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");
const arrayGrouping = require("./module/grouping-handler");
exports.handler = async (event, context) => {
  try {
    console.log("Received event: ", JSON.stringify(event, null, 2));

    let response = {};
    const dbClient = new DynamoDBClient();
    const query = (params) => new QueryCommand(params);
    const getAllRecord = (params) => new ScanCommand(params);

    const path = event?.path?.split("/")?.splice(1);
    const basePath = path[0];
    const pathParam = path[1];

    //Get all messages
    if (basePath === "messages" && !pathParam) {
      //Prepare statement and call DB request
      const dbRespond = await dbClient.send(
        getAllRecord({
          TableName: process.env.CHAT_HISTORY_TABLE || "mock-table",
          ConsistentRead: true,
          ExpressionAttributeNames: { "#ts": "timestamp" },
          ProjectionExpression: "#ts, user_id, msg_id, message",
        })
      );
      console.log("DB response: ", dbRespond);
      response.statusCode = 200;
      response.body = JSON.stringify(dbRespond?.Items);
    } else if (basePath === "messages" && pathParam) {
      const dbRespond = await dbClient.send(
        query({
          TableName: process.env.CHAT_HISTORY_TABLE || "mock-table",
          IndexName: "message-id",
          ExpressionAttributeValues: {
            ":msg_id": { S: pathParam },
          },
          KeyConditionExpression: "msg_id = :msg_id",
        })
      );
      console.log("DB response: ", dbRespond);
      if (dbRespond?.Items.length < 1) {
        response.statusCode = 404;
        response.body = JSON.stringify("ID_NOT_FOUND");
      } else {
        response.statusCode = 200;
        response.body = JSON.stringify(dbRespond?.Items[0]);
      }
    } else if (basePath === "summary") {
      //Prepare statement and call DB request
      const dbRespond = await dbClient.send(
        getAllRecord({
          TableName: process.env.CHAT_HISTORY_TABLE || "mock-table",
          ConsistentRead: true,
        })
      );
      console.log("DB response: ", dbRespond);
      const groupedItems = await arrayGrouping(dbRespond?.Items);
      console.log("Grouped ", groupedItems);
      response.statusCode = 200;
      response.body = JSON.stringify(groupedItems);
    } else {
      //Path not found
      response.statusCode = 404;
      response.body = JSON.stringify("PATH_NOT_EXIST");
    }

    console.log("Send response", response);
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
