import React,{Component} from 'react';
import {select,axisLeft,brushY,event} from 'd3';

class Brush extends Component{
	constructor(props){
		super(props);

		this._brush = brushY()
			.on('end',this._brushend.bind(this));
	}

	_brushend(){
		const {scale} = this.props,
			orbitRange = event.selection.map(scale.invert);
			console.log(orbitRange);
	}

	componentDidUpdate(prevProps,prevState){
		const {width,height,margin,scale} = this.props;

		//if component is updated with <g.brush> rendered
		//Implement brush behavior
		if(width&&height&&margin&&scale){
			this._brush
				.extent([
					[0,0],
					[width-margin.l-margin.r,height-margin.t-margin.b]
				]);
			select(this.refs.brush).call(this._brush);
		}
	}

	shouldComponentUpdate(nextProps,nextState){
		//Only update if props.width or props.height change, or if props.scale is first instantiated
		//Ignore changes to props.data or props.margin
		if(nextProps.width !== this.props.width || 
			nextProps.height !== this.props.height || 
			(!this.props.scale && nextProps.scale)){
			return true;
		}else{
			return false;
		}
	}

	render(){
		const {width,height,margin,scale} = this.props;

		if(!(width&&height&&scale)){ return null; }

		return (
		<svg
			width={width}
			height={height}
		>
			<Axis 
				scale={scale}
				width={width}
				height={height}
				margin={margin}
			/>
			<g 
				className='brush' 
				transform={`translate(${margin.l},${margin.t})`}
				ref='brush'/>
		</svg>)
	}
}

class Axis extends Component{
	constructor(props){
		super(props);
	}

	componentDidMount(){
		this._updateAxis();
	}

	componentDidUpdate(){
		this._updateAxis();
	}

	_updateAxis(){
		//Use built-in d3.axisLeft to render axis
		//Not React kosher but faster than building DOM manually
		const {width,scale,margin} = this.props;
		const node = this.refs.axis;
		const axisY = axisLeft()
			.scale(scale)
			.tickSize( -(width-margin.l-margin.r))
			.tickValues([1000,10000,100000]);
		select(node).transition().call(axisY);
	}

	render(){
		return (<g 
			className='axis axis-y' 
			transform={`translate(${this.props.margin.l},${this.props.margin.t})`}
			ref='axis'/>)
	}
}

export default Brush;