import React,{Component} from 'react';
import {max,scaleLog} from 'd3';

import LegendBrush from './legend-brush';
import LegendCanvas from './legend-canvas';


const style = {
	width:'30%',
	minWidth:'300px',
	height:'100%',
	position:'absolute',
	backgroundColor:'black',
	borderRight:'1px solid #666',
	zIndex:999
};

const margin = {t:50, r:50, b:30, l:80};

class Legend extends Component{
	constructor(props){
		super(props);
		this.state = {
			width:null, //to set the dimensions of children <svg> and <canvas>
			height:null,
			margin:margin
		}

		this._scale = null;
	}

	componentDidMount(){
		this.setState({
			width:this.refs.legend.clientWidth,
			height:this.refs.legend.clientHeight
		});
	}

	componentWillReceiveProps(nextProps){
		//When props.data is first fetched, mine data for max/min and set scale
		//This should happen only once
		if(!this.props.data && nextProps.data){
			const _max = max(nextProps.data, d=>d.apogee);
			const {width,height,margin} = this.state;

			this._scale = scaleLog()
				.domain([_max,1])
				.range([0, height-margin.t-margin.b]);
		}
	}

	_selectOrbitRange(range){
		if(range){
			this.props.updateSelection( this.props.data.filter(d=>(d.r<range[0]&&d.r>range[1])) );
		}else{
			this.props.updateSelection([]);
		}
	}

	render(){
		return (
			<div 
				className='legend'
				style={style}
				ref='legend'
			>
				<LegendCanvas
					{...this.state}
					data={this.props.data}
					selected={this.props.selected}
					scale={this._scale}
				/>
				<LegendBrush 
					{...this.state}
					scale={this._scale}
					selectOrbitRange={this._selectOrbitRange.bind(this)}
				/>
			</div>
		)
	}
}

export default Legend;