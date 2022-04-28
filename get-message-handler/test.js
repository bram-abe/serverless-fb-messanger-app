const { mockClient } = require("aws-sdk-client-mock")
const { DynamoDBClient, ScanCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");
const lambdaEvent = require("./test-module/lambda-event-mock.json")
const apiHandler = require("./index")
const dbMock = mockClient(DynamoDBClient)

describe("API Handler Test", () => {
    beforeEach(() => {
        dbMock.reset();
    });

    it("should get chat summary from DB by grouping the messages from same users", async () => {
        dbMock.on(ScanCommand).resolves({
            $metadata: { httpStatusCode: 200 },
            Items: [{ "msg_id": { "S": "m_3Qx2gIGLqLlh9gx3aGS18RhKZpjaZizON_Pipty-abTxAP5-PwX04zS1dUwWNo8vWu_id6AstmwjhTpITNrbdQ" }, "user_id": { "S": "4674053272694470" }, "message": { "S": "Hi" }, "user_name": { "S": "Hi" }, "timestamp": { "S": "2022-04-26T19:08:47.025Z" } }],
        });
        const resp = await apiHandler.handler(lambdaEvent.summaryPath)
        expect(resp).toStrictEqual({
            statusCode: 200,
            body: JSON.stringify([{ "user": "4674053272694470", "name": "Hi", "messages": ["Hi"] }])
        });
    });

    it("should get all messages from DB", async () => {
        dbMock.on(ScanCommand).resolves({
            $metadata: { httpStatusCode: 200 },
            Items: [{ "msg_id": { "S": "m_3Qx2gIGLqLlh9gx3aGS18RhKZpjaZizON_Pipty-abTxAP5-PwX04zS1dUwWNo8vWu_id6AstmwjhTpITNrbdQ" }, "message": { "S": "Hi" }, "user_id": { "S": "4674053272694470" }, "timestamp": { "S": "2022-04-26T19:08:47.025Z" } }, { "msg_id": { "S": "m_h9xSh5ajsfTS5bDMw1CRqRhKZpjaZizON_Pipty-abSu2LqZRYbFpexdvToFePzZWW4oSyJjiOMQIMP-4tv-wA" }, "message": { "S": "Hi" }, "user_id": { "S": "4674053272694470" }, "timestamp": { "S": "2022-04-26T21:13:52.619Z" } }, { "msg_id": { "S": "m_7LM1VXKuIxxTaxUgb-WzzeThJQwgWZE0bg6V3guCEJ-KYuNbApSr0sUM4nrRq3ZKYMMNa2RNRTbIy4ZBvCsNtg" }, "message": { "S": "yes" }, "user_id": { "S": "5016884531667246" }, "timestamp": { "S": "2022-04-25T13:42:33.044Z" } }, { "msg_id": { "S": "m_8h-BDrPasUus4QporCtbp-ThJQwgWZE0bg6V3guCEJ_ndhG65oiX16RECgdDNhJipmgibaaeNNc9Uw_ZKstoZg" }, "message": { "S": "1990-07-18" }, "user_id": { "S": "5016884531667246" }, "timestamp": { "S": "2022-04-25T13:42:24.921Z" } }, { "msg_id": { "S": "m_ghmzX1r1hXXZ5lRRJBx4suThJQwgWZE0bg6V3guCEJ-XZE4XEt0I6W5LsaEbZ-gJWjZMw4lZvjFzK8KMXwI89w" }, "message": { "S": "hello" }, "user_id": { "S": "5016884531667246" }, "timestamp": { "S": "2022-04-27T18:40:36.884Z" } }, { "msg_id": { "S": "m_iTQq1us-UPuYNOEt-1G3F-ThJQwgWZE0bg6V3guCEJ-iNfc1ffYy7nP-w5o-2KEoUzkeh7_uos8x447cwiqakA" }, "message": { "S": "okey" }, "user_id": { "S": "5016884531667246" }, "timestamp": { "S": "2022-04-25T13:42:45.460Z" } }, { "msg_id": { "S": "m_mDYUmTcYAzVb83SPO5ezROThJQwgWZE0bg6V3guCEJ_3y4XLQ95OmF6dsY2J05rJjzgU2eyA2kMf3NygN0cFkg" }, "message": { "S": "bram" }, "user_id": { "S": "5016884531667246" }, "timestamp": { "S": "2022-04-25T13:41:33.403Z" } }, { "msg_id": { "S": "m_mNyxkMlwZH0363HTwOQ3W-ThJQwgWZE0bg6V3guCEJ8ficPCEu35ylBUyfnTXvokJ2FSEtOzofRwlgsofRvL4g" }, "message": { "S": "no" }, "user_id": { "S": "5016884531667246" }, "timestamp": { "S": "2022-04-25T13:42:52.122Z" } }, { "msg_id": { "S": "m_rDsJLzBTcUqxcM4jhy-ehOThJQwgWZE0bg6V3guCEJ_3wHF7RR624wh1AZDhbZyXpC45tLAgsgd1XrpPj2uN0Q" }, "message": { "S": "hai" }, "user_id": { "S": "5016884531667246" }, "timestamp": { "S": "2022-04-27T18:40:40.224Z" } }],
        });
        const resp = await apiHandler.handler(lambdaEvent.messagesPath)
        expect(resp).toStrictEqual({
            statusCode: 200,
            body: JSON.stringify([{ "msg_id": { "S": "m_3Qx2gIGLqLlh9gx3aGS18RhKZpjaZizON_Pipty-abTxAP5-PwX04zS1dUwWNo8vWu_id6AstmwjhTpITNrbdQ" }, "message": { "S": "Hi" }, "user_id": { "S": "4674053272694470" }, "timestamp": { "S": "2022-04-26T19:08:47.025Z" } }, { "msg_id": { "S": "m_h9xSh5ajsfTS5bDMw1CRqRhKZpjaZizON_Pipty-abSu2LqZRYbFpexdvToFePzZWW4oSyJjiOMQIMP-4tv-wA" }, "message": { "S": "Hi" }, "user_id": { "S": "4674053272694470" }, "timestamp": { "S": "2022-04-26T21:13:52.619Z" } }, { "msg_id": { "S": "m_7LM1VXKuIxxTaxUgb-WzzeThJQwgWZE0bg6V3guCEJ-KYuNbApSr0sUM4nrRq3ZKYMMNa2RNRTbIy4ZBvCsNtg" }, "message": { "S": "yes" }, "user_id": { "S": "5016884531667246" }, "timestamp": { "S": "2022-04-25T13:42:33.044Z" } }, { "msg_id": { "S": "m_8h-BDrPasUus4QporCtbp-ThJQwgWZE0bg6V3guCEJ_ndhG65oiX16RECgdDNhJipmgibaaeNNc9Uw_ZKstoZg" }, "message": { "S": "1990-07-18" }, "user_id": { "S": "5016884531667246" }, "timestamp": { "S": "2022-04-25T13:42:24.921Z" } }, { "msg_id": { "S": "m_ghmzX1r1hXXZ5lRRJBx4suThJQwgWZE0bg6V3guCEJ-XZE4XEt0I6W5LsaEbZ-gJWjZMw4lZvjFzK8KMXwI89w" }, "message": { "S": "hello" }, "user_id": { "S": "5016884531667246" }, "timestamp": { "S": "2022-04-27T18:40:36.884Z" } }, { "msg_id": { "S": "m_iTQq1us-UPuYNOEt-1G3F-ThJQwgWZE0bg6V3guCEJ-iNfc1ffYy7nP-w5o-2KEoUzkeh7_uos8x447cwiqakA" }, "message": { "S": "okey" }, "user_id": { "S": "5016884531667246" }, "timestamp": { "S": "2022-04-25T13:42:45.460Z" } }, { "msg_id": { "S": "m_mDYUmTcYAzVb83SPO5ezROThJQwgWZE0bg6V3guCEJ_3y4XLQ95OmF6dsY2J05rJjzgU2eyA2kMf3NygN0cFkg" }, "message": { "S": "bram" }, "user_id": { "S": "5016884531667246" }, "timestamp": { "S": "2022-04-25T13:41:33.403Z" } }, { "msg_id": { "S": "m_mNyxkMlwZH0363HTwOQ3W-ThJQwgWZE0bg6V3guCEJ8ficPCEu35ylBUyfnTXvokJ2FSEtOzofRwlgsofRvL4g" }, "message": { "S": "no" }, "user_id": { "S": "5016884531667246" }, "timestamp": { "S": "2022-04-25T13:42:52.122Z" } }, { "msg_id": { "S": "m_rDsJLzBTcUqxcM4jhy-ehOThJQwgWZE0bg6V3guCEJ_3wHF7RR624wh1AZDhbZyXpC45tLAgsgd1XrpPj2uN0Q" }, "message": { "S": "hai" }, "user_id": { "S": "5016884531667246" }, "timestamp": { "S": "2022-04-27T18:40:40.224Z" } }])
        });
    });


    it("should get the messages by ID from DB", async () => {
        dbMock.on(QueryCommand).resolves({
            $metadata: { httpStatusCode: 200 },
            Items: [{ "msg_id": { "S": "m_3Qx2gIGLqLlh9gx3aGS18RhKZpjaZizON_Pipty-abTxAP5-PwX04zS1dUwWNo8vWu_id6AstmwjhTpITNrbdQ" }, "user_id": { "S": "4674053272694470" }, "message": { "S": "Hi" }, "user_name": { "S": "Hi" }, "timestamp": { "S": "2022-04-26T19:08:47.025Z" } }],
        });
        const resp = await apiHandler.handler(lambdaEvent.messagesIdParamPath)
        expect(resp).toStrictEqual({
            statusCode: 200,
            body: JSON.stringify({ "msg_id": { "S": "m_3Qx2gIGLqLlh9gx3aGS18RhKZpjaZizON_Pipty-abTxAP5-PwX04zS1dUwWNo8vWu_id6AstmwjhTpITNrbdQ" }, "user_id": { "S": "4674053272694470" }, "message": { "S": "Hi" }, "user_name": { "S": "Hi" }, "timestamp": { "S": "2022-04-26T19:08:47.025Z" } })
        });
    });

    it("should return ID_NOT_FOUND without existing ID", async () => {
        dbMock.on(QueryCommand).resolves({
            $metadata: { httpStatusCode: 200 },
            Items: [],
        });
        const resp = await apiHandler.handler(lambdaEvent.messagesIdParamNotFoundPath)
        expect(resp).toStrictEqual({
            statusCode: 404,
            body: JSON.stringify("ID_NOT_FOUND")
        });
    });

    it("should return PATH_NOT_EXIST without existing path", async () => {
        dbMock.on(QueryCommand).resolves({
            $metadata: { httpStatusCode: 200 },
            Items: [],
        });
        const resp = await apiHandler.handler(lambdaEvent.othersPath)
        expect(resp).toStrictEqual({
            statusCode: 404,
            body: JSON.stringify("PATH_NOT_EXIST")
        });
    });

})
