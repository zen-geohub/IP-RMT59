import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import http from "../helpers/http";
import {
  fetchCategory,
  fetchGeodata,
  fetchRecommendation,
} from "../../stores/geodata.slice";
import Map from "../components/Map";
import { fetchFavoritesData } from "../../stores/user_favorite.slice";
import defaultPhoto from "../assets/defaultPhoto.png";
import { NavLink, useNavigate } from "react-router";
import { useMap } from "react-map-gl/maplibre";

const Dashboard = () => {
  const { recommendation, category } = useSelector(
    (state) => state["geodataReducer"]
  );
  const [filter, setFilter] = useState("");
  const dispatch = useDispatch();
  const [userCoordinate, setUserCoordinate] = useState({
    latitude: null,
    longitude: null,
  });
  const { dashboardMap } = useMap();
  const user = JSON.parse(localStorage.getItem("data"));
  const navigate = useNavigate();

  async function fetchData() {
    try {
      const { data } = await http({
        method: "GET",
        url: "/places",
        params: {
          latitude: userCoordinate.latitude || -6.175444700801496,
          longitude: userCoordinate.longitude || 106.82716801354516,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      dispatch(fetchGeodata(data["geojson"]));
      dispatch(fetchRecommendation(data["response"]));
      dispatch(
        fetchCategory([
          ...new Set(
            data["geojson"]["features"].map(
              (place) => place["properties"]["primaryTypeDisplayName"]
            )
          ),
        ])
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchUserFavorite() {
    try {
      const { data } = await http({
        method: "GET",
        url: "/favorites",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      dispatch(fetchFavoritesData(data));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
    fetchUserFavorite();
  }, [userCoordinate]);

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
                <NavLink to={"/favorites"}>My Favorite Places</NavLink>
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

        <div>
          <label>Filter Data:</label>
          <select className="select" onChange={(e) => setFilter(e.target.value)} defaultValue={""}>
            <option value="" >-- SELECT --</option>
            {category &&
              category.map((category, i) => (
                <option key={i} value={category}>
                  {category}
                </option>
              ))}
          </select>
        </div>

        <div className="h-full w-full overflow-y-scroll">
          <h1 className="font-semibold">Gemini Recommendation:</h1>
          {recommendation &&
            recommendation.map((place, i) => (
              <div
                key={place["properties"]["placeId"]}
                className="flex gap-2 w-full p-2"
              >
                <div className="flex flex-col justify-between w-full">
                  <p className="text-xs">
                    {i + 1}. {place["properties"]["displayName"]} (
                    {place["properties"]["primaryTypeDisplayName"]})
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      dashboardMap.flyTo({
                        center: {
                          lat: place["geometry"]["coordinates"][1],
                          lng: place["geometry"]["coordinates"][0],
                        },
                        zoom: 17,
                      })
                    }
                  >
                    See places
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Map category={filter} setCoordinate={setUserCoordinate} refreshList={fetchUserFavorite} />
    </div>
  );
};

export default Dashboard;
