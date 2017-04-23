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
	}

	_redraw(data){
		const {width,height,margin,scale} = this.props,
			ctx = this.ctx,
			satellites = new Path2D(),
			orbits = new Path2D(),
			highlight = new Path2D();

		ctx.clearRect(0,0,width,height);
		ctx.save();
		ctx.translate(margin.l, margin.t);

		data.forEach(d=>{
			const _theta = d.theta%(Math.PI*2); //between 0 and 2*PI radians
			const x = _theta < Math.PI?_theta/Math.PI*(width-margin.l-margin.r):(2-_theta/Math.PI)*(width-margin.l-margin.r);
			const y = scale(d.r);

			//Draw satellites, orbits, and highlighted satellites with 3x Path2d objects
			orbits.moveTo(0, scale(d.perigee));
			orbits.lineTo(width-margin.l-margin.r, scale(d.apogee));
			satellites.moveTo(x,y);
			satellites.arc(x,y,2,0,Math.PI*2);
		});

		ctx.fill(satellites);
		ctx.stroke(orbits);
		ctx.restore();
	}

	componentWillReceiveProps(nextProps){
		//component will receive latest satellite positions as nextProps.data
		//won't re-render component, but will redraw existing <canvas>
		if(this.ctx && nextProps.data){
			this._redraw(nextProps.data);
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