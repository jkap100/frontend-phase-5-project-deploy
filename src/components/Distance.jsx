import React, { useState } from "react";
import Geocode from "react-geocode";
import { getDistance } from "geolib";

function Distance() {
  const [lat1, setLat1] = useState("");
  const [lat2, setLat2] = useState(50);
  const [lng1, setLng1] = useState("");
  const [lng2, setLng2] = useState(-120);

  Geocode.setApiKey(AIzaSyCLg4PLkCysuXyi4XFB_3 - hWIFrhk9eId0);

  Geocode.fromAddress("10435 SW 63rd Dr Portland OR 97219").then(
    (response) => {
      const { lat, lng } = response.results[0].geometry.location;
      //   console.log(lat, lng);
      setLat1(lat);
      setLng1(lng);
    },
    (error) => {
      console.error(error);
    }
  );

  console.log(lat1, lng1);

  function d3(lat1, lat2, lng1, lng2) {
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lng1 = (lng1 * Math.PI) / 180;
    lng2 = (lng2 * Math.PI) / 180;
    lat1 = (lat1 * Math.PI) / 180;
    lat2 = (lat2 * Math.PI) / 180;

    // Haversine formula
    let dlon = lng2 - lng1;
    let dlat = lat2 - lat1;
    let a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 3956;

    // calculate the result
    return c * r;
  }

  // Driver code

  console.log(d3(lat1, lat2, lng1, lng2) + "Miles");

  return <div>Distance</div>;
}

export default Distance;
