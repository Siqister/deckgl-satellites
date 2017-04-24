import React,{Component} from 'react';
import {select,axisLeft,brushY,event} from 'd3';

const styleStatic = {
	line:{
		fill:'none',
		stroke:'rgb(200,200,200)',
		strokeWidth:'2px'
	},
	fill:{
		fill:'rgb(80,80,80)'
	}
};



class LegendBrush extends Component{
	constructor(props){
		super(props);

		this._brush = brushY()
			.on('brush',this._brushend.bind(this))
			.on('end',this._brushend.bind(this));
	}

	_brushend(){
		const {scale} = this.props,
			orbitRange = event.selection?event.selection.map(scale.invert):null;
		
		this.props.selectOrbitRange(orbitRange); //pass orbit range back up to <Legend>
	}

	componentDidUpdate(prevProps,prevState){
		const {width,height,margin,scale} = this.props;

		//if component is updated with <g.brush> rendered...
		//...update brush behavior
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
		//Ignore changes to props.margin
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
			<g
				className='static'
				transform={`translate(${margin.l},${margin.t})`} >
				<rect 
					x={0} y={(height-margin.t-margin.b)} width={(width-margin.l-margin.r)} height={margin.b}
					style={styleStatic.fill}
				/>
				<line
					x1={0} y1={(height-margin.t-margin.b)} x2={(width-margin.l-margin.r)} y2={(height-margin.t-margin.b)}
					style={styleStatic.line}
				/>
				<text dy={-5} y={(height-margin.t-margin.b)}> Distance from earth </text>
				<text textAnchor='middle' dy={-5}>Perigee</text>
				<text textAnchor='middle' dy={-5} x={(width-margin.l-margin.r)}>Apogee</text>
			</g>
			<Axis 
				scale={scale}
				width={width}
				height={height}
				margin={margin}
			/>
			<g 
				className='brush' 
				transform={`translate(${margin.l},${margin.t})`}
				ref='brush'
			/>
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
			.tickSize(10)
			.tickValues([
				10, //10km above earth, airliners
				160, //Low earth orbit (LEO)
				2000, //MEO
				35786 //GEO + 
			])
			.tickFormat(d => {
				const v = d>1000?Math.round(d/1000)+'K':d;
				return `${v} km`;
			})
		select(node).transition().call(axisY);
	}

	render(){
		return (<g 
			className='axis axis-y' 
			transform={`translate(${this.props.margin.l},${this.props.margin.t})`}
			ref='axis'/>)
	}
}

export default LegendBrush;