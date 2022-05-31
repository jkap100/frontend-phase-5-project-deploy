import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import { formatRelative } from "date-fns";
import "@reach/combobox/styles.css";
// import MapStyles from "../components/MapStyles";
import { motion } from "framer-motion";
import Geocode from "react-geocode";

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

const pdx = {
  name: "OR",
  lat: 45.5008182,
  lng: -122.6683848,
};

const sea = {
  name: "WA",
  lat: 47.6205785,
  lng: -122.3504881,
};

const norCal = {
  name: "CA",
  lat: 37.766824,
  lng: -122.287706,
};

const den = {
  name: "CO",
  lat: 39.7539156,
  lng: -105.0011007,
};

const options = {
  //   styles: MapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

export default function Locations({
  store,
  setStore,
  locations,
  setLocations,
  selected,
  setSelected,
  storeName,
  setStoreName,
  storeStreet,
  setStoreStreet,
  storeCity,
  setStoreCity,
  storeState,
  setStoreState,
  storeZip,
  setStoreZip,
  storeOpen,
  setStoreOpen,
  storeClose,
  setStoreClose,
  storePhone,
  setStorePhone,
  mapLocation,
  setMapLocation,
}) {
  Geocode.setApiKey(process.env.REACT_APP_MAP_API);
  // const [locations, setLocations] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  if (!selected) {
    console.log("no marker");
  } else {
    Geocode.fromLatLng(selected.lat, selected.lng).then(
      (response) => {
        // const address = response.results[0].formatted_address;
        const a = response.results[0].formatted_address.split(",");
        const a2 = a[2];
        setStoreStreet(a[0]);
        setStoreCity(a[1]);
        setStoreState(a2.split(" ")[1]);
        setStoreZip(a2.split(" ")[2]);
        setLat(selected.lat);
        setLng(selected.lng);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  useEffect(() => {
    fetch("https://backend-phase-5-project.herokuapp.com/stores").then((r) => {
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
    mapRef.current.setZoom(16);
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
    mapRef.current = e;
  }, []);

  const onRemoveMarkers = () => {
    setMarkers([]);
    setStoreName("");
    setStoreStreet("");
    setStoreCity("");
    setStoreState("");
    setStoreZip("");
    setStoreOpen("");
    setStoreClose("");
    setStorePhone("");
  };

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const selectStore = (store) => {
    setStore(store);
  };

  const createStore = (e) => {
    e.preventDefault();
    console.log(storeName);
    console.log(storeStreet);
    console.log(storeCity);
    console.log(storeZip);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    };

    const body = {
      name: storeName,
      street: storeStreet,
      city: storeCity.trim(),
      state: storeState,
      open: storeOpen,
      close: storeClose,
      phone: storePhone,
      lat: lat,
      lng: lng,
    };

    fetch(`https://backend-phase-5-project.herokuapp.com/stores`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.error) {
          console.log(r.error);
        } else {
          console.log("store created");
          setStoreName("");
          setStoreStreet("");
          setStoreCity("");
          setStoreState("");
          setStoreZip("");
          setStoreOpen("");
          setStoreClose("");
          setStorePhone("");
        }
      });
  };

  if (mapLocation == "OR") {
    setMapLocation(pdx);
  } else if (mapLocation === "WA") {
    setMapLocation(sea);
  } else if (mapLocation === "CA") {
    setMapLocation(norCal);
  } else if (mapLocation === "CO") {
    setMapLocation(den);
  }

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
            <Search panTo={panTo} />

            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={11}
              center={{ lat: mapLocation.lat, lng: mapLocation.lng }}
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
              <div className="field is-grouped ml-1 mt-1">
                <p className="control">
                  <select
                    className="input"
                    type="text"
                    name="location"
                    value={mapLocation}
                    onChange={(e) => setMapLocation(e.target.value)}
                  >
                    <option>Select City</option>
                    <option>{pdx.name}</option>
                    <option>{sea.name}</option>
                    <option>{norCal.name}</option>
                    <option>{den.name}</option>
                  </select>
                </p>
              </div>
              <button className="button ml-1 mt-1" onClick={onRemoveMarkers}>
                Clear Markers
              </button>
              {markers.map((marker) => (
                <Marker
                  key={marker.time.toISOString()}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  icon={{
                    url: `../pizza.svg`,
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(17, 17),
                    scaledSize: new window.google.maps.Size(35, 35),
                  }}
                  onClick={() => {
                    setSelected(marker);
                  }}
                />
              ))}
              {!locations
                ? null
                : locations.map((location) => (
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
                      <strong>{storeStreet}</strong>
                    </h1>

                    <p className="has-text-black">
                      {storeCity} {storeState} {storeZip}
                    </p>
                  </div>
                </InfoWindow>
              ) : null}
            </GoogleMap>
          </motion.div>
        </div>
        <div className="column">
          <h3 className="subtitle  has-text-white">Add a New Location</h3>
          <form onSubmit={createStore}>
            <div className="is-expanded">
              <label className="label mr-3 ml-3 has-text-white">
                Store Name
              </label>
              <div className="field is-grouped is-grouped-multiline mb-4 mr-3 ml-3">
                <p className="control ">
                  <input
                    className="input"
                    type="text"
                    name="storeName"
                    placeholder="Store Name"
                    value={storeName}
                    onChange={(event) => setStoreName(event.target.value)}
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
                    value={storeStreet}
                    onChange={(event) => setStoreStreet(event.target.value)}
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
                    value={storeCity}
                    onChange={(event) => setStoreCity(event.target.value)}
                  ></input>
                </p>

                <p className="control ">
                  <input
                    className="input"
                    type="text"
                    name="state"
                    placeholder="State"
                    value={storeState}
                    onChange={(event) => setStoreState(event.target.value)}
                  ></input>
                </p>
                <p className="control">
                  <input
                    className="input"
                    type="text"
                    name="zip"
                    placeholder="Zip Code"
                    value={storeZip}
                    onChange={(event) => setStoreZip(event.target.value)}
                  ></input>
                </p>
              </div>

              <label className="label has-text-white ml-4">Store Info</label>
              <div className="field is-grouped mr-3 ml-3 is-grouped-multiline mb-4">
                <p className="control ">
                  <input
                    className="input"
                    type="text"
                    name="open"
                    placeholder="Open"
                    value={storeOpen}
                    onChange={(event) => setStoreOpen(event.target.value)}
                  ></input>
                </p>

                <p className="control ">
                  <input
                    className="input"
                    type="text"
                    name="close"
                    placeholder="Close"
                    value={storeClose}
                    onChange={(event) => setStoreClose(event.target.value)}
                  ></input>
                </p>
                <p className="control">
                  <input
                    className="input"
                    type="text"
                    name="storePhone"
                    placeholder="Phone"
                    value={storePhone}
                    onChange={(event) => setStorePhone(event.target.value)}
                  ></input>
                </p>
              </div>

              <div className="field ml-3 mb-4">
                <p className="control">
                  {/* <Link to="/crust"> */}
                  <motion.button variants={buttonVariants} whileHover="hover">
                    Create Store
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

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 45.5008182, lng: () => -122.6683848 },
      radius: 200 * 1000,
    },
  });

  return (
    <div className="search">
      <Combobox
        onSelect={async (address) => {
          setValue(address, false);
          clearSuggestions();

          try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            // console.log(lat, lng);
            panTo({ lat, lng });
          } catch (error) {
            console.log("error");
          }
          //   console.log(address);
        }}
      >
        <ComboboxInput
          className="input"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          disabled={!ready}
          placeholder="Search For Location"
        />
        <ComboboxPopover className="has-text-black">
          {status === "OK" &&
            data.map(({ id, description }) => (
              <ComboboxOption key={id} value={description} />
            ))}
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
