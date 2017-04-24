import {ScatterplotLayer} from 'deck.gl';
import satelliteFragment from './satellite-layer-fragment.glsl';

class SatelliteLayer extends ScatterplotLayer{
	getShaders(){
		return {
			vs:super.getShaders().vs,
			fs:satelliteFragment
		}
	}
}

export default SatelliteLayer;