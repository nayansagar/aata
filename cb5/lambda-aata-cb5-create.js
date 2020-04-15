var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});
var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

exports.handler = function(event, context, callback) {
    // TODO implement
    console.log("EVENT ::: "+JSON.stringify(event));
    var color = event.queryStringParameters ? event.queryStringParameters.color : undefined;
    
    var params = {
            TableName: 'game_state',
            Item: {
                'game_id' : makeid(6),
                'participant_list' : [],
                'state':{
                    'squares':[
                        [{},{},{'isSafe': true},{},{}],
                        [{},{},{},{},{}],
                        [{'isSafe': true},{},{'isSafe': true},{},{'isSafe': true}],
                        [{},{},{},{},{}],
                        [{},{},{'isSafe': true},{},{}]
                    ],
                    'current':{
                        'toPlay':'red'
                    }
                }
            }
        };
        
        console.log("Storing : "+JSON.stringify(params));
        
        docClient.put(params, function(err, data) {
            if (err) {
                console.log("Error", err);
                callback(Error({
                    statusCode: 500,
                    body: JSON.stringify('Could not create game! : '+JSON.stringify(err)),
                }));
            } else {
                console.log("Success", data);
                var gameState = params.Item;
                console.log("after PUT :: data.Items[0] : "+gameState, JSON.stringify(gameState));
                var stateToBroadcast = {'gameId':gameState['game_id'], 'state':gameState['state']};
                //callback(null, stateToBroadcast);
                
                callback(null, {
                            'statusCode': 200,
                            'headers': {
                                'Access-Control-Allow-Origin':'*'
                            },
                            'body': JSON.stringify(stateToBroadcast),
                        });
                
            }
        });
    };

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
