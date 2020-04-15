var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});
var ddb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
var converter = AWS.DynamoDB.Converter;
require("aws-sdk/clients/apigatewaymanagementapi");

exports.onMessage = function(event, context, callback) {
    // TODO implement
    console.log("EVENT ::: "+JSON.stringify(event));
    var gameId = event.body ? JSON.parse(event.body).gameId : undefined;
    var state = event.body ? JSON.parse(event.body).state : undefined;
    var connectionId = event.requestContext.connectionId;
    
    console.log("gameId : "+gameId+", state : "+state);
    
    docClient.query({
        TableName : "game_state",
        KeyConditionExpression: "#gid = :gmid",
        ExpressionAttributeNames:{
            "#gid": "game_id"
        },
        ExpressionAttributeValues: {
            ":gmid": gameId
        }
    }, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.", JSON.stringify(data.Items));
            if(state !== 'ping'){
                data.Items[0]['state'] = state;    
            }
            console.log("data.Items[0] : "+data.Items[0], JSON.stringify(data.Items[0]));
            docClient.put({
                TableName: 'game_state',
                Item: data.Items[0]
            }, function(err, data2) {
            if (err) {
                console.log("Error", err);
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify('Could not update game state! : '+JSON.stringify(err)),
                });
            } else {
                var gameState = data.Items[0];
                console.log("after PUT :: data.Items[0] : "+gameState, JSON.stringify(gameState));
                var pList = JSON.parse(JSON.stringify(gameState.participant_list))
                
                gameState['participant_list'].forEach(function(participant) {
                    console.log(" - ", participant['connect_id'] + " : " + participant['color']);
                    var stateToBroadcast = {
                        'gameId':gameId, 
                        'state':gameState['state'],
                        'participants': pList.map(function(p){
                            console.log("connectionId : "+connectionId+", p['connect_id'] : "+p['connect_id']+", "+(participant['connect_id'] == p['connect_id']))
                            return {'name':p.name, 'color':p.color, 'home':p.home, 'me': participant['connect_id'] == p['connect_id']};
                        })
                    };
                    console.log("sending state :: "+JSON.stringify(stateToBroadcast)+" :: to participant :: "+JSON.stringify(participant));
                    send(event, stateToBroadcast, participant['connect_id'])
                    .then(data =>{
                            const response = {
                            statusCode: 200,
                            body: JSON.stringify(stateToBroadcast),
                        };
                        callback(null, response);
                    })
                    .catch(err=>{
                        console.log("Error", err);
                        callback(null, {
                            statusCode: 200,
                            body: JSON.stringify('Could not send game state to other participants! : '+JSON.stringify(err)),
                        });
                    });
                });
            }
        });
    }
    });
    
};

const send = (event, payload, connectionId) => {
  console.log("Sending message :: "+JSON.stringify(payload)+" to connectionId :: "+connectionId)
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
  });
  return apigwManagementApi
    .postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(payload) })
    .promise();
};
