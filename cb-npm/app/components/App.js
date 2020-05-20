import React from 'react';
import Home from './Home';
import Game from './Game';

export default class App extends React.Component {
	
    constructor(props) {
        super(props);
        this.state = {}
        this.createGame = this.createGame.bind(this);
        this.goHome = this.goHome.bind(this);
        this.goHomeNoConfirm = this.goHomeNoConfirm.bind(this);
    }
    
    createGame(){
        this.setState({'gameId':'CREATE'});
    }
    
    componentDidMount() {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let gid = params.get('gid');
        if(gid){
            this.setState({'gameId': gid});
        }
    }
    
    goHome() {
        const letsGo = window.confirm("Do you want to leave this game?"); 
        if(letsGo == true){						
            //this.props.sendWSMessage(false, true, this.state.toPlay && this.state.play);
            this.setState({'gameId': null});
            history.replaceState('Aata', 'ChowkaBara', window.location.href.split('?')[0]);
        }
    }
    
    showHelp() {
        window.alert("\n1. If you see the \"PLAY\" button, it is your turn to play. Arrows (>>>) next to the name indicate the current turn\n\n2. If you want to quit the game mid-way, click on \"Quit\" to let others continue\n\n3. Use \"Help\" option when needed\n\n4. Click \"Refresh\" if you feel the game is stuck\n");
    }
    
    goHomeNoConfirm() {
        this.setState({'gameId': null});
    }
    
    render() {
        let page;
        if(this.state.gameId){
            page = <Game gameId={this.state.gameId} goHomeNoConfirm={this.goHomeNoConfirm} goHome={this.goHome}  showHelp={this.showHelp}/>;
        }else{
            page = <Home createGame={this.createGame} showHelp={this.showHelp}/>;
        }
        return <div style={{marginLeft:'auto',marginRight:'auto'}}>
                <div style={{width:'100%', height:'10vmin', background: 'white', left: '0', top: '0', position: 'fixed', zIndex:98}}>
                    <table style={{height:'100%', padding: '0px', border: 'none', verticalAlign: 'top', display: 'inline-block'}}>
                        <tbody>
                            <tr style={{border: 'none', padding: '0px'}}>
                                <td style={{border: 'none', padding: '0px'}}>
                                    <button style={{background: 'white', color: '#AAF', verticalAlign: 'bottom', border: 'none', float: 'right', marginRight:'10%', fontSize:'150%', fontWeight: 'bold'}} onClick={this.goHome}><b>Home</b></button>
                                </td>
                                <td style={{border: 'none', padding: '0px'}}>
                                    <img style={{height: '90%', background: 'white', color: '#AAF', verticalAlign: 'top', border: 'none', display: 'block', margin: 'auto'}} src="https://chowkabara.com/assets/cb-full-whitebg-2.png"/>
                                </td>
                                <td style={{border: 'none', padding: '0px'}}>
                                    <button style={{background: 'white', color: '#AAF', verticalAlign: 'bottom', border: 'none', float: 'left', marginLeft:'10%', fontSize:'150%', fontWeight: 'bold'}} onClick={this.showHelp}><b>Instructions</b></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>						
                </div>
                <div style={{marginTop: '1%'}}>
                    <hr style={{height:'2px', borderWidth:'0', color:'#AAF', backgroundColor:'#AAF'}}/>
                </div>
                <div style={{width:'98vmin', height: '90vmin', marginLeft:'auto', marginRight:'auto', marginTop: '10vmin'}}>
                    {page}
                </div>
            </div>
    }
}
