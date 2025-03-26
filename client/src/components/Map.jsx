import {
  GeolocateControl,
  Map as Maplibre,
  Marker,
  NavigationControl,
  Popup,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import http from "../helpers/http";

const Map = ({ setCoordinate, refreshList }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const { data } = useSelector((state) => state["geodataReducer"]);
  const { list } = useSelector((state) => state["userFavoriteReducer"]);
  const geoControlRef = useRef(null);

  useEffect(() => {
    geoControlRef.current?.trigger();
  }, []);

  async function handleFavorite() {
    try {
      await http({
        method: "POST",
        url: "/favorites",
        data: selectedPlace,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      refreshList();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Maplibre
      id="dashboardMap"
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
            key={properties["placeId"]}
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
              <strong>Rating:</strong> &#127775;
              {selectedPlace.properties.rating || "N/A"}
            </p>
          </div>
          <button
            className={
              Array.isArray(list) &&
              selectedPlace?.properties?.placeId &&
              list.some(
                ({ Place: { properties } }) =>
                  properties["placeId"] === selectedPlace.properties.placeId
              )
                ? "btn btn-disabled"
                : "btn btn-secondary"
            }
            onClick={handleFavorite}
          >
            Add to favorite
          </button>
        </Popup>
      )}
    </Maplibre>
  );
};

export default Map;
