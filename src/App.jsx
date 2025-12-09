import "./App.css";
import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer } from "react-leaflet";
function App() {
  return (
    <>
      <div className="title">
        <h1>
          One Two One Location Share
          {<br />} <a href="https://github.com/imskrrrkid/O2OLS">GitHub</a> for
          more Details
        </h1>
      </div>
      <div className="map">
        <MapContainer className="mapCont" center={[30.3753, 69.3451]} zoom={3}>
          <TileLayer
            attribution='"&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors"'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          />
        </MapContainer>
      </div>
    </>
  );
}

export default App;
