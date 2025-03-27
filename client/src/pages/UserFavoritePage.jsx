import {
  GeolocateControl,
  Map as Maplibre,
  Marker,
  NavigationControl,
  Popup,
  useMap,
} from "react-map-gl/maplibre";
import { useEffect, useState } from "react";
import defaultPhoto from "../assets/defaultPhoto.png";
import { NavLink, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import http from "../helpers/http";
import { fetchFavoritesData } from "../../stores/user_favorite.slice";

const UserFavoritePage = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const user = JSON.parse(localStorage.getItem("data"));
  const { list } = useSelector((state) => state["userFavoriteReducer"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { favoriteMap } = useMap();

  const [notes, setNotes] = useState("");

  async function fetchUserFavorite() {
    try {
      const { data } = await http({
        method: "GET",
        url: `/favorites`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      dispatch(fetchFavoritesData(data));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();

    try {
      const favorite = selectedPlace
        ? list.find(
            ({ Place }) =>
              Place["properties"]["placeId"] ===
              selectedPlace.properties.placeId
          )
        : null;

      if (!favorite) {
        throw new Error("Favorite place not found");
      }

      await http({
        method: "PATCH",
        url: `/favorites/${favorite["id"]}`,
        data: { notes },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      document.getElementById("my_modal_3").close();
      fetchUserFavorite();
      setNotes("");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(e) {
    e.preventDefault();

    try {
      const favorite = selectedPlace
        ? list.find(
            ({ Place }) =>
              Place["properties"]["placeId"] ===
              selectedPlace.properties.placeId
          )
        : null;

      if (!favorite) {
        throw new Error("Favorite place not found");
      }

      await http({
        method: "DELETE",
        url: `/favorites/${favorite["id"]}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      fetchUserFavorite();
      setSelectedPlace(null);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchUserFavorite();
  }, []);

  return (
    <div className="relative w-full h-dvh">
      <div className="absolute p-4 top-2 left-2 w-64 h-[32rem] bg-white shadow-xl rounded-lg z-50 flex flex-col items-center gap-2">
        <div className="flex gap-2">
          <div className="dropdown">
            <img
              tabIndex={0}
              role="button"
              src={user?.profilePicture || defaultPhoto}
              alt="profilePicture"
              className="rounded-full w-20 cursor-pointer object-cover"
            />
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box z-1 mt-4 w-52 p-2 shadow-sm"
            >
              <li>
                <NavLink to={"/"}>Home</NavLink>
              </li>
              <li>
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                  className="hover:bg-secondary"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>

          <div className="flex flex-col w-full">
            <p className="text-lg">Hello,</p>
            <p className="font-semibold">
              {user["firstName"]} {user["lastName"]}
            </p>
          </div>
        </div>

        <div className="h-full w-full overflow-y-scroll flex flex-col gap-2">
          <h1>User Favorite Places:</h1>
          {list &&
            list.map(({ Place }, index) => (
              <div key={Place["properties"]["placeId"]}>
                <p>
                  {index + 1}. {Place["properties"]["displayName"]}
                </p>
                <button
                  className="btn btn-primary w-full"
                  onClick={() =>
                    favoriteMap.flyTo({
                      center: {
                        lat: Place["geometry"]["coordinates"][1],
                        lng: Place["geometry"]["coordinates"][0],
                      },
                      zoom: 17,
                    })
                  }
                >
                  See places
                </button>
              </div>
            ))}
        </div>
      </div>

      <Maplibre
        id="favoriteMap"
        initialViewState={{
          latitude: -6.175444700801496,
          longitude: 106.82716801354516,
          zoom: 12,
        }}
        reuseMaps
        attributionControl={false}
        mapStyle={
          "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        }
      >
        <NavigationControl position="bottom-right" />
        {list &&
          list.map(({ Place: { geometry, properties } }) => (
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
              <p>
                <strong>Notes:</strong>{" "}
                {(list &&
                  list.find(
                    ({ Place }) =>
                      Place["properties"]["placeId"] ===
                      selectedPlace.properties.placeId
                  )?.notes) ||
                  "No notes available"}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="btn btn-accent"
                onClick={() =>
                  document.getElementById("my_modal_3").showModal()
                }
              >
                Add Notes
              </button>
              <button
                className="btn btn-error"
                onClick={(e) => handleDelete(e)}
              >
                Remove
              </button>
            </div>
          </Popup>
        )}
      </Maplibre>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">
            Write your notes about this place:
          </h3>
          <form
            onSubmit={(e) => handleUpdate(e)}
            className="flex flex-col gap-2"
          >
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              name="notes"
              id="notes"
              cols="30"
              rows="5"
              className="w-full p-2 textarea"
            ></textarea>
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default UserFavoritePage;
