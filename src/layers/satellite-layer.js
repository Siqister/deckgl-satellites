import {ScatterplotLayer} from 'deck.gl';
import satelliteFragment from './satellite-layer-fragment.glsl';

//Essentially same as ScatterplotLayer
//with modified fragShader for a blurry edge
class SatelliteLayer extends ScatterplotLayer{
	getShaders(){
		return {
			vs:super.getShaders().vs,
			fs:satelliteFragment
		}
	}
}

SatelliteLayer.layerName = 'SatelliteLayer';

export default SatelliteLayer;