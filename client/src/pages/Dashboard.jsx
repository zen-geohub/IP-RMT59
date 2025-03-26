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
      });

      dispatch(fetchGeodata(data));
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
    <div className="w-full h-dvh">
      <Map setCoordinate={setUserCoordinate} />
    </div>
  );
};

export default Dashboard;
