/* global google */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
// import usePlacesAutocomplete, {
//   getGeocode,
//   getLatLng,
// } from "use-places-autocomplete";
// import {
//   Combobox,
//   ComboboxInput,
//   ComboboxPopover,
//   ComboboxList,
//   ComboboxOption,
// } from "@reach/combobox";
import { formatRelative } from "date-fns";
import "@reach/combobox/styles.css";
import MapStyles from "../components/MapStyles";
import { motion } from "framer-motion";

const mapVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { delay: 1.5, duration: 1.5 },
  },
  exit: {
    x: "-100vh",
    transition: { ease: "easeInOut" },
  },
};

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

const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "30vw",
};

const center = {
  lat: 45.5008182,
  lng: -122.6683848,
};

const options = {
  //   styles: MapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

export default function Map({ store, setStore }) {
  const [locations, setLocations] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/stores").then((r) => {
      if (r.ok) {
        r.json().then(setLocations);
      } else {
        r.json().then((error) => console.log(error.errors));
        // navigate("/login");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAP_API,
    libraries,
  });

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  const onMapClick = React.useCallback((e) => {
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const selectStore = (store) => {
    setStore(store);
  };

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <motion.div
      className="ml-6  mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="columns">
        <div
          className="column is-two-thirds
        "
        >
          {/* <Search /> */}
          <motion.div
            variants={mapVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={11}
              center={center}
              options={options}
              onLoad={onMapLoad}
              // onClick={(e) => {
              //   setMarkers((current) => [
              //     ...current,
              //     {
              //       lat: e.latLng.lat(),
              //       lng: e.latLng.lng(),
              //       time: new Date(),
              //     },
              //   ]);
              // }}
              onClick={onMapClick}
            >
              {/* {markers.map((marker) => (
                <Marker
                  key={marker.time.toISOString()}
                  position={{ lat: marker.lat, lng: marker.lng }}
                /> */}
              {/* ))} */}
              {locations.map((location) => (
                <Marker
                  key={location.id}
                  position={{ lat: location.lat, lng: location.lng }}
                  icon={{
                    url: `../pizza.svg`,
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(17, 17),
                    scaledSize: new window.google.maps.Size(35, 35),
                  }}
                  onClick={() => {
                    setSelected(location);
                  }}
                />
              ))}
              {selected ? (
                <InfoWindow
                  position={{ lat: selected.lat, lng: selected.lng }}
                  onCloseClick={() => {
                    setSelected(null);
                  }}
                >
                  <div className="has-text-center">
                    <h1 className="has-text-black">
                      <strong>{selected.name}</strong>
                    </h1>
                    <h4 className="has-text-black">
                      <strong>{selected.street}</strong>
                    </h4>

                    <p className="has-text-black">{selected.city}</p>
                    <p className="has-text-black">{selected.state}</p>
                    <p className="has-text-black">{selected.phone}</p>
                  </div>
                </InfoWindow>
              ) : null}
            </GoogleMap>
          </motion.div>
        </div>
        <div className="column">
          <h3 id="container" className="mr-6 has-text-white">
            Select Location
          </h3>
          <div className="ml-6">
            <ul>
              {locations.map((location) => {
                return (
                  <motion.li
                    key={location.id}
                    id="mapLi"
                    onClick={() => selectStore(location)}
                    whileHover={{
                      scale: 1.3,
                      originX: 0,
                      color: "#f8e112",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="active">{location.name}</span>
                  </motion.li>
                );
              })}
            </ul>
          </div>
          <h3 id="container" className="mr-6 has-text-white mt-4">
            Your Location: {store.name}
          </h3>
          {store.name && (
            <motion.div className="next" variants={nextVariants}>
              <Link to="/order_type">
                <div className="mt-4 ml-6">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    // onClick={startOrder}
                  >
                    Next
                  </motion.button>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
