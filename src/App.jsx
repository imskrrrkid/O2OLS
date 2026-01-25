import "./App.css";
import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer } from "react-leaflet";
function App() {
  return (
    <>
      <div class="Header">
        <ul>
          <li>
            <a>File</a>
          </li>
          <li>
            <a>Edit</a>
          </li>
          <li>
            <a>More</a>
          </li>
          <li>
            <a>Account</a>
          </li>
        </ul>
      </div>
      <div class="container">
        <div class="cont-dock"></div>
        <div class="cont-mapxdetails">
          <div class="mapcont">
            <div className="map">
              <MapContainer
                className="mapCont"
                center={[30.3753, 69.3451]}
                zoom={3}
              >
                <TileLayer
                  attribution='"&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors"'
                  url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                />
              </MapContainer>
            </div>
          </div>
          <div class="details">asdsad33</div>
        </div>
      </div>
    </>
  );
}

export default App;
