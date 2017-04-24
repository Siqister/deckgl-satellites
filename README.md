# deckgl-satellites
To launch the project, either run `npm start` to launch a webpack dev server on port 9000 (after running `npm install` to install dependencies), or access static content located in `./dist`.

## Dataset
The visualization is based on a [dataset](http://www.ucsusa.org/nuclear-weapons/space-weapons/satellite-database#.WP5rxPnytGE) of the over 1,400 satellites currently orbiting the earth, compiled by the Union of Concerned Scientists. The dataset includes the name, purpose, country of operator, and several orbital parameters (apogee, perigee, inclination, period) that allow the modelling the orbit. Crucially, because several other important orbital parameters are missing (longitude of the ascending node, argument of periapsis etc.), it is impossible to totally accurately model the motion of the satellites, or to precisely "track" where they are. The resulting visualization is therefore an approximation that shows the orbit and general motion characterisitcs of the satellites.

## Design Overview
Because this is a crash course in Deck.gl and React, I decided to start with the well-established examples of visualising in a space defined by Mercator projection. The elliptical orbits of satellites will be "unfurled" as lines that are sinusoidal both in the xy plane and along the z-axis. The "peaks" correspond to the apogee -- the point at which satellites are farthest from the earth; relatively straight lines correspond to circular-shaped, equatorial orbits, used by geostationery satellites.

An important aspect of this visualization is to let the audience observe the motion of different satellite types at different orbital altitudes (LEO for "low-earth", MEO, and GEO). To facilitate this, I created a "focus+context" type structure that lets the user brush and select different orbit types on the left side of the screen, and see changes in 3D space. This structure is also meant to demonstrate how I understood React to handle data flow, state changes, and events, and how `<svg>` and `<canvas>` based viz components can work with React.

## Technical Notes
###

## Challenges and To-do
