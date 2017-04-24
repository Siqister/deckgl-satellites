import {csv} from 'd3-request';

const R_EARTH = 6370,
	P_EARTH = 24*60*60; //earth's period, in sec

const config = {
	MAPBOX_TOKEN: 'pk.eyJ1Ijoic2lxaXpodTAxIiwiYSI6ImNiY2E2ZTNlNGNkNzY4YWYzY2RkMzExZjhkODgwMDc5In0.3PodCA0orjhprHrW6nsuVw'
}

//Helper functions:
//FP map
const map = fn => arr => arr.map(fn);
//Tracer
const trace = msg => x => {
	console.log(msg);
	console.log(x);
	return x;
}

//Data import and parse
const getData = (url,parse) => new Promise((resolve,reject) => {
		csv(url,parse,(err,rows) => {
			if(err){
				reject(err);
			}else{
				resolve(rows);
			}
		});
	});

const parse = d => {
	//Perform some basic orbit-related computations here
    const perigee = +d['Perigee (km)'],
        apogee = +d['Apogee (km)'],
        semiMajor = (perigee + apogee + R_EARTH*2)/ 2,
        eccentricity = (apogee - perigee)/(apogee + perigee + R_EARTH*2);

    return {
    	id:d['NORAD Number'],
        name:d['Name of Satellite, Alternate Names'],
        country:d['Country/Org of UN Registry'],
        countryOperator:d['Country of Operator/Owner'],
        operator:d['Operator/Owner'],
        purpose:d['Purpose'],
        orbitClass:d['Class of Orbit'],
        lngOffset:+d['Longitude of GEO (degrees)']?+d['Longitude of GEO (degrees)']:Math.random()*360-180,
        perigee,
        apogee,
        semiMajor,
        eccentricity,
        inclination:+d['Inclination (degrees)'],
        period:+d['Period (minutes)']*60,
 		thetaOffset: Math.random()*Math.PI*2
    };
}

//Orbit-related math
//http://www.orbiter-forum.com/showthread.php?t=26682
//Assumptions:
//theta tracks the % completion of each orbit; Math.PI*2 == one full orbit
//theta = 0 ==> orbit perigee (smallest r)
//theta = Math.PI/2 ==> where orbit crosses equatorial plane
const thetaToR = (theta,_a,_e) => _a*(1- Math.pow(_e,2))/(1 + Math.cos(theta)*_e);
const thetaToDec = (theta,_inc) => Math.sin(theta + Math.PI/2)*_inc;

//Given elapsed time delta, return function that generates orbital position
const getOrbitPosAt = delta => d => {
	const theta = d.thetaOffset + (delta/d.period)*Math.PI*2, //rotation in theta around the orbit, in elapsed time delta
		thetaRelative = (delta/d.period - delta/P_EARTH)*Math.PI*2;
	
	const lng = (d.lngOffset + thetaRelative/Math.PI*180 + 180)%360 - 180,
		lat = thetaToDec(thetaRelative+d.thetaOffset, d.inclination),
		r = thetaToR(thetaRelative+d.thetaOffset, d.semiMajor, d.eccentricity) - R_EARTH;

	return Object.assign({},d,{
		theta,
		lngLat:[lng,lat], 
		r
	}); 
}

//Map satellite datum to array of orbit segments
//Memoized to minimized repeat computation
const getOrbit = (() => {
		let memo = {};
		const N_SUB = 100;

		return d => {
			if(d.id in memo){
				return memo[d.id];
			}

			const orbitVertices = Array.from({length:N_SUB}, (v,i)=>{
				const t0 = (i/N_SUB)*Math.PI*2, t1 = (i+1)/N_SUB*Math.PI*2;
				return {
					from:{
						theta:t0,
						r:thetaToR(t0+d.thetaOffset, d.semiMajor, d.eccentricity) - R_EARTH,
						lngLat:[
							(d.lngOffset + t0/Math.PI*180 + 180)%360 - 180,
							thetaToDec(t0+d.thetaOffset, d.inclination)
						]
					},
					to:{
						theta:t1,
						r:thetaToR(t1+d.thetaOffset, d.semiMajor, d.eccentricity) - R_EARTH,
						lngLat:[
							(d.lngOffset + t1/Math.PI*180 + 180)%360 - 180,
							thetaToDec(t1+d.thetaOffset, d.inclination)
						]
					}
				}
			}).filter(x => x.from.lngLat[0] <= x.to.lngLat[0]); //Prevent orbit from crossing back

			memo[d.id] = orbitVertices;
			return orbitVertices;
		}
})();

export {config,map,trace,getData,parse,getOrbitPosAt,getOrbit};