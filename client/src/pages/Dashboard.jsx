import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import http from "../helpers/http";
import { fetchGeodata } from "../../stores/geodata.slice";
import Map from "../components/Map";

const Dashboard = () => {
  const { data } = useSelector((state) => state["geodataReducer"]);
  const dispatch = useDispatch();
  const [userCoordinate, setUserCoordinate] = useState({
    latitude: null,
    longitude: null
  })

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
        }
      });

      console.log(data)
      dispatch(fetchGeodata(data['geojson']));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [userCoordinate]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="relative w-full h-dvh">
      <div className="absolute top-2 left-2 w-48 h-96 bg-black rounded-lg z-50">

      </div>
      <Map setCoordinate={setUserCoordinate} />
    </div>
  );
};

export default Dashboard;
