import {Layer,assembleShaders,COORDINATE_SYSTEM} from 'deck.gl';
import {GL,Model,Geometry} from 'luma.gl';

import orbitVertext from './orbit-layer-vertex.glsl';
import orbitFragment from './orbit-layer-fragment.glsl';

console.log('orbit layer');

const DEFAULT_PROPS = {
	getPositions: x => x.orbit,
	getColor: x => x.color || [255,255,255,255],
	getLngLat: x => x.lngLat,
	getR: x => x.r*300
}

class OrbitLayer extends Layer{
	constructor(props){
		super(props);
	}

	initializeState(){
		//Called only once
		const {gl} = this.context;
		this.setState({model:this._getModel(gl)});

		const {attributeManager} = this.state;

	    attributeManager.addInstanced({
	      	instancePositions: {size: 303, accessor: 'getPositions', update: this.calculatePositions},
	      	instanceColors: {size: 4, type: GL.UNSIGNED_BYTE, accessor: 'getColor', update: this.calculateInstanceColors}
	    });
	}

	draw({uniforms}){
		const {gl} = this.context;

		this.state.model.render(Object.assign({},uniforms));
	}

	calculatePositions(attribute){
		//attribute -> positions attribute
		const {size,value} = attribute;
		const {data,getPositions,getR,getLngLat} = this.props;

		let i = 0;
		for(const object of data){
			const positions = getPositions(object);

			positions.forEach(p => {
				const lngLat = getLngLat(p),
					r = getR(p);

				value[i] = lngLat[0];
				value[i+1] = lngLat[1];
				value[i+2] = r;

				i+=3;
			});
		}
	}

	calculateInstanceColors(attribute){
		const {size,value} = attribute;
		const {data,getColor} = this.props;

		let i = 0;
		for (const object of data) {
			const color = getColor(object);
			value[i + 0] = color[0];
			value[i + 1] = color[1];
			value[i + 2] = color[2];
			value[i + 3] = isNaN(color[3]) ? 255 : color[3];
			i += size;
		}
	}

	_getModel(gl) {

	const N_SUB = 100; //FIXME: hard-coded number of segments in each orbit path
	let positions = [];
	for(let i=0; i<N_SUB+1; i++){
		positions = [...positions,i,i,i];
	}

	const shaders = assembleShaders(gl, this.getShaders());

	return new Model({
			gl,
			id: this.props.id,
			vs: shaders.vs,
			fs: shaders.fs,
			geometry: new Geometry({
				drawMode: GL.LINE_STRIP,
				positions: new Float32Array(positions)
			}),
			isInstanced: true
		});
	}

	getShaders(){
		return {
			vs: orbitVertext,
			fs: orbitFragment
		}
	}
}

OrbitLayer.layerName = 'OrbitLayer';
OrbitLayer.defaultProps = DEFAULT_PROPS;

export default OrbitLayer;
