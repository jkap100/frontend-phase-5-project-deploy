import React, { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import NavbarBottom from "./NavbarBottom";
import Header from "./Header";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import Crust from "../pages/order-pizza/Crust";
import Sauce from "../pages/order-pizza/Sauce";
import Meats from "../pages/order-pizza/Meats";
import Veggies from "../pages/order-pizza/Veggies";
import PizzaOrder from "./PizzaOrder";
import OrderType from "../pages/OrderType";
import Cart from "../pages/Cart";
// import Map from "../pages/Location";
import Map from "../pages/Map";

function AnimatedRoutes() {
  const location = useLocation();
  const [error, setErrors] = useState("");

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
      due_date: "monday",
      due_time: 10,
      status: "Cart",
      quantity: 5,
      first_name: firstName,
      last_name: lastName,
      street: street,
      city: city,
      state: state,
      zip: zip,
    };
    console.log(body);

    fetch(`http://localhost:3000/pizza_orders`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          console.error(result.error);
        } else {
          setPizza(result);
          let orderId = result.id;

          for (let i = 0; i < meatsOrder.length; i++) {
            const mToppings = {
              topping_id: meatsOrder[i].id,
              pizza_order_id: orderId,
            };
            fetch(`http://localhost:3000/pizza_order_toppings`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.token}`,
              },
              body: JSON.stringify(mToppings),
            })
              .then((response) => response.json())
              .then((result) => {
                if (result.error) {
                  console.error(result.error);
                } else {
                }
              });
          }
        }
      });
  };

  return (
    <>
      <Navbar />
      <Header />
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
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/map"
            element={<Map store={store} setStore={setStore} />}
          />
          <Route
            path="/order_type"
            element={
              <OrderType
                store={store}
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
              />
            }
          />
        </Routes>
      </AnimatePresence>
      <NavbarBottom />
    </>
  );
}

export default AnimatedRoutes;
