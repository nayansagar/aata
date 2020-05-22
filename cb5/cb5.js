
	class Square extends React.Component {
	
		constructor(props) {
			super(props);
			this.state = {};
			this.onSourceSelected = this.onSourceSelected.bind(this);
		  }
		
		onSourceSelected(){
			console.log("In onSourceSelected");
			this.props.makeMoves(this.props.x, this.props.y, this.props.isSafe);
		}
		
		render() {
			let img;
			if ( this.props.isSafe ){
				img = <img style={{height:'100%', width:'100%', position:'absolute', display: 'block', zIndex:3}} src="https://chowkabara.com/assets/ghatta.png"/>
			}else{
				img = <img style={{height:'100%', width:'100%', position:'absolute', display: 'inline-block', zIndex:3}} src="https://chowkabara.com/assets/plain-white-background.jpg"/>
			}
		  return (
			<td style={{height:'20%', width:'20%', overflow:'hidden', border:'3px solid '+this.props.color, padding: '0px'}}>
				<div style={{height:'100%', width:'100%', position:'relative', zIndex:2}}>
					{img}
					<table style={{tableLayout:'fixed', height:'100%', width:'100%', position:'relative', border: 'none', valign:'middle', zIndex: 4, padding: '0px'}}>
						<tbody>
							<tr style={{border: 'none', height: '50%'}}>
								{ (this.props.data && this.props.data.green > 0) ? <td style={{width:'50%', height:'100%', border: 'none', overflow: 'hidden', padding: '0px'}}><button onClick={this.onSourceSelected} class="circle_green">{this.props.data.green}</button></td> : null }
								{ (this.props.data && this.props.data.red > 0) ? <td style={{width:'50%', height:'100%', border: 'none', overflow: 'hidden', padding: '0px'}}><button onClick={this.onSourceSelected} class="circle_red">{this.props.data.red}</button></td> : null }
							</tr>
							<tr style={{border: 'none', height: '50%'}}>
								{ (this.props.data && this.props.data.blue > 0) ? <td style={{width:'50%', height:'100%', border: 'none', overflow: 'hidden', padding: '0px'}}><button onClick={this.onSourceSelected} class="circle_blue">{this.props.data.blue}</button></td> : null }
								{ (this.props.data && this.props.data.yellow > 0) ? <td style={{width:'50%', height:'100%', border: 'none', overflow: 'hidden', padding: '0px'}}><button onClick={this.onSourceSelected} class="circle_yellow">{this.props.data.yellow}</button></td> : null }
							</tr>
						</tbody>
					</table>
				</div>
			</td>
		  );
		}
	}

	class Board extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			squares: props.squares,
			participants_list: props.participants_list
		};
		
		this.makeMoves = this.makeMoves.bind(this);
		this.getPath = this.getPath.bind(this);
		this.getNodeIndexFromPath = this.getNodeIndexFromPath.bind(this);
	  }
	  
	  getPath(color){
			var colorPath = {
			'yellow':[{'x':4, 'y':2}, {'x':4, 'y':3}, 
			{'x':4, 'y':4}, {'x':3, 'y':4}, {'x':2, 'y':4}, {'x':1, 'y':4}, {'x':0, 'y':4},
			{'x':0, 'y':3}, {'x':0, 'y':2}, {'x':0, 'y':1}, {'x':0, 'y':0}, {'x':1, 'y':0},
			{'x':2, 'y':0}, {'x':3, 'y':0}, {'x':4, 'y':0}, {'x':4, 'y':1}, {'x':3, 'y':1},
			{'x':2, 'y':1}, {'x':1, 'y':1}, {'x':1, 'y':2}, {'x':1, 'y':3}, {'x':2, 'y':3},
			{'x':3, 'y':3}, {'x':3, 'y':2}, {'x':2, 'y':2}
			],
			
			'red':[{'x':2, 'y':4}, {'x':1, 'y':4}, 
			{'x':0, 'y':4}, {'x':0, 'y':3}, {'x':0, 'y':2}, {'x':0, 'y':1}, {'x':0, 'y':0},
			{'x':1, 'y':0}, {'x':2, 'y':0}, {'x':3, 'y':0}, {'x':4, 'y':0}, {'x':4, 'y':1},
			{'x':4, 'y':2}, {'x':4, 'y':3}, {'x':4, 'y':4}, {'x':3, 'y':4}, {'x':3, 'y':3},
			{'x':3, 'y':2}, {'x':3, 'y':1}, {'x':2, 'y':1}, {'x':1, 'y':1}, {'x':1, 'y':2},
			{'x':1, 'y':3}, {'x':2, 'y':3}, {'x':2, 'y':2}
			],
			
			'blue':[{'x':0, 'y':2}, {'x':0, 'y':1}, 
			{'x':0, 'y':0}, {'x':1, 'y':0}, {'x':2, 'y':0}, {'x':3, 'y':0}, {'x':4, 'y':0},
			{'x':4, 'y':1}, {'x':4, 'y':2}, {'x':4, 'y':3}, {'x':4, 'y':4}, {'x':3, 'y':4},
			{'x':2, 'y':4}, {'x':1, 'y':4}, {'x':0, 'y':4}, {'x':0, 'y':3}, {'x':1, 'y':3},
			{'x':2, 'y':3}, {'x':3, 'y':3}, {'x':3, 'y':2}, {'x':3, 'y':1}, {'x':2, 'y':1},
			{'x':1, 'y':1}, {'x':1, 'y':2}, {'x':2, 'y':2}
			],
			
			'green':[{'x':2, 'y':0}, {'x':3, 'y':0}, 
			{'x':4, 'y':0}, {'x':4, 'y':1}, {'x':4, 'y':2}, {'x':4, 'y':3}, {'x':4, 'y':4},
			{'x':3, 'y':4}, {'x':2, 'y':4}, {'x':1, 'y':4}, {'x':0, 'y':4}, {'x':0, 'y':3},
			{'x':0, 'y':2}, {'x':0, 'y':1}, {'x':0, 'y':0}, {'x':1, 'y':0}, {'x':1, 'y':1},
			{'x':1, 'y':2}, {'x':1, 'y':3}, {'x':2, 'y':3}, {'x':3, 'y':3}, {'x':3, 'y':2},
			{'x':3, 'y':1}, {'x':2, 'y':1}, {'x':2, 'y':2}
			]
			}
			
			return colorPath[color];
		}
		
		getNodeIndexFromPath(colorPath, xIndex, yIndex){
			for(var i=0; i<colorPath.length; i++){
				if(colorPath[i].x == xIndex && colorPath[i].y == yIndex){
					return i;
				}
			}
			return -1;
		}
	  
	  makeMoves(xIndex, yIndex, isSafe){
			var color = this.props.color;
			this.state.squares = JSON.parse(JSON.stringify(this.props.squares));
			console.log("In makeMoves, xIndex : "+xIndex+", yIndex : "+yIndex+", color : "+color);
			console.log("this.state.squares : "+JSON.stringify(this.state.squares));
			console.log("this.state.squares[xIndex][yIndex][color] : "+this.state.squares[xIndex][yIndex][color]);
			console.log("this.state.squares[xIndex][yIndex][color] : ", this.state.squares[xIndex][yIndex][color]);
			if(!this.state.squares[xIndex][yIndex][color] || this.state.squares[xIndex][yIndex][color] <= 0){
				console.log("Invalid source selected, no coins for this user in square : ["+xIndex+","+yIndex+"], color : "+color);
				this.props.commentaryShow("You don't have a coin there!");
				return;
			}
			
			var colorPath = this.getPath(color);
			console.log("colorPath : "+JSON.stringify(colorPath));
			var startIndex = this.getNodeIndexFromPath(colorPath, xIndex, yIndex);
			var endIndex = startIndex + this.props.current['scoreToMove'];
			if(endIndex >= colorPath.length){
				this.props.commentaryShow("Can't move this coin by "+this.props.current['scoreToMove']+" places. If you can't move all scores, click \"PASS\" to let the next player play");
				return;
			}
			var boardX = colorPath[endIndex].x;
			var boardY = colorPath[endIndex].y;
			var killed;
			var killable = false;
			var letsKill = false;
			['red', 'blue', 'yellow', 'green'].forEach((c) => {
				console.log("Checking square ["+boardX+","+boardY+"] for color : "+c+"; square : "+JSON.stringify(this.state.squares[boardX][boardY]));
				if(this.state.squares[boardX][boardY][c] > 0 && c != color && !this.state.squares[boardX][boardY]['isSafe']){
					killable = true;
					letsKill = window.confirm("Confirm! Kill "+c+" coin? You cannot UNDO this move."); 
					if(letsKill == true){
						this.state.squares[xIndex][yIndex][color] = this.state.squares[xIndex][yIndex][color] - 1;
						this.state.squares[boardX][boardY][color] = (this.state.squares[boardX][boardY] && this.state.squares[boardX][boardY][color]) ? this.state.squares[boardX][boardY][color] + 1 : 1;
						console.log("Should be killing a coin : "+c+" found at : ["+boardX+","+boardY+"], participants_list : "+JSON.stringify(this.props.participants_list));
						var colorHome = this.props.participants_list.find(p => p.color == c).home;
						this.state.squares[boardX][boardY][c] = this.state.squares[boardX][boardY][c] - 1;
						this.state.squares[colorHome.x][colorHome.y][c] = (this.state.squares[colorHome.x][colorHome.y] && this.state.squares[colorHome.x][colorHome.y][c]) ? this.state.squares[colorHome.x][colorHome.y][c] + 1 : 1;
						killed = {'color': c, 'home': colorHome};
						this.props.addToHistory({'x':xIndex, 'y':yIndex}, {'x':boardX, 'y': boardY}, this.props.current['scoreToMove'], killed);
						this.props.setPlayOnKill();
					} else {
						console.log("letsKill not confirmed");
						this.props.undoSelectToMove();
						return;
					}	
				}
			});
			if(!killable){
				console.log("Nothing is killed : "+killed);
				this.state.squares[xIndex][yIndex][color] = this.state.squares[xIndex][yIndex][color] - 1;
				this.state.squares[boardX][boardY][color] = (this.state.squares[boardX][boardY] && this.state.squares[boardX][boardY][color]) ? this.state.squares[boardX][boardY][color] + 1 : 1;
				this.props.addToHistory({'x':xIndex, 'y':yIndex}, {'x':boardX, 'y': boardY}, this.props.current['scoreToMove'], killed);
			}
			
			if(endIndex == colorPath.length - 1){
				this.props.commentaryShow("GOOD JOB! The coin has reached it's destination!", true);
			}
			this.props.updateSquares(this.state.squares);
	  }
	  
	  renderSquare(xIndex, yIndex, isSafe = false, color = 'black') {
		  if( this.props.squares && this.props.squares.length > 0 ){
			return (<Square x={xIndex} y={yIndex} isSafe={isSafe} color={color} data={this.props.squares[xIndex][yIndex]} makeMoves={this.makeMoves}/>);
		  }else{
			return (<Square x={xIndex} y={yIndex} isSafe={isSafe} color={color} data=''/>);
		  }		
	  }

	  render() {
		return (
		  <table  style={{tableLayout:'fixed', width: '98vmin', height:'100vmin', align: 'center', marginLeft:'auto',marginRight:'auto', borderCollapse: 'separate', borderSpacing: '1px', padding: '1px'}}>
			  <tbody>
				<tr>
				  {this.renderSquare(0, 0)}
				  {this.renderSquare(0, 1)}
				  {this.renderSquare(0, 2, true, 'blue')}
				  {this.renderSquare(0, 3)}
				  {this.renderSquare(0, 4)}
				</tr>
				<tr>
				  {this.renderSquare(1, 0)}
				  {this.renderSquare(1, 1)}
				  {this.renderSquare(1, 2)}
				  {this.renderSquare(1, 3)}
				  {this.renderSquare(1, 4)}
				</tr>
				<tr>
				  {this.renderSquare(2, 0, true, 'green')}
				  {this.renderSquare(2, 1)}
				  {this.renderSquare(2, 2, true)}
				  {this.renderSquare(2, 3)}
				  {this.renderSquare(2, 4, true, 'red')}
				</tr>
				<tr>
				  {this.renderSquare(3, 0)}
				  {this.renderSquare(3, 1)}
				  {this.renderSquare(3, 2)}
				  {this.renderSquare(3, 3)}
				  {this.renderSquare(3, 4)}
				</tr>
				<tr>
				  {this.renderSquare(4, 0)}
				  {this.renderSquare(4, 1)}
				  {this.renderSquare(4, 2, true, 'yellow')}
				  {this.renderSquare(4, 3)}
				  {this.renderSquare(4, 4)}
				</tr>
			  </tbody>
		  </table>
		);
	  }
	}
	
	class ScoreBoard extends React.Component {
	
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
								<table style={{width:'100%', height:'45%', border: 'none'}}>
									<tbody>
										<tr style={{width:'100%', height:'12%', border:'none'}}>
											{this.state.current && this.state.current.eight > 0 ? <td style={{width:'50%', border:'none', padding: '2px'}}><button style={{width:'100%', fontSize:'21px', fontWeight: 'bold', borderRadius: '10px'}} onClick={() => this.selectToMove(8)} disabled={!this.state.toPlay}><b>Eight: {this.state.current.eight}</b></button></td> : null}
											{this.state.current && this.state.current.four > 0 ? <td  style={{width:'50%', border:'none', padding: '2px'}}><button style={{width:'100%', fontSize:'21px', fontWeight: 'bold', borderRadius: '10px'}} onClick={() => this.selectToMove(4)} disabled={!this.state.toPlay}><b>Four: {this.state.current.four}</b></button></td> : null}
										</tr>
										<tr style={{width:'100%', height:'12%', border:'none'}}>
											{this.state.current && this.state.current.three > 0 ? <td style={{width:'50%', border:'none', padding: '2px'}}><button style={{width:'100%', fontSize:'21px', fontWeight: 'bold', borderRadius: '10px'}} onClick={() => this.selectToMove(3)} disabled={!this.state.toPlay}><b>Three: {this.state.current.three}</b></button></td> : null}
											{this.state.current && this.state.current.two > 0 ? <td  style={{width:'50%', border:'none', padding: '2px'}}><button style={{width:'100%', fontSize:'24px', fontWeight: 'bold', borderRadius: '10px'}} onClick={() => this.selectToMove(2)} disabled={!this.state.toPlay}><b>Two: {this.state.current.two}</b></button></td> : null}
										</tr>
										<tr style={{width:'100%', height:'12%', border:'none'}}>
											{this.state.current && this.state.current.one > 0 ? <td style={{width:'50%', border:'none', padding: '2px'}}><button style={{width:'100%', fontSize:'24px', fontWeight: 'bold', borderRadius: '10px'}} onClick={() => this.selectToMove(1)} disabled={!this.state.toPlay}><b>One: {this.state.current.one}</b></button></td> : null}
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
	
	class Game extends React.Component {
		
	  constructor(props) {
		super(props);
		console.log("GID #### "+this.props.gameId) 
		
		this.state = {
			'showModal': false,
			'gameId': this.props.gameId,
			'showConnect': false,
			'squares': []
		}
		this.componentDidMount = this.componentDidMount.bind(this);
		this.updateCurrentState = this.updateCurrentState.bind(this);
		this.updateSquares = this.updateSquares.bind(this);
		this.connect = this.connect.bind(this);
		this.check = this.check.bind(this);
		this.commentaryShow = this.commentaryShow.bind(this);
		this.setPlayOnKill = this.setPlayOnKill.bind(this);
		this.unsetPlayOnKill = this.unsetPlayOnKill.bind(this);
		this.sendChatMessage = this.sendChatMessage.bind(this);
		this.addToHistory = this.addToHistory.bind(this);
		this.undoLastMove = this.undoLastMove.bind(this);
		this.undoAllMoves = this.undoAllMoves.bind(this);
		this.finishTurn = this.finishTurn.bind(this);
		this.createGameAndConnect = this.createGameAndConnect.bind(this);
		this.sendWSMessage = this.sendWSMessage.bind(this);
		this.getNextTurn = this.getNextTurn.bind(this);
		this.verifyAndConnect = this.verifyAndConnect.bind(this);
		this.joinGame = this.joinGame.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.leaveGame = this.leaveGame.bind(this);
		this.updateLeaderBoard = this.updateLeaderBoard.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.showHelp = this.showHelp.bind(this);
		this.refresh = this.refresh.bind(this);
	  }
	  
	  updateCurrentState(currentState){
		console.log("in updateCurrentState");
		this.state['current'] = currentState;
		this.setState(this.state);
		this.sendWSMessage();
	  }
	  
	  getNextTurn(pList, me){
		if(this.state.squares[2][2]['red'] == 4 && this.state.squares[2][2]['blue'] == 4 && this.state.squares[2][2]['green'] == 4 && this.state.squares[2][2]['yellow'] == 4){
			console.log("All turns done!");
			return null;
		}
		var meIndex = this.state.participants_list.findIndex(p => p.color == me.color)
		var nextIndex = meIndex;
		if(pList.length == 2){
			nextIndex = (meIndex+1)%2;
		}
		if(pList.length == 4){
			var nextIndex = (meIndex == 0 ? 2 : (meIndex == 1 ? 3 : (meIndex == 2 ? 1 : 0)));
		}
		
		if(pList.length == 3){
			var nextIndex = (meIndex == 0 ? 2 : (meIndex == 1 ? 0 : 1));
		}
		
		var nextColor = this.state.participants_list[nextIndex].color;
		if(this.state.squares[2][2][nextColor] == 4){
			return this.getNextTurn(pList, this.state.participants_list[nextIndex]);
		}
		console.log("Next index : "+nextIndex+", nextParticipant : "+JSON.stringify(pList[nextIndex]));
		return pList[nextIndex].color;
	  }
	  
	  addToHistory(start, end, score, killed){
		if(!this.state.current['history']){
			this.state.current['history'] = [];
		}
		this.state.current['history'].push({
			'start': start,
			'end': end,
			'score': score,
			'killed': killed
		})
	  }
	  
	  undoLastMove(undoAll){
		var scoreToWord = {1:"one", 2:"two", 3:"three", 4:"four", 8: "eight"};
		if(this.state.current['history'].length > 0){
			console.log("Undo before pop : "+JSON.stringify(this.state.current['history'])+", undoAll : "+undoAll);
			var moveToUndo = this.state.current['history'].pop();
			console.log("Undo move : "+JSON.stringify(moveToUndo)+", remaining history : "+JSON.stringify(this.state.current['history'])+", moveToUndo.killed : "+moveToUndo.killed);
			
			if(moveToUndo.killed){
				if(undoAll == 0){
					window.alert("You cannot undo a kill. Click \"PASS\" to undo all moves and pass the turn");
					this.state.current['history'].push(moveToUndo);
					return;
				} else {
					this.state.squares[moveToUndo.start['x']][moveToUndo.start['y']][this.state.me.color] = this.state.squares[moveToUndo.start['x']][moveToUndo.start['y']][this.state.me.color]+1;
					this.state.squares[moveToUndo.end['x']][moveToUndo.end['y']][this.state.me.color] = this.state.squares[moveToUndo.end['x']][moveToUndo.end['y']][this.state.me.color]-1;
					this.state.current[scoreToWord[moveToUndo.score]] = this.state.current[scoreToWord[moveToUndo.score]] ? this.state.current[scoreToWord[moveToUndo.score]] + 1 : 1;

					var killed = moveToUndo.killed;
					this.state.squares[moveToUndo.end['x']][moveToUndo.end['y']][killed.color] = this.state.squares[moveToUndo.end['x']][moveToUndo.end['y']][killed.color] ? this.state.squares[moveToUndo.end['x']][moveToUndo.end['y']][killed.color]+1 : 1;
					this.state.squares[killed.home.x][killed.home.y][killed.color] = this.state.squares[killed.home.x][killed.home.y][killed.color] - 1;
					if(killed['afterKill'] && killed['afterKill'].length > 0){
						killed['afterKill'].forEach(scr => {
							this.state.current[scr] = this.state.current[scr] ? this.state.current[scr] - 1 : 0;
						});
					}
				}
			} else {
				this.state.squares[moveToUndo.start['x']][moveToUndo.start['y']][this.state.me.color] = this.state.squares[moveToUndo.start['x']][moveToUndo.start['y']][this.state.me.color]+1;
				this.state.squares[moveToUndo.end['x']][moveToUndo.end['y']][this.state.me.color] = this.state.squares[moveToUndo.end['x']][moveToUndo.end['y']][this.state.me.color]-1;
				this.state.current[scoreToWord[moveToUndo.score]] = this.state.current[scoreToWord[moveToUndo.score]] ? this.state.current[scoreToWord[moveToUndo.score]] + 1 : 1;
			}
			this.setState(this.state);
			this.sendWSMessage();
		}
	  }
	  
	  undoAllMoves(){
		while(this.state.current['history'] && this.state.current['history'].length > 0){
			this.undoLastMove(1);
			console.log("Undo all moves : "+JSON.stringify(this.state));
		}
		console.log("After Undo All : "+JSON.stringify(this.state.current['history']));
	  }
	  
	  finishTurn(){
		var me = this.state.participants_list.find(p => p.me == true);
		if( (!this.state.current['one'] || this.state.current['one'] == 0) 
			&& (!this.state.current['two'] || this.state.current['two'] == 0) 
			&& (!this.state.current['three'] || this.state.current['three'] == 0)
			&& (!this.state.current['four'] || this.state.current['four'] == 0)
			&& (!this.state.current['eight'] || this.state.current['eight'] == 0) 
			&& !this.state.playOnKill){
			console.log("All scores moved!, state : "+JSON.stringify(this.state));
			this.updateLeaderBoard();
			var nextTurn = this.getNextTurn(this.state.participants_list, me);
			if(nextTurn){
				this.state.current.toPlay = nextTurn;
				this.state.current.history = null;
				this.state.current.latestScore = null;
				this.state.commentary = null;
			}else{
				this.commentaryShow("GAME OVER!");
			}
			
		}else {
			const rollback = window.confirm("Abort/rollback this turn and pass to next player?"); 
			if(rollback == true){
				this.undoAllMoves();
				this.state.current['one'] = null;
				this.state.current['two'] = null;
				this.state.current['three'] = null;
				this.state.current['four'] = null;
				this.state.current['eight'] = null;
				var nextTurn = this.getNextTurn(this.state.participants_list, me);
				if(nextTurn){
					this.state.current.toPlay = nextTurn;
					this.state.current.history = null;
					this.state.current.latestScore = null;
				}else{
					this.commentaryShow("GAME OVER!");
				}
			}else{
				this.commentaryShow("Move or undo all scores to continue");
			}
		}
		this.setState(this.state);
		this.sendWSMessage();
	  }
	  
	  updateLeaderBoard(){
		var color = this.state.me.color;
		if(this.state.squares[2][2][color] == 4){
			if(!this.state.current.leader_board){
				this.state.current.leader_board = {[color]: 1};
			}else{
				if(color in this.state.current.leader_board){
					console.log("Color "+color+" already on leader_board -- this should never happen");
				}else{
					var rank = 1;
					Object.keys(this.state.current.leader_board).forEach((lbColor) => {
						var lbRank = this.state.current.leader_board[lbColor]
						if(lbRank > rank){
							rank = lbRank;
						}
					});
					this.state.current.leader_board[color] = rank+1;
					
					var starUnicode = '\uD83C\uDF1F';
						let starColor=null;
						let medalName=null;
						if((rank+1) == 1){
							starColor = '#ffd700';
							medalName = 'gold';
						}
						
						if((rank+1) == 2){
							starColor = '#C0C0C0';
							medalName = 'silver';
						}
						
						if((rank+1) == 3){
							starColor = '#CD7F32';
							medalName = 'bronze';
						}
					this.commentaryShow("CONGRATULATIONS! You have won the "+medalName+" medal!");
				}						
			}					
		}
		this.setState(this.state);
	  }
	  
	  updateSquares(squares){
		var scoreValName = {1: "one", 2: "two", 3:"three", 4:"four", 8:"eight"};
		var score = this.state.current['scoreToMove'];
		this.state.current['scoreToMove'] = 0;
		this.state.current[scoreValName[score]] = this.state.current[scoreValName[score]] - 1;
		this.state['squares'] = squares;
		this.setState(this.state);
		this.sendWSMessage();
	  }
	  
	  undoSelectToMove(){
		var scoreToWord = {1:"one", 2:"two", 3:"three", 4:"four", 8: "eight"};
		var scrToMv = this.state.current['scoreToMove'];
		this.state.current[scoreToWord[scrToMv]] = this.state.current[scoreToWord[scrToMv]] ? this.state.current[scoreToWord[scrToMv]] + 1 : 1;
		this.state.current['scoreToMove'] = 0;
		this.setState(this.state);
	  }
	  
	  sendChatMessage(message){
		console.log("In sendChatMessage : "+message);
		this.state['chat'] = {
			'sender': this.state.me.name,
			'text': message
		}
		this.setState(this.state);
		this.sendWSMessage();
	  }
	  
	  leaveGame(myTurn){
		const letsGo = window.confirm("Do you want to leave this game?"); 
		if(letsGo == true){						
			this.sendWSMessage(false, true, myTurn);
			this.setState({'gameId': null});
			history.replaceState('Aata', 'ChowkaBara', window.location.href.split('?')[0]);
			this.props.goHomeNoConfirm();	
		}
	  }
	  
	  sendWSMessage(ping = false, quit = false, myTurn = false){
		if(ping){
			this.state.ws.send(JSON.stringify({'gameId':this.state.gameId, 'state':'ping'}));
		}else {
			this.state.version = this.state.version+1;
			if(quit){
				if(myTurn){
					console.log("MEMEMEMEME : "+JSON.stringify(this.state.me));
					this.state.ws.send(JSON.stringify({'gameId':this.state.gameId, 'state':'quit:'+this.getNextTurn(this.state.participants_list, this.state.me)}));
				}else{
					this.state.ws.send(JSON.stringify({'gameId':this.state.gameId, 'state':'quit'}));
				}
			}else{
				this.state.ws.send(JSON.stringify({
					'gameId':this.state.gameId, 
					'state':{
						'version': this.state.version, 
						'squares': this.state.squares, 
						'current': this.state.current
					}
				}));
			}
		}
	  }
	  
	createGameAndConnect(){
		var tempThis = this;
		if(this.state.ws){
			this.state.ws.close();
		}
		if(!this.state.name){
			var playerName = prompt('Please enter your name');
			if(playerName){
				this.state['name'] = playerName;
			}else{
				this.props.goHomeNoConfirm();
				return;
			}
		}
		fetch('https://ljtgvhy8y4.execute-api.us-east-1.amazonaws.com/prod/games/cb5', {
				  method: 'POST',
				  headers: {
					'Content-Type': 'application/json',
				  }
				})
				.then(function(response){return response.json()})
				.then(function(json){
					console.log("Created game with ID : "+json.gameId+", initial state : "+JSON.stringify(json.state));
					tempThis.state['gameId'] = json.gameId;
					tempThis.state['squares'] = json.state;
					if(tempThis.state.name){
						console.log("before connect");
						tempThis.commentaryShow("Welcome to the game of ChowkaBara 5x5! Click \"Invite\" button below to start the game with your gang...");
						tempThis.connect();
					}					
				})
				.catch(function(error){
				  console.error("Error while creating game", error);
				})
	}

		componentDidMount() {
			console.log('In componentDidMount');
			if(!this.state.gameId || (this.state.gameId && this.state.gameId == 'CREATE')){
				this.createGameAndConnect();
			}else{
				this.verifyAndConnect();
			}
			this.commentaryShow("1. If you see the \"PLAY\" button, it is your turn to play. Arrows (>>>) next to the name indicate the current turn\n\n2. If you want to quit the game mid-way, click on \"Quit\" to let others continue\n\n3. Use \"Help\" option to see the previous message\n\n4. Click \"Refresh\" if you feel the game is stuck");
		}
		
		showHelp() {
			this.state.showModal = true;
			this.setState(this.state);
		}
		
		refresh() {
			this.sendWSMessage(true);
		}
		
		verifyAndConnect(){
			if(!this.state.name){
				var localMe = JSON.parse(localStorage.getItem('aata.cb.me.'+this.state.gameId));
				this.state['name'] = localMe && localMe.name ? localMe.name : null;
			}
			
			if(this.state.name){
				this.state['showConnect'] = false;
				this.connect();
			}else{
				this.state['showConnect'] = true;
				this.setState(this.state);
			}
		}
		
		timeout = 50; // Initial timeout duration as a class variable

		connect() {
			console.log("In connect");
			var gid2 = this.state['gameId'];
			var wsUrl = 'wss://bhtj205hmh.execute-api.us-east-1.amazonaws.com/prod?gameId='+gid2;
			var localMe = JSON.parse(localStorage.getItem('aata.cb.me.'+gid2));
			console.log("Found localMe : "+localMe);
			if(localMe && localMe.name){
				console.log("LocalMe.name : "+localMe.name);
				wsUrl = wsUrl + '&name='+localMe.name;
			}else if(this.state.name){
				console.log("this.state.name : "+this.state.name);
				wsUrl = wsUrl + '&name='+this.state.name;
			}
			if(localMe && localMe.color){
				console.log("LocalMe.color : "+localMe.color);
				wsUrl = wsUrl + '&color='+localMe.color;
			}
			console.log("Connecting to WS at : "+wsUrl);
			var ws = new WebSocket(wsUrl);
			let that2 = this; // cache the this
			var connectInterval;

			// websocket onopen event listener
			ws.onopen = () => {
				// on connecting, do nothing but log it to the console
				console.log('connected, ws : '+ws, JSON.stringify(ws))
				that2.state['ws'] = ws;
				that2.setState(that2.state);
				
				this.setState({ ws: ws });

				that2.timeout = 50; // reset timer to 250 on open of websocket connection 
				clearTimeout(connectInterval); // clear Interval on on open of websocket connection
				that2.sendWSMessage(true);
			};
			
			ws.onmessage = function(evt){
				// listen to data sent from the websocket server
				const message = JSON.parse(evt.data)
				console.log("this.state.gameId : "+that2.state.gameId);
				console.log("Message: "+JSON.stringify(message))
				if(that2.state.gameId != message.gameId){
					console.log("received message for a different game, ignoring...");
					return;
				}
				var me = message.participants.find(p => p['me'] == true)
				if( (that2.state.version && that2.state.version > 0 && message.state.current.toPlay == me.color) && (message.state.current.history && message.state.current.history.length > 0) ){
					console.log("History update message for self, ignore...");
					return;
				}
				
				if(message.state.version && message.state.version < that2.state.version){
					console.log("Received an old message with version "+message.state.version+", current sate version : "+that2.state.version+". Ignoring this message...");
					return;
				}
				localStorage.setItem('aata.cb.me.'+gid2, JSON.stringify(me) );
				that2.setState({
					'squares': message.state.squares, 
					'gameId': gid2,
					'version': message.state.version,
					'participants_list':message.participants, 
					'current': message.state.current,
					'chat': message.state.chat,
					'me': me
				})
						
				if(window.location.href && window.location.href.indexOf(gid2) == -1){
					var gameUrl = window.location.href.split('?')[0]+'?gid='+gid2
					//window.location.href = window.location.href + '?gid='+gid2+'&name='+me.name+'&color='+me.color;							
					history.replaceState('Aata', 'ChowkaBara', gameUrl);
				}
			}

			// websocket onclose event listener
			ws.onclose = e => {
				console.log(
					`Socket is closed. Reconnect will be attempted in ${Math.min(
						10000 / 1000,
						(that2.timeout + that2.timeout) / 1000
					)} second.`,
					e.reason
				);

				that2.timeout = that2.timeout + that2.timeout; //increment retry interval
				connectInterval = setTimeout(this.check, Math.min(10000, that2.timeout)); //call check function after timeout
			};

			// websocket onerror event listener
			ws.onerror = err => {
				console.error(
					"Socket encountered error: ",
					err.message,
					"Closing socket"
				);

				ws.close();
			};
		};
		
		check() {
			console.log("inside check!");
			if (!this.state.ws || this.state.ws.readyState == WebSocket.CLOSED) this.connect();
		};
		
		commentaryShow(message, timed=false, duration=1500){
			console.log("In commentaryShow");
			this.state.commentary = message;
			this.state.showModal = true;
			this.setState(this.state);
			var that = this;
			if(timed){
				setTimeout(function(){
					that.state.showModal = false;
					that.setState(that.state)
				}, duration);
			}
		}
		
		setPlayOnKill(){
			this.state.playOnKill = true;
			this.setState(this.state);
		}
		
		unsetPlayOnKill(){
			this.state.playOnKill = false;
			this.setState(this.state);
		}
		
		handleChange(event) {
			console.log("In handleChange : "+event);
			//console.log("In handleChange string : "+JSON.stringify(event));
			this.state[event.target.name] = event.target.value;
			this.setState(this.state);
		  }
		
		joinGame(event){
			event.preventDefault();
			console.log("In joinGame : "+this.state.playerName);
			if(this.state.playerName && this.state.playerName.length > 0){
				this.state.name = this.state.playerName;
				this.verifyAndConnect();
			}
		}
		
		closeModal(){
			console.log("In close modal");
			this.state.showModal = false;
			this.setState(this.state);
		}

	  render() {
		console.log("RENDER STATE : "+JSON.stringify(this.state));
		return (
			<div style={{marginLeft:'auto',marginRight:'auto'}}>
				<div style={{zIndex: 1, position:'relative'}}>
					{ this.state.showConnect ? 
						<div>
							<div style={{width: '45%', border: 'none', marginLeft:'auto', marginRight:'auto', textAlign: 'center', marginTop: '10%', color:'#AAF', fontSize: '40px', fontWeight: 'bold'}}>
								<p><b>Enter your name and join the game!</b></p>
							</div>
							<table style={{height:'20%', width:'35%', border: 'none', marginLeft:'auto',marginRight:'auto', overflow: 'hidden'}}>
								<tbody  style={{border: 'none'}}>
									<tr style={{border: 'none'}}>
										<td style={{border: 'none', width:'50%', height: '50%', float: 'center', marginLeft:'auto',marginRight:'auto'}}>
											<input style={{width:'60%', height: '50%', float: 'center', textAlign: 'center', marginLeft:'20%',marginRight:'auto', fontSize: '20px'}} type="text" name="playerName" onChange={this.handleChange}/>
										</td>
									</tr>
									<tr>
										<td  style={{border: 'none'}}>
											<button style={{background: '#AAF', color: 'white', verticalAlign: 'middle', marginLeft: 'auto', marginRight: 'auto', border: 'none', display: 'block', float: 'center', fontSize: '30px', fontWeight: 'bold'}} onClick={this.joinGame}>Join</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div> 
					: null}
					{ !this.state.showConnect ? 
					<div>
						<Board color={this.state.me && this.state.me.color ? this.state.me.color : null} current={this.state.current} squares={this.state.squares} ws={this.state.ws} updateSquares={this.updateSquares}  commentaryShow={this.commentaryShow} participants_list={this.state.participants_list} setPlayOnKill={this.setPlayOnKill} addToHistory={this.addToHistory}/>
						<ScoreBoard gameId={this.state.gameId} me={this.state.me} squares={this.state.squares} playOnKill={this.state.playOnKill} unsetPlayOnKill={this.unsetPlayOnKill} current={this.state.current} chat={this.state.chat} ws={this.state.ws} updateCurrentState={this.updateCurrentState} commentaryShow={this.commentaryShow}  participants_list={this.state.participants_list} sendChatMessage={this.sendChatMessage} undoLastMove={this.undoLastMove} undoAllMoves={this.undoAllMoves} finishTurn={this.finishTurn} createGame={this.createGameAndConnect} sendWSMessage={this.sendWSMessage} leaveGame={this.leaveGame} refresh={this.refresh} help={this.showHelp}/>
					</div>
					: null}
				</div>
				{ this.state.showModal ? 
				<div style={{padding: '0', zIndex: 99, width: '100vmin', height: '100vmax', position:'fixed', top: '11vmin', marginLeft: 'auto', marginRight: 'auto', background: 'rgba(0, 0, 0, 0)'}}>
					<div style={{padding:'2%', width: '70%', align: 'center', marginTop:'2%', marginLeft:'auto', marginRight:'auto', background: '#AAF', color: 'white', fontSize: '4vmin', whiteSpace:'pre-wrap', border: '3px solid white', borderRadius: '10px'}}>
						<p style={{padding: '0'}}>{this.state.commentary}</p>
						<div style={{textAlign: 'center'}}>
							<button style={{width: '20vmin', height: '8vmin', borderRadius: '12px', marginBottom: '1px', fontSize:'4vmin', background:'white', color:'#AAF'}} onClick={this.closeModal}><b>Close</b></button>
						</div>
					</div>
				</div>
				: null }
			</div>
		);
	  }
	}