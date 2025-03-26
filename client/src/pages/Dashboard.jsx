import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import http from "../helpers/http";
import { fetchGeodata } from "../../stores/geodata.slice";
import Map from "../components/Map";
import { fetchFavoritesData } from "../../stores/user_favorite.slice";

const Dashboard = () => {
  const { data } = useSelector((state) => state["geodataReducer"]);
  const { list } = useSelector((state) => state["userFavoriteReducer"]);
  const dispatch = useDispatch();
  const [userCoordinate, setUserCoordinate] = useState({
    latitude: null,
    longitude: null,
  });

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

  useEffect(() => {
    console.log(data);
    console.log(list);
  }, [data]);

  return (
    <div className="relative w-full h-dvh">
      <div className="absolute top-2 left-2 w-48 h-96 bg-black rounded-lg z-50"></div>
      <Map setCoordinate={setUserCoordinate} refreshList={fetchUserFavorite} />
    </div>
  );
};

export default Dashboard;
