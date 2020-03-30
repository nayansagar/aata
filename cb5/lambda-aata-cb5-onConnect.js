var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});
var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
require("aws-sdk/clients/apigatewaymanagementapi");

exports.onConnect = function(event, context, callback) {
    // TODO implement
    console.log("EVENT ::: "+JSON.stringify(event));
    var gameId = event.queryStringParameters ? event.queryStringParameters.gameId : undefined;
    var color = event.queryStringParameters ? event.queryStringParameters.color : undefined;
    var name = event.queryStringParameters ? event.queryStringParameters.name : undefined;
    var connectionId = event.requestContext.connectionId;
    
    docClient.get({
         TableName: 'game_state',
         Key: {'game_id': gameId}
        }, function(err, data) {
          if (err) {
            console.log("Error", err);
          } else {
            console.log("Success : ", JSON.stringify(data.Item));
            if(data.Item && data.Item.participant_list){
                var pcptFound = false;
                for(var i in data.Item.participant_list){
                    if(i.color == color){
                        pcptFound = true
                        i.connect_id = connectionId;
                        i.name = name;
                    }
                }
                if(!pcptFound){
                    data.Item.participant_list.push({
                        'connect_id':connectionId,
                        'color':color,
                        'name':name
                    });    
                }
                
                docClient.put({
                    TableName: 'game_state',
                    Item: data.Item
                }, function(err, data2) {
                    if (err) {
                        console.log("Error", err);
                        callback(Error({
                            statusCode: 500,
                            body: JSON.stringify('Could not create game! : '+JSON.stringify(err)),
                        }));
                    } else {
                        console.log("Success", data);
                        var gameState = data.Item;
                        console.log("after PUT :: data.Items[0] : "+gameState, JSON.stringify(gameState));
                        var pList = JSON.parse(JSON.stringify(gameState.participant_list))
                        var stateToBroadcast = {
                            'gameId':gameId, 
                            'state':gameState['state'],
                            'participants': pList.map(p => delete p.connect_id)
                        };
                        gameState.participant_list.forEach(function(participant){
                            console.log("participant.connect_id : "+participant['connect_id']+", connectionId : "+connectionId);
                            if(participant['connect_id'] != connectionId){
                                send(event, stateToBroadcast, participant['connect_id'])
                                .then(data =>{
                                    callback(null, {
                                        statusCode: 200,
                                        "headers": {
                                            "gameId": gameId
                                        },
                                        body: JSON.stringify(stateToBroadcast),
                                    });
                                })
                                .catch(err=>{
                                    console.log("Error publishing latest state to participant "+JSON.stringify(participant), err);
                                    callback(null, {
                                        statusCode: 200,
                                        "headers": {
                                            "gameId": gameId
                                        },
                                        body: JSON.stringify(stateToBroadcast),
                                    });
                                });
                            }else{
                                callback(null, {
                                        statusCode: 200,
                                        "headers": {
                                            "gameId": gameId
                                        },
                                        body: JSON.stringify(stateToBroadcast),
                                    });
                            }
                        });
                    }
                });
            } else {
                console.log("Existing game without participants, should never happen!!");
            }
          }
    });
};

const send = (event, payload, connectionId) => {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
  });
  return apigwManagementApi
    .postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(payload) })
    .promise();
};

