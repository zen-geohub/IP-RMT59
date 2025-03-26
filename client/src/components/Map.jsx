import {
  GeolocateControl,
  Layer,
  Map as Maplibre,
  Marker,
  NavigationControl,
  Popup,
  Source,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

const Map = ({ setCoordinate }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const { data } = useSelector((state) => state["geodataReducer"]);
  const geoControlRef = useRef(null);

  useEffect(() => {
    geoControlRef.current?.trigger();
  }, []);

  return (
    <Maplibre
      initialViewState={{
        latitude: -6.175444700801496,
        longitude: 106.82716801354516,
        zoom: 12,
      }}
      reuseMaps
      attributionControl={false}
      mapStyle={"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"}
    >
      <NavigationControl position="bottom-right" />
      <GeolocateControl
        ref={geoControlRef}
        position="bottom-right"
        positionOptions={{ enableHighAccuracy: true }}
        fitBoundsOptions={{ linear: true }}
        // trackUserLocation={true}
        onGeolocate={(e) =>
          setCoordinate({
            latitude: e.coords.latitude,
            longitude: e.coords.longitude,
          })
        }
      />
      {data &&
        data["features"].map(({ geometry, properties }) => (
          <Marker
            key={properties["id"]}
            latitude={geometry["coordinates"][1]}
            longitude={geometry["coordinates"][0]}
            onClick={() => setSelectedPlace({ properties, geometry })}
            className="cursor-pointer z-10"
          >
            <img
              src={`${properties["iconMaskBaseUri"]}.svg`}
              width={25}
              className="rounded-full p-1"
              style={{ backgroundColor: properties["iconBackgroundColor"] }}
              alt={properties["displayName"]}
            />
          </Marker>
        ))}

      {selectedPlace && (
        <Popup
          className="z-20"
          latitude={selectedPlace.geometry["coordinates"][1] || 0}
          longitude={selectedPlace.geometry["coordinates"][0] || 0}
          onClose={() => setSelectedPlace(null)}
          closeButton={true}
          closeOnClick={false}
          offset={10}
        >
          <div className="p-2">
            <h3 className="font-bold text-xl text-center">
              {selectedPlace.properties.displayName}
            </h3>
            <hr />
            <p>
              <strong>Type:</strong>{" "}
              {selectedPlace.properties.primaryTypeDisplayName || "N/A"}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {selectedPlace.properties.formattedAddress || "N/A"}
            </p>
            <p>
              <strong>Rating:</strong>{" "}
              &#127775;{selectedPlace.properties.rating || "N/A"}
            </p>
          </div>
          <button className="btn btn-secondary">Add to favorite</button>
        </Popup>
      )}
    </Maplibre>
  );
};

export default Map;
