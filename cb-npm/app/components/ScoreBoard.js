import React from 'react';

export default class ScoreBoard extends React.Component {
	
    constructor(props) {
        super(props);
        this.state = {
            toPlay: (this.props.current && this.props.current.toPlay == this.props.me.color) ? true : false,
            current: this.props.current ? this.props.current : {},
            play: (this.props.current 
                    && this.props.current.latestScore 
                    && (this.props.current.latestScore != "eight" || this.props.current.latestScore != "four")
                    && !this.props.playOnKill) ? false : true
        };
        this.rollDice = this.rollDice.bind(this);
        this.selectToMove = this.selectToMove.bind(this);
        this.chatSend = this.chatSend.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onShare = this.onShare.bind(this);
        this.quit = this.quit.bind(this);
    }
      
    static getDerivedStateFromProps(nextProps, prevState){
        console.log("nextProps : "+JSON.stringify(nextProps)+", prevState : "+JSON.stringify(prevState));
        console.log("Object.keys(nextProps).length : "+Object.keys(nextProps).length);
        if(!nextProps || !nextProps['me'] || !nextProps['current']){
            return null;
        }else{
            return {
                toPlay: (nextProps.current && nextProps.current.toPlay == nextProps.me.color) ? true : false,
                current: nextProps.current ? nextProps.current : prevState.current,
                play: (nextProps.current 
                    && nextProps.current.latestScore 
                    && (nextProps.current.latestScore != "eight" && nextProps.current.latestScore != "four")
                    && !nextProps.playOnKill) ? false : true
            }
        }
    }
      
    rollDice(){
        const dice = ['one','two','two','three','three','four','four','eight'];
        var roll = dice[Math.floor(Math.random() * dice.length)];
        this.state.current['latestScore'] = roll;
        this.state.current[roll] = this.state.current[roll] ? this.state.current[roll]+1 : 1;
        if(this.state.current['history'] && this.state.current['history'].length > 0){
            var lastInHistory = this.state.current['history'].pop();
            if(lastInHistory.killed){
                if(!lastInHistory.killed['afterKill']){
                    lastInHistory.killed['afterKill'] = [];
                }
                lastInHistory.killed['afterKill'].push(roll);
            }
            this.state.current['history'].push(lastInHistory);
        }
        if(roll == 'four' || roll == 'eight'){
            this.state.play = true;
            this.props.commentaryShow("You got "+roll+", you get another chance!", true);
        }else{
            this.state.play = false;
            this.props.unsetPlayOnKill();
            if(this.props.squares[this.props.me.home.x][this.props.me.home.y][this.props.me.color] == 4){
                this.props.commentaryShow(roll+"!\n\n To move a score:\n 1. click on the score (Eg., \""+roll+": "+this.state.current[roll]+"\")\n 2. select the coin to move on the board\n 3. When you have moved all scores, click \"DONE\"\n", true, 5000);
            } else {
                this.props.commentaryShow(roll.toUpperCase()+"!", true, 1500);
            }
            
        }
        this.setState(this.state);
        this.props.updateCurrentState(this.state.current);
    }
    
    selectToMove(score){
        this.state.current['scoreToMove'] = score;
        this.state.current.score = this.state.current.score > 0 ? (this.state.current.score - 1) : 0;
        this.setState(this.state);
        this.props.updateCurrentState(this.state.current);
    }
    
    handleChange(event) {
        console.log("In handleChange : "+event);
        this.state[event.target.name] = event.target.value;
        this.setState(this.state);
      }
    
    chatSend(event){
        event.preventDefault();
        console.log("In chatSend : "+this.state.chatMsg);
        this.props.sendChatMessage(this.state.chatMsg);
        this.state.chatMsg = "";
        this.setState(this.state);
    }
    
    onShare() {
        var gameUrl = window.location.href.split('?')[0]+'?gid='+this.props.gameId
        console.log("sharing URL : "+gameUrl)
        if ( navigator.share ) {
            navigator.share({
                title: "",
                text: "Hey! how about a game of ChowkaBara? :)",
                url: gameUrl
            })
            .then(() => {console.log("Share successful!")})
            .catch((error) => {console.log("Share failed!")})
        }else{
            if( navigator.clipboard ){
                console.log("Sharing not supported, URL copied to clipboard");
                navigator.clipboard.writeText(gameUrl);
                window.alert("Link copied - share with your friends to invite them to play");
            }else{
                console.log("navigator.clipboard not supported, URL be shared manually");
                window.alert("Can't open share dialog. Please share the current browser URL manually.");
            }
            
        }
      };
      
    quit(){
        this.props.leaveGame(this.state.toPlay && this.state.play);
    }
    
    render(){
        console.log("ScoreBoard.render :: state : "+JSON.stringify(this.state)+", props : "+JSON.stringify(this.props));
        var pcptList;
        var currentTemp = this.props.current;
        if(this.props && this.props.participants_list){
            pcptList = this.props.participants_list.map(function(participant, index){
                    var displayName = participant.name;
                    if(participant.me){
                        displayName = displayName + ' (you)';
                    }
                    var yourTurn = '\u27A4\u27A4\u27A4';
                    var starUnicode = '\uD83C\uDF1F \uD83C\uDF1F';
                    let starColor=null;
                    if(currentTemp.leader_board && currentTemp.leader_board[participant.color] == 1){
                        starColor = '#ffd700';
                        starUnicode = 'GOLD \uD83C\uDF1F';
                    }
                    
                    if(currentTemp.leader_board && currentTemp.leader_board[participant.color] == 2){
                        starColor = '#C0C0C0';
                        starUnicode = 'SILVER \uD83C\uDF1F';
                    }
                    
                    if(currentTemp.leader_board && currentTemp.leader_board[participant.color] == 3){
                        starColor = '#CD7F32';
                        starUnicode = 'BRONZE \uD83C\uDF1F';
                    }
                    var textColor = participant.color == 'yellow' ? 'black' : 'white';
                    return <tr style={{height:'2%', border: 'none'}} key={index}>
                            <td style={{height:'2%', background: participant.color , border: 'none', color: textColor}}>
                                <div style={{fontSize:'20px'}}>
                                    <b>{displayName}</b>
                                </div>
                            </td>
                            <td style={{height:'2%', background: participant.color , border: 'none', color: textColor}}>
                                <div>
                                    { participant.color == currentTemp.toPlay ? <b style={{fontSize:'20px', textAlign: 'right', alignSelf: 'stretch'}}>{yourTurn}</b> : null}
                                </div>
                                <div>
                                    { starColor ? <b style={{color: starColor, fontSize:'20px', textAlign: 'right', alignSelf: 'stretch'}}>{starUnicode}</b> : null}
                                </div>
                            </td>
                        </tr>;
                  })
            if(pcptList.length >= 3){
                var tempPcpt = pcptList[1];
                pcptList[1] = pcptList[2];
                pcptList[2] = tempPcpt;
            }
        }else{
            pcptList = null;
        }
        
        var finalAction;
        if( (!this.state.current['one'] || this.state.current['one'] == 0) 
            && (!this.state.current['two'] || this.state.current['two'] == 0) 
            && (!this.state.current['three'] || this.state.current['three'] == 0)
            && (!this.state.current['four'] || this.state.current['four'] == 0)
            && (!this.state.current['eight'] || this.state.current['eight'] == 0) 
            && !this.state.playOnKill){
                finalAction = "DONE";
            }else {
                finalAction = "PASS";
            }
        
        return(
            <div style={{width:'98vmin', height:'30%', border: 'none', marginLeft:'auto',marginRight:'auto'}}>
            <table style={{width:'100%', height:'20%', border: 'none', marginLeft:'auto',marginRight:'auto'}}>
                <tbody>
                    <tr>
                        <td>
                            <table style={{border: 'none', padding: '0'}}>
                                <tr style={{border: 'none', padding: '0'}}>
                                    <td style={{border: 'none', padding: '4px'}}>{ this.props.participants_list && this.props.participants_list.length < 4 ? <div style={{border: 'none', align: 'center'}}><button style={{width:'100%', height:'100%', align: 'center', borderRadius: '10px', fontSize: '25px'}} onClick={this.onShare} title="Share"><b>Invite</b></button></div> : null}</td>
                                    <td style={{border: 'none', padding: '4px'}}><div style={{border: 'none', align: 'center'}}><button style={{width:'100%', height:'100%', align: 'center', borderRadius: '10px', fontSize: '25px'}} onClick={this.quit} title="Share"><b>Quit</b></button></div></td>
                                    <td style={{border: 'none', padding: '4px'}}><button style={{width:'100%', height:'100%', align: 'center', borderRadius: '10px', fontSize: '25px'}} onClick={this.props.refresh} title="Share"><b>Refresh</b></button></td>
                                    <td style={{border: 'none', padding: '4px'}}><button style={{width:'100%', height:'100%', align: 'center', borderRadius: '10px', fontSize: '25px'}} onClick={this.props.help} title="Share"><b>Help</b></button></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table style={{width:'100%', height:'80%', border: 'none', marginLeft:'auto',marginRight:'auto'}}>
                <tbody>
                    <tr>
                        <td style={{width:'40%'}}>
                            <table style={{width:'100%', height:'10%', border: 'none'}}>
                                <tbody>{pcptList}</tbody>
                            </table>
                        </td>
                        <td style={{padding:'0', verticalAlign: 'top', width:'20%'}}>
                            <table style={{height:'90%', border: 'none', padding: '0'}}>
                                <tbody style={{padding: '0'}}>
                                    { this.props.participants_list && this.props.participants_list.length < 2 ?
                                    <tr>
                                        <h3>Click "Invite" to play the game with your friends</h3>
                                    </tr>
                                    : this.state.toPlay && this.state.play ? 
                                    <tr style={{padding:'0', verticalAlign: 'top'}}>
                                        <td style={{padding:'0', height:'100%',border: 'none', align: 'top'}}><button style={{width:'100%',height:'100%', background: this.props.me.color, color: this.props.me.color == 'yellow' ? 'black':'white', borderRadius:'12px', fontSize: '25px'}} onClick={this.rollDice} title="play"><b>PLAY</b></button></td>
                                    </tr>
                                     : null
                                    }
                                    <tr style={{padding:'0', verticalAlign: 'top'}}>
                                        <td style={{width:'30%',height:'40%', border: 'none', padding:'0'}}>{ this.state.toPlay && !this.state.play ? <button style={{width:'100%', height:'100%', borderRadius:'12px', fontSize: '25px'}} onClick={() => this.props.undoLastMove(0)} title="undo"><b>UNDO</b></button> : null }</td>
                                    </tr>
                                    <tr>
                                        <td style={{width:'40%',height:'40%', border: 'none', padding:'0'}}>{ this.state.toPlay && !this.state.play ? <button style={{width:'100%', height:'100%', borderRadius:'12px', background: this.props.me.color, color: this.props.me.color == 'yellow' ? 'black':'white', fontSize: '25px'}} onClick={this.props.finishTurn} title="done"><b>{finalAction}</b></button> : null }</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td style={{width:'40%'}}>
                            <table style={{width:'100%', height:'100%', border: 'none'}}>
                                <tbody>
                                    <tr style={{width:'100%', height:'30%', border:'none'}}>
                                        {this.state.current && this.state.current.eight > 0 ? <td style={{width:'50%', border:'none', padding: '4px'}}><button style={{width:'100%', fontSize:'21px', fontWeight: 'bold', borderRadius: '10px'}} onClick={() => this.selectToMove(8)} disabled={!this.state.toPlay}><h4>Eight: {this.state.current.eight}</h4></button></td> : null}
                                        {this.state.current && this.state.current.four > 0 ? <td  style={{width:'50%', border:'none', padding: '4px'}}><button style={{width:'100%', fontSize:'21px', fontWeight: 'bold', borderRadius: '10px'}} onClick={() => this.selectToMove(4)} disabled={!this.state.toPlay}><h4>Four: {this.state.current.four}</h4></button></td> : null}
                                    </tr>
                                    <tr style={{width:'100%', height:'30%', border:'none'}}>
                                        {this.state.current && this.state.current.three > 0 ? <td style={{width:'50%', border:'none', padding: '4px'}}><button style={{width:'100%', fontSize:'21px', fontWeight: 'bold', borderRadius: '10px'}} onClick={() => this.selectToMove(3)} disabled={!this.state.toPlay}><h4>Three: {this.state.current.three}</h4></button></td> : null}
                                        {this.state.current && this.state.current.two > 0 ? <td  style={{width:'50%', border:'none', padding: '4px'}}><button style={{width:'100%', fontSize:'24px', fontWeight: 'bold', borderRadius: '10px'}} onClick={() => this.selectToMove(2)} disabled={!this.state.toPlay}><h4>Two: {this.state.current.two}</h4></button></td> : null}
                                    </tr>
                                    <tr style={{width:'100%', height:'30%', border:'none'}}>
                                        {this.state.current && this.state.current.one > 0 ? <td style={{width:'50%', border:'none', padding: '4px'}}><button style={{width:'100%', fontSize:'24px', fontWeight: 'bold', borderRadius: '10px'}} onClick={() => this.selectToMove(1)} disabled={!this.state.toPlay}><h4>One: {this.state.current.one}</h4></button></td> : null}
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
        );
    }
}
