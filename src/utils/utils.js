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
const getData = (url,parse) => {
	return new Promise((resolve,reject) => {
		csv(url,parse,(err,rows) => {
			if(err){
				reject(err);
			}else{
				resolve(rows);
			}
		});
	});
}

const parse = d => {
	//Perform some basic orbit-related computations here
    const perigee = +d['Perigee (km)'],
        apogee = +d['Apogee (km)'],
        semiMajor = (perigee + apogee + R_EARTH*2)/ 2,
        eccentricity = (apogee - perigee)/(apogee + perigee + R_EARTH*2);

    return {
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

const getOrbitPosAt = delta => d => {
	const theta = d.thetaOffset + (delta/d.period)*Math.PI*2; //rotation in theta around the orbit, in elapsed time delta
	const lng = (d.lngOffset + delta/d.period*360) % 360;
	//const lng = (d.lngOffset + delta/d.period*360 - delta/P_EARTH*360) % 360;


	return Object.assign({},d,{
		theta,
		lngLat:[lng, thetaToDec(theta,d.inclination)], 
		r:thetaToR(theta,d.semiMajor,d.eccentricity)-R_EARTH //Distance above earth
	}); 
}

const getOrbit = N_SUB => d => {
	return Object.assign({},d,{
		orbit: Array.from({length:N_SUB+1},(v,i)=>{
			const theta = (i/N_SUB)*Math.PI*2;
			const lng = (d.lngOffset + theta/Math.PI*180 + 180)%360 - 180,
				lat = thetaToDec(theta, d.inclination);
			return {
				theta,
				r: thetaToR(theta+d.thetaOffset,d.semiMajor,d.eccentricity) - R_Earth,
				lngLat: [lng,lat]
			};
		})
	});
}

export {config,map,trace,getData,parse,getOrbitPosAt};