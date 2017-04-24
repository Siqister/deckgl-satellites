# deckgl-satellites
To launch the project, either run `npm start` to launch a webpack dev server on port 9000 (after running `npm install` to install dependencies), or access static content located in `./dist`.

## Dataset
The visualization is based on a [dataset](http://www.ucsusa.org/nuclear-weapons/space-weapons/satellite-database#.WP5rxPnytGE) of the over 1,400 satellites currently orbiting the earth, compiled by the Union of Concerned Scientists. The dataset includes the name, purpose, country of operator, and several orbital parameters (apogee, perigee, inclination, period) that allow the modelling the orbit. Crucially, because several other important orbital parameters are missing (longitude of the ascending node, argument of periapsis etc.), it is impossible to totally accurately model the motion of the satellites, or to precisely "track" where they are. The resulting visualization is therefore an approximation that shows the orbit and general motion characterisitcs of the satellites.

## Design Overview
Because this is a crash course in Deck.gl and React, I decided to start with the well-established examples of visualising in a space defined by Mercator projection. The elliptical orbits of satellites will be "unfurled" as lines that are sinusoidal both in the xy plane and along the z-axis. The "peaks" correspond to the apogee -- the point at which satellites are farthest from the earth; relatively straight lines correspond to circular-shaped, equatorial orbits, used by geostationery satellites.

An important aspect of this visualization is to let the audience observe the motion of different satellite types at different orbital altitudes (LEO for "low-earth", MEO, and GEO). To facilitate this, I created a "focus+context" type structure that lets the user brush and select different orbit types on the left side of the screen, and see changes in 3D space. This structure is also meant to demonstrate how I understood React to handle data flow, state changes, and events, and how `<svg>` and `<canvas>` based viz components can work with React.

## Technical Notes
### In `utils/utils.js`
This module contains a number of utility functions for loading and parsing data, as well as orbit math-related functions that map satellite orbit parameters to orbital positions `[lng, lat, r]`;

### In `app.js`
The root component has two main responsibilities: requesting data on `componentDidMount`, and updating orbital positions within a `requestAnimationFrame` loop. On each animation frame, `state.data` is reset, triggering the re-render or re-draw of child components.

Because the data feed contains only static orbital parameters for each satellite (as opposed to a stream of orbital positions), `<App>` needs to manually re-compute orbital positions based on elapsed time. 

`<App>` component has 3 child components: `<Tooltip>`, `<DeckGLOverlay>`, and `<Legend>` (which subsequently has `<LegendCanvas>` and `<LegendBrush>` as its child components).

### In `components/deckgl-overlay.js`
Fairly plain vanilla implementation of deck.gl layers here: two `SatelliteLayer` instances (extending from `ScatterplotLayer`), modelling the satellites, and one `LineLayer` instance modelling the orbits of highlighted satellites. The satellite layers have `onHover` interactivity.

### In `layers/satellite-layer.js`
A basic extension of the `ScatterplotLayer`, with modified fragmentShader to show a blurry, halo-like edge.

## Challenges and To-do
### WebGL!
I wanted to write a custom layer that would be able to more economically render a 100-point orbit for each satellite. I think I need to really understand how vertex shaders work before I can get further with it.

### Orbital math
Surprisingly (or perhaps not), modelling orbital motion and projecting them onto a flat map was more of a challenge than I thought. In the end I took some liberties with the math, seeing that astrophysics is not the main point of the exercise. Most notably, I assumed that the satellites would have the same angular velocity around the earth as it orbited, a big distortion for especially elliptical-shaped orbits.

### Instancing
Each satellite is rendered as a dot, a lost opportunity to express its attributes with instanced geometries. With a little more confidence with vertex and fragment shaders, I'd like to attempt this.

### General design / usability
This is a pretty basic demo that can obviously benefit from some usability improvements. For example, the `onHover` tooltip interactivity is very jittery at the moment with the satellites moving so fast; a different approach to offer on-demand detail is required.

Thanks! This was a fun challenge!
