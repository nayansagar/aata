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
                var colorsTaken = [
                    {'color':'red', 'taken':false, 'home':{'x':2, 'y':4}}, 
                    {'color':'green', 'taken':false, 'home':{'x':2, 'y':0}},
                    {'color':'blue', 'taken':false, 'home':{'x':0, 'y':2}}, 
                    {'color':'yellow', 'taken':false, 'home':{'x':4, 'y':2}}
                ]
                for(var i in data.Item.participant_list){
                    console.log("i :"+i, JSON.stringify(data.Item.participant_list[i]));
                    colorsTaken.find(clr => data.Item.participant_list[i].color == clr.color)['taken']=true;
                    if(data.Item.participant_list[i].color == color){
                        pcptFound = true
                        data.Item.participant_list[i].connect_id = connectionId;
                        data.Item.participant_list[i].name = name;
                    }
                }
                if(!pcptFound){
                    var assignedColor = colorsTaken.find(c => c.taken == false);
                    data.Item.participant_list.push({
                        'connect_id':connectionId,
                        'color':assignedColor['color'],
                        'name':name,
                        'home': assignedColor['home']
                    });
                    
                    if(data.Item.participant_list.length == 1){
                        data.Item['state']['current']['toPlay'] = assignedColor['color'];
                    }
                    
                    data.Item.state.squares[assignedColor['home']['x']][assignedColor['home']['y']][assignedColor['color']] = 4;
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
                        var pList = JSON.parse(JSON.stringify(gameState.participant_list));
                        
                        gameState.participant_list.forEach(function(participant){
                            console.log("participant.connect_id : "+participant['connect_id']+", connectionId : "+connectionId);
                            var stateToBroadcast = {
                                'gameId':gameId, 
                                'state':gameState['state'],
                                'participants': pList.map(function(p){
                                console.log("connectionId : "+connectionId+", p['connect_id'] : "+p['connect_id']+", "+(participant['connect_id'] == p['connect_id']))
                                return {'name':p.name, 'color':p.color, 'home':p.home, 'me': participant['connect_id'] == p['connect_id']}
                                })
                            };
                            if(participant['connect_id'] != connectionId){
                                console.log("sending state :: "+JSON.stringify(stateToBroadcast)+" :: to participant :: "+JSON.stringify(participant));
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
                                /*callback(null, {
                                        statusCode: 200,
                                        "headers": {
                                            "gameId": gameId
                                        },
                                        body: JSON.stringify(stateToBroadcast),
                                    });*/
                                    callback(null, {
                                        statusCode: 200,
                                        "headers": {
                                            "gameId": gameId
                                        },
                                        body: "TEST",
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
  console.log("Sending message : "+JSON.stringify(payload)+" to : "+connectionId);
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
  });
  return apigwManagementApi
    .postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(payload) })
    .promise();
};

