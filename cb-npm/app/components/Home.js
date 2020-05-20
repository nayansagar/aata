import React from 'react';

export default class Home extends React.Component {
	
    constructor(props) {
        super(props);
        var ua = navigator.userAgent || navigator.vendor || window.opera;
        console.log("USERAGENT : "+ua);
        this.state = {
            isFacebookApp: (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1)
        }
    }
    
    render() {		
        return <div>
        <table style={{height:'20%', width:'30%', border: 'none', marginLeft:'auto',marginRight:'auto'}}>
                <tbody>
                    <tr style={{height:'60%', border: 'none'}}><td style={{border: 'none', marginLeft:'auto',marginRight:'auto', height:'20vmin', width:'40%'}}><img style={{height:'100%', width:'100%', display: 'block'}} src="https://chowkabara.com/assets/5x5Board.png"/></td></tr>
                    <tr style={{padding: '30px', border: 'none'}}><td style={{border: 'none', textAlign: 'center', color:'#AAF', fontSize: '25px', fontWeight: 'bold'}}><div><b>ChowkaBara 5x5</b></div></td></tr>
                    <tr style={{padding: '30px', border: 'none'}}>
                        <td style={{border: 'none'}}>
                            { !this.state.isFacebookApp ? 
                            <button style={{width:'100%', background: '#AAF', color:'white', fontSize: '20px', fontWeight: 'bold'}} onClick={this.props.createGame}><b>Start Game</b></button>
                            : null 
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
            { this.state.isFacebookApp ? 
                    <div style={{width: '75%', border: 'none', marginLeft:'auto', marginRight:'auto', textAlign: 'left', marginTop: '10%', color:'#AAF', fontSize: '40px', fontWeight: 'bold'}}>
                        <p>
                            <b>Open in Chrome to start the game.</b>
                            <br/><br/>
                            1. Go to the options menu (top right corner of this page)
                            <br/><br/>
                            2. Select "Open in Chrome"
                        </p>
                    </div>
                : null 
                }
        </div>
    }
}
