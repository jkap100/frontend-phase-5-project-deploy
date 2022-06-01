import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Geocode from "react-geocode";

const containerVariants = {
  hidden: {
    opacity: 0,
    x: "100vw",
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", delay: 0.5 },
  },
  exit: {
    x: "-100vh",
    transition: { ease: "easeInOut" },
  },
};

const nextVariants = {
  hidden: {
    x: "-100vw",
  },
  visible: {
    x: 0,
    transition: { type: "spring", stiffness: 120 },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.1,
    textShadow: "0px 0px 8px rgb(255,255,255)",
    boxShadow: "0px 0px 8px rgb(255,255,255)",
    transition: {
      duration: 0.3,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

function OrderType({
  store,
  setStore,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  street,
  setStreet,
  city,
  setCity,
  state,
  setState,
  zip,
  setZip,
  orderType,
  setOrderType,
  lat1,
  setLat1,
  lat2,
  setLat2,
  lng1,
  setLng1,
  lng2,
  setLng2,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    };

    fetch(`https://backend-phase-5-project.herokuapp.com/stores/${store.id}`, {
      method: "GET",
      headers: headers,
    }).then((r) => {
      if (r.ok) {
        r.json().then((r) => {
          setLat1(r.lat);
          setLng1(r.lng);
        });
      } else {
        r.json().then((error) => console.log(error.errors));
        // navigate("/login");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  Geocode.setApiKey(process.env.REACT_APP_MAP_API);

  Geocode.fromAddress("10435 SW 63rd Dr Portland OR 97219").then(
    (response) => {
      const { lat, lng } = response.results[0].geometry.location;
      //   console.log(lat, lng);
      setLat2(lat);
      setLng2(lng);
    },
    (error) => {
      console.error(error);
    }
  );

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

    // calculate the results
    return c * r;
  }

  // Driver code

  const distanceFromStore = d3(lat1, lat2, lng1, lng2);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (distanceFromStore <= 5) {
      setOrderType("Delivery");
      navigate("/crust");
    } else {
      alert("Must be within 5 miles for delivery");
    }
  };

  const takeOut = (e) => {
    e.preventDefault();
    setOrderType("Take Out");
    navigate("/crust");
  };

  return (
    <motion.div
      className="container"
      //   className="ml-6  mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="columns">
        <div className="column mr-6">
          {/* <p clasName="bd-notification is-info">First column</p> */}
          <h3 className="subtitle has-text-white">
            Order Take Out From: - {store.name} - {store.street}, {store.city}
          </h3>
          <div className="columns is-mobile">
            <div className="column">
              <form onSubmit={takeOut}>
                <div className="is-expanded">
                  <label className="label mr-3 ml-3 has-text-white">Name</label>
                  <div className="field is-grouped is-grouped-multiline mb-4 mr-3 ml-3">
                    <p className="control ">
                      <input
                        className="input"
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                      ></input>
                    </p>

                    <p className="control ">
                      <input
                        className="input"
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                      ></input>
                    </p>
                  </div>

                  <div className="field ml-3 mb-4">
                    <p className="control">
                      {/* <Link to="/crust"> */}
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                      >
                        Start Take Out
                      </motion.button>
                      {/* </Link> */}
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="column ml-6">
          <h3 className="subtitle has-text-white">
            Order Delivery From: - {store.name} - {store.street}, {store.city}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="is-expanded">
              <label className="label mr-3 ml-3 has-text-white">Name</label>
              <div className="field is-grouped is-grouped-multiline mb-4 mr-3 ml-3">
                <p className="control ">
                  <input
                    className="input"
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  ></input>
                </p>

                <p className="control ">
                  <input
                    className="input"
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  ></input>
                </p>
              </div>

              <div className="field mr-3 ml-3">
                <label className="label has-text-white">Address</label>
                <p className="control ">
                  <input
                    className="input"
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={street}
                    onChange={(event) => setStreet(event.target.value)}
                  ></input>
                </p>
              </div>

              <div className="field is-grouped mr-3 ml-3 is-grouped-multiline mb-4">
                <p className="control ">
                  <input
                    className="input"
                    type="text"
                    name="city"
                    placeholder="City"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                  ></input>
                </p>

                <p className="control ">
                  <input
                    className="input"
                    type="text"
                    name="state"
                    placeholder="State"
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                  ></input>
                </p>
                <p className="control">
                  <input
                    className="input"
                    type="text"
                    name="zip"
                    placeholder="Zip Code"
                    value={zip}
                    onChange={(event) => setZip(event.target.value)}
                  ></input>
                </p>
              </div>

              <div className="field ml-3 mb-4">
                <p className="control">
                  {/* <Link to="/crust"> */}
                  <motion.button variants={buttonVariants} whileHover="hover">
                    Start Delivery
                  </motion.button>
                  {/* </Link> */}
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default OrderType;
