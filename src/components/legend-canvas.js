import React,{Component} from 'react';

const style = {
	position:'absolute',
	top:0,
	left:0,
	pointerEvents:'none'
}

class LegendCanvas extends Component{
	constructor(props){
		super(props);

		this.ctx = null;
		this._orbitToXY = this._orbitToXY.bind(this);
	}

	_redraw(data,selected){
		const {width,height,margin,scale} = this.props,
			ctx = this.ctx,
			satellites = new Path2D(),
			orbits = new Path2D(),
			selectedSatellites = new Path2D();

		ctx.clearRect(0,0,width,height);
		ctx.save();
		ctx.translate(margin.l, margin.t);

		data.map(this._orbitToXY).forEach(d=>{
			orbits.moveTo(0, scale(d.perigee));
			orbits.lineTo(width-margin.l-margin.r, scale(d.apogee));
			satellites.moveTo(d.x,d.y);
			satellites.arc(d.x,d.y,2,0,Math.PI*2);
		});

		selected.map(this._orbitToXY).forEach(d=>{
			selectedSatellites.moveTo(d.x,d.y);
			selectedSatellites.arc(d.x,d.y,2,0,Math.PI*2);
		});

		ctx.stroke(orbits);
		ctx.fill(satellites);
		ctx.fillStyle = 'rgba(255,255,0,.7)';
		ctx.fill(selectedSatellites);
		ctx.restore();
	}

	_orbitToXY(d){
		//helper function to convert satellite orbital position to xy coordinate on the legend
		const {width,height,margin,scale} = this.props;
		const _theta = d.theta%(Math.PI*2); //between 0 and 2*PI radians
		const x = _theta < Math.PI?_theta/Math.PI*(width-margin.l-margin.r):(2-_theta/Math.PI)*(width-margin.l-margin.r);
		const y = scale(d.r); 

		return Object.assign({},d,{x,y});
	}

	componentWillReceiveProps(nextProps){
		//component will receive latest satellite positions as nextProps.data...
		//...as well as latest selection as nextProps.selected
		//won't re-render component, but will redraw existing <canvas>
		if(this.ctx && nextProps.data){
			this._redraw(nextProps.data, nextProps.selected);
		}
	}

	componentDidUpdate(nextProps,nextState){
		const {width,height,margin,scale} = this.props;

		//if component is updated with <canvas> rendered, access its drawing context
		if(width&&height&&margin&&scale){
			this.ctx = this.refs.canvas.getContext('2d');
			this.ctx.fillStyle = 'rgba(255,255,255,.5)';
			this.ctx.strokeStyle = 'rgba(255,255,255,.05)';
		}
	}

	shouldComponentUpdate(nextProps,nextState){
		//Only update if props.width or props.height change, or if props.scale is first instantiated
		//Ignore changes to props.margin
		//Also ignore changes to props.data or props.selected (_redraw rather than re-render)
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
			<canvas
				width={width}
				height={height}
				style={style}
				ref='canvas'
			>
			</canvas>
		)

	}
}

export default LegendCanvas;