import React, { useState } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import NavbarBottom from "./NavbarBottom";
import Header from "./Header";
import LoginHeader from "./LoginHeader";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import Crust from "../pages/order-pizza/Crust";
import Sauce from "../pages/order-pizza/Sauce";
import Meats from "../pages/order-pizza/Meats";
import Veggies from "../pages/order-pizza/Veggies";
import OrderType from "../pages/OrderType";
import Cart from "../pages/Cart";
// import Map from "../pages/Location";
import Map from "../pages/Map";
import Orders from "../pages/admin/Orders";
import Locations from "../pages/admin/Locations";
import Toppings from "../pages/admin/Toppings";

const pdx = {
  name: "OR",
  lat: 45.5008182,
  lng: -122.6683848,
};

function AnimatedRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAdmin, setIsAdmin] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  //STORES
  const [store, setStore] = useState("");

  //ADDRESS
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  //CRUST
  const [crusts, setCrusts] = useState([]);
  const [crustOrder, setCrustOrder] = useState([]);

  //SAUCE
  const [sauces, setSauces] = useState([]);
  const [sauceOrder, setSauceOrder] = useState([]);

  //MEATS
  const [meats, setMeats] = useState([]);
  const [meatsOrder, setMeatsOrder] = useState([]);

  //VEGGIES
  const [veggies, setVeggies] = useState([]);
  const [veggiesOrder, setVeggiesOrder] = useState([]);

  const [pizza, setPizza] = useState();
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState("");
  const [checkOutData, setCheckOutData] = useState([]);

  const [cardNumber, setCardNumber] = useState("");
  const [ccv, setCCV] = useState("");
  const [ccDate, setCCDate] = useState("");
  const [ccZip, setCCZip] = useState("");

  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);

  const [storeLocation, setStoreLocation] = useState("");
  const [status, setStatus] = useState("");

  const [orders, setOrders] = useState([]);

  const [lat1, setLat1] = useState("");
  const [lat2, setLat2] = useState("");
  const [lng1, setLng1] = useState("");
  const [lng2, setLng2] = useState("");

  const [storeName, setStoreName] = useState("");
  const [storeStreet, setStoreStreet] = useState("");
  const [storeCity, setStoreCity] = useState("");
  const [storeState, setStoreState] = useState("");
  const [storeZip, setStoreZip] = useState("");
  const [storeOpen, setStoreOpen] = useState("");
  const [storeClose, setStoreClose] = useState("");
  const [storePhone, setStorePhone] = useState("");

  const [mapLocation, setMapLocation] = useState(pdx);

  const [topping, setTopping] = useState("");
  const [toppingType, setToppingType] = useState("");

  // console.log(pizza);

  const addToCart = () => {
    console.log("jon");
    console.log(localStorage.getItem("currentUserId"));
    console.log(`store id ${store.id}`);
    console.log(`crust id ${crustOrder.id}`);
    console.log(`sauce id ${sauceOrder.id}`);
    console.log(`first name ${firstName}`);
    console.log(`last name ${lastName}`);
    console.log(`street ${street}`);
    console.log(`city ${city}`);
    console.log(`state ${state}`);
    console.log(`zip ${zip}`);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    };

    const body = {
      user_id: localStorage.getItem("currentUserId"),
      store_id: store.id,
      crust_id: crustOrder.id,
      sauce_id: sauceOrder.id,
      // due_date: "monday",
      // due_time: 10,
      status: "Cart",
      order_type: orderType,
      quantity: 1,
      first_name: firstName,
      last_name: lastName,
      street: street,
      city: city,
      state: state,
      zip: zip,
    };
    // console.log(body);

    fetch(`https://backend-phase-5-project.herokuapp.com/pizza_orders`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          console.log(result.error);
          navigate("login");
        } else {
          setPizza(result);
          let orderId = result.id;
          console.log(result);

          for (let i = 0; i < veggiesOrder.length; i++) {
            const vToppings = {
              topping_id: veggiesOrder[i].id,
              pizza_order_id: orderId,
            };
            fetch(
              `https://backend-phase-5-project.herokuapp.com/pizza_order_toppings`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.token}`,
                },
                body: JSON.stringify(vToppings),
              }
            )
              .then((response) => response.json())
              .then((result) => {
                if (result.error) {
                  console.log(result.error);
                } else {
                }
              });
          }

          for (let i = 0; i < meatsOrder.length; i++) {
            const mToppings = {
              topping_id: meatsOrder[i].id,
              pizza_order_id: orderId,
            };
            fetch(
              `https://backend-phase-5-project.herokuapp.com/pizza_order_toppings`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.token}`,
                },
                body: JSON.stringify(mToppings),
              }
            )
              .then((response) => response.json())
              .then((result) => {
                if (result.error) {
                  console.log(result.error);
                } else {
                }
              });
          }
        }
      });

    alert("Added to Cart");
  };

  return (
    <>
      <Navbar
        setStore={setStore}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setStreet={setStreet}
        setCity={setCity}
        setState={setState}
        setZip={setZip}
        setCrustOrder={setCrustOrder}
        setSauceOrder={setSauceOrder}
        setMeatsOrder={setMeatsOrder}
        setVeggiesOrder={setVeggiesOrder}
        setIsVisible={setIsVisible}
        setCheckOutData={setCheckOutData}
        setCardNumber={setCardNumber}
        setCCV={setCCV}
        setCCDate={setCCDate}
        setCCZip={setCCZip}
        setDueDate={setDueDate}
        setDueTime={setDueTime}
        setLocations={setLocations}
        setStatus={setStatus}
        setOrderType={setOrderType}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />
      {window.location.pathname === "/" ||
      window.location.pathname === "/signup" ? null : (
        <Header />
      )}
      {window.location.pathname === "/" ||
      window.location.pathname === "/signup" ? (
        <LoginHeader />
      ) : null}
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <Login
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <Signup
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                email={email}
                setEmail={setEmail}
              />
            }
          />
          <Route path="/home" element={<Home />} />
          <Route
            path="/crust"
            element={
              <Crust
                crusts={crusts}
                setCrusts={setCrusts}
                crustOrder={crustOrder}
                setCrustOrder={setCrustOrder}
                sauces={sauces}
                setSauces={setSauces}
                sauceOrder={sauceOrder}
                setSauceOrder={setSauceOrder}
                meats={meats}
                setMeats={setMeats}
                meatsOrder={meatsOrder}
                setMeatsOrder={setMeatsOrder}
                veggies={veggies}
                setVeggies={setVeggies}
                veggiesOrder={veggiesOrder}
                setVeggiesOrder={setVeggiesOrder}
              />
            }
          />
          <Route
            path="/sauce"
            element={
              <Sauce
                crusts={crusts}
                setCrusts={setCrusts}
                crustOrder={crustOrder}
                setCrustOrder={setCrustOrder}
                sauces={sauces}
                setSauces={setSauces}
                sauceOrder={sauceOrder}
                setSauceOrder={setSauceOrder}
                meats={meats}
                setMeats={setMeats}
                meatsOrder={meatsOrder}
                setMeatsOrder={setMeatsOrder}
                veggies={veggies}
                setVeggies={setVeggies}
                veggiesOrder={veggiesOrder}
                setVeggiesOrder={setVeggiesOrder}
              />
            }
          />
          <Route
            path="/meats"
            element={
              <Meats
                crusts={crusts}
                setCrusts={setCrusts}
                crustOrder={crustOrder}
                setCrustOrder={setCrustOrder}
                sauces={sauces}
                setSauces={setSauces}
                sauceOrder={sauceOrder}
                setSauceOrder={setSauceOrder}
                meats={meats}
                setMeats={setMeats}
                meatsOrder={meatsOrder}
                setMeatsOrder={setMeatsOrder}
                veggies={veggies}
                setVeggies={setVeggies}
                veggiesOrder={veggiesOrder}
                setVeggiesOrder={setVeggiesOrder}
              />
            }
          />
          <Route
            path="/veggies"
            element={
              <Veggies
                crusts={crusts}
                setCrusts={setCrusts}
                crustOrder={crustOrder}
                setCrustOrder={setCrustOrder}
                sauces={sauces}
                setSauces={setSauces}
                sauceOrder={sauceOrder}
                setSauceOrder={setSauceOrder}
                meats={meats}
                setMeats={setMeats}
                meatsOrder={meatsOrder}
                setMeatsOrder={setMeatsOrder}
                veggies={veggies}
                setVeggies={setVeggies}
                veggiesOrder={veggiesOrder}
                setVeggiesOrder={setVeggiesOrder}
                addToCart={addToCart}
                pizza={pizza}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                setCart={setCart}
                checkOutData={checkOutData}
                setCheckOutData={setCheckOutData}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                dueDate={dueDate}
                setDueDate={setDueDate}
                dueTime={dueTime}
                setDueTime={setDueTime}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                ccv={ccv}
                setCCV={setCCV}
                ccDate={ccDate}
                setCCDate={setCCDate}
                ccZip={ccZip}
                setCCZip={setCCZip}
              />
            }
          />
          <Route
            path="/map"
            element={
              <Map
                store={store}
                setStore={setStore}
                locations={locations}
                setLocations={setLocations}
                selected={selected}
                setSelected={setSelected}
                mapLocation={mapLocation}
                setMapLocation={setMapLocation}
              />
            }
          />
          <Route
            path="/order_type"
            element={
              <OrderType
                store={store}
                setStore={setStore}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                street={street}
                setStreet={setStreet}
                city={city}
                setCity={setCity}
                state={state}
                setState={setState}
                zip={zip}
                setZip={setZip}
                orderType={orderType}
                setOrderType={setOrderType}
                lat1={lat1}
                setLat1={setLat1}
                lat2={lat2}
                setLat2={setLat2}
                lng1={lng1}
                setLng1={setLng1}
                lng2={lng2}
                setLng2={setLng2}
              />
            }
          />
          <Route
            path="/orders"
            element={
              <Orders
                locations={locations}
                setLocations={setLocations}
                storeLocation={storeLocation}
                setStoreLocation={setStoreLocation}
                status={status}
                setStatus={setStatus}
                orderType={orderType}
                setOrderType={setOrderType}
                orders={orders}
                setOrders={setOrders}
                storeState={storeState}
                setStoreState={setStoreState}
              />
            }
          />
          <Route
            path="/locations"
            element={
              <Locations
                store={store}
                setStore={setStore}
                locations={locations}
                setLocations={setLocations}
                selected={selected}
                setSelected={setSelected}
                storeName={storeName}
                setStoreName={setStoreName}
                storeStreet={storeStreet}
                setStoreStreet={setStoreStreet}
                storeCity={storeCity}
                setStoreCity={setStoreCity}
                storeState={storeState}
                setStoreState={setStoreState}
                storeZip={storeZip}
                setStoreZip={setStoreZip}
                storeOpen={storeOpen}
                setStoreOpen={setStoreOpen}
                storeClose={storeClose}
                setStoreClose={setStoreClose}
                storePhone={storePhone}
                setStorePhone={setStorePhone}
                mapLocation={mapLocation}
                setMapLocation={setMapLocation}
              />
            }
          />
          <Route
            path="/toppings"
            element={
              <Toppings
                crusts={crusts}
                setCrusts={setCrusts}
                sauces={sauces}
                setSauces={setSauces}
                meats={meats}
                setMeats={setMeats}
                veggies={veggies}
                setVeggies={setVeggies}
                topping={topping}
                setTopping={setTopping}
                toppingType={toppingType}
                setToppingType={setToppingType}
              />
            }
          />
        </Routes>
      </AnimatePresence>
      <NavbarBottom store={store} />
    </>
  );
}

export default AnimatedRoutes;
