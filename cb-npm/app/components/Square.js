import React from 'react';

export default class Square extends React.Component {
	
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
