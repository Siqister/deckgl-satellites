# deckgl-satellites
To launch the project, either run `npm start` to launch a webpack dev server (after running `npm install` to install dependencies), or access static content located in `./dist`.

## Dataset
The visualization is based on a [dataset](http://www.ucsusa.org/nuclear-weapons/space-weapons/satellite-database#.WP5rxPnytGE) of the over 1,400 satellites currently orbiting the earth, compiled by the Union of Concerned Scientists. The dataset includes the name, purpose, country of operator, and several orbital parameters (apogee, perigee, inclination, period) that allow the modelling the orbit. Crucially, because several other important orbital parameters are missing (longitude of the ascending node, argument of periapsis etc.), it is impossible to totally accurately model the motion of the satellites, or to precisely "track" where they are. The resulting visualization is therefore an approximation that shows the orbit and general motion characterisitcs of the satellites.

