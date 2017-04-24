import React,{Component} from 'react';
import {max,scaleLog} from 'd3';

const DEFAULT_STYLE = {
	width:'200px',
	position:'fixed',
	background:'white',
	padding:'10px'
}

class Tooltip extends Component{
	constructor(props){
		super(props);
	}

	_renderContent(d){
		if(!d) return;

		const obj = JSON.parse(d.obj)
		return (
			<div>
				<p className='entry'><span className='key'>ID</span>{obj.id}</p>
				<p className='entry'><span className='key'>Name</span>{obj.name}</p>
				<p className='entry'><span className='key'>Purpose</span>{obj.purpose}</p>
			</div>
		);
	}

	render(){
		let style;

		if(!this.props.d){
			style = Object.assign({},DEFAULT_STYLE,{
				display:'none'
			});
		}else{
			style = Object.assign({},DEFAULT_STYLE,{
				display:'block',
				top:(this.props.d.y+20)+'px',
				left:(this.props.d.x+20)+'px'
			});
		}

		return (
			<div className='tooltip' style={style}>
				{this._renderContent(this.props.d)}
			</div>
		)
	}
}

export default Tooltip;