import React,{Component} from 'react';
import {max,scaleLog} from 'd3';

import LegendBrush from './legend-brush';
import LegendCanvas from './legend-canvas';


const style = {
	width:'25%',
	minWidth:'300px',
	height:'100%',
	position:'absolute',
	zIndex:999
};

const margin = {t:250, r:50, b:20, l:90};

class Legend extends Component{
	constructor(props){
		super(props);
		this.state = {
			width:null, //used to set the dimensions of children <svg> and <canvas>
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

		//If viewport changes, set state.width and state.height based on computed width and height
		//Trigger re-render of child components <LegendCanvas> and <LegendBrush>
		if(this.props.width !== nextProps.width || this.props.height !== nextProps.height){
			const w = this.refs.legend.clientWidth,
				h = this.refs.legend.clientHeight,
				{margin} = this.state;

			if(this._scale) this._scale.range([0, h-margin.t-margin.b]);

			this.setState({
				width:w,
				height:h
			});
		}
	}

	_selectOrbitRange(range){
		//Triggered by <LegendBrush> child component
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
					scaleColor={this.props.scaleColor}
					selectOrbitRange={this._selectOrbitRange.bind(this)}
				/>
			</div>
		)
	}
}

export default Legend;