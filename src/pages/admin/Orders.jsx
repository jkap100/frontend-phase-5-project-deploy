import React, { useEffect } from "react";
import { motion } from "framer-motion";
import OrderItems from "../../components/OrderItems";

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

function Orders({
  locations,
  setLocations,
  storeLocation,
  setStoreLocation,
  status,
  setStatus,
  orderType,
  setOrderType,
  orders,
  setOrders,
  storeState,
  setStoreState,
}) {
  useEffect(() => {
    fetch(
      `https://backend-phase-5-project.herokuapp.com/stores_by_state?state=${storeState}`
    ).then((r) => {
      if (r.ok) {
        r.json().then(setLocations);
      } else {
        r.json().then((error) => console.log(error.errors));
        // navigate("/login");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeState]);

  const handleSelect = (e) => {
    e.preventDefault();
    // console.log("select");
    const storeLocationId = storeLocation.split(" ");
    console.log(storeLocationId[0]);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    };

    fetch(
      `https://backend-phase-5-project.herokuapp.com/orders?store_id=${storeLocationId}&order_type=${orderType}&status=${status}`,
      {
        method: "GET",
        headers: headers,
      }
    )
      .then((r) => r.json())
      .then((r) => {
        if (r.error) {
          console.log(r.error);
        } else {
          //   console.log(r);
          setOrders(r);
        }
      });
  };

  const handleFillOrder = (order) => {
    if (order.status === "Cart") {
      alert("Still in cart");
    } else {
      const storeLocationId = storeLocation.split("");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      };

      const body = {
        status: "Filled",
      };

      fetch(
        `https://backend-phase-5-project.herokuapp.com/pizza_orders/${order.id}`,
        {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify(body),
        }
      )
        .then((r) => r.json())
        .then((r) => {
          if (r.error) {
            console.log(r.error);
          } else {
            console.log(r);

            fetch(
              `https://backend-phase-5-project.herokuapp.com/orders?store_id=${storeLocationId}&order_type=${orderType}&status=${status}`,
              {
                method: "GET",
                headers: headers,
              }
            )
              .then((r) => r.json())
              .then((r) => {
                if (r.error) {
                  console.log(r.error);
                } else {
                  //   console.log(r);
                  setOrders(r);
                }
              });
          }
        });
    }
  };

  const orderList = orders.map((o) => (
    <OrderItems key={o.id} orderObj={o} handleFillOrder={handleFillOrder} />
  ));

  const handleStoreState = (e) => {
    console.log("state");
    setStoreState(e.target.value);
  };

  return (
    <div className="container">
      <div className="columns mb-6">
        <div className="column">
          {/* <p className="bd-notification is-info">First column</p> */}
          <form onSubmit={handleSelect}>
            <div className="field is-grouped">
              <label className="is-vcentered mr-2">Region</label>
              <p className="control">
                <select
                  className="input"
                  type="text"
                  name="location"
                  value={storeState}
                  onChange={handleStoreState}
                >
                  <option>-</option>
                  <option>OR</option>
                  <option>WA</option>
                  <option>CA</option>
                  <option>CO</option>
                  {/* {locations
                    ? locations.map((l) => (
                        <option key={l.id}>
                          {l.id} {l.state}
                        </option>
                      ))
                    : null} */}
                </select>
              </p>
              <label className="is-vcentered mr-2">Location</label>
              <p className="control">
                <select
                  className="input"
                  type="text"
                  name="location"
                  value={storeLocation}
                  onChange={(e) => setStoreLocation(e.target.value)}
                >
                  <option>-</option>
                  {locations
                    ? locations.map((l) => (
                        <option key={l.id}>
                          {l.id} {l.name}
                        </option>
                      ))
                    : null}
                </select>
              </p>
              <label className="is-vcentered ml-4 mr-2">Status</label>
              <p className="control">
                <select
                  className="input"
                  type="text"
                  name="location"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>-</option>
                  <option>Cart</option>
                  <option>Order Placed</option>
                  <option>Filled</option>
                </select>
              </p>
              <label className="is-vcentered ml-4 mr-2">Order Type</label>
              <p className="control">
                <select
                  className="input"
                  type="text"
                  name="location"
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <option>-</option>
                  <option>Take Out</option>
                  <option>Delivery</option>
                </select>
              </p>
              <p>
                <motion.button
                  className="ml-4"
                  variants={buttonVariants}
                  whileHover="hover"
                  //   onClick={handleSelect}
                >
                  Select
                </motion.button>
              </p>
              <hr></hr>
            </div>
          </form>
          <div className="columns is-mobile">
            <div className="column mb-4">
              <div className="bd-notification is-info mb-4">
                <table id="table-background" className="table is-fullwidth">
                  <thead className="mb-6">
                    <tr className="has-text-white mb-6">
                      <th className="price has-text-white">Due Date</th>
                      <th className="price has-text-white">Due Time</th>
                      <th className="cart-image has-text-white">Name</th>
                      <th className="product has-text-white">Status</th>
                      <th className="category has-text-white">Order Type</th>
                      <th className="Total has-text-white">Crust</th>
                      <th className="has-text-centered has-text-white">
                        Sauce
                      </th>
                      <th className="price has-text-white">Toppings</th>
                      <th className="qty has-text-centered has-text-white">
                        Quantity
                      </th>

                      <th className="has-text-centered has-text-white">
                        Total
                      </th>
                      <th className="has-text-centered has-text-white">
                        Fill Order
                      </th>
                    </tr>
                  </thead>
                  {/* {cartItems} */}
                  {orderList}

                  <tfoot>
                    <tr>
                      <td className="has-text-white is-vcentered"></td>
                      <td className="has-text-white is-vcentered"></td>
                      <td className="has-text-white is-vcentered"></td>
                      <td className="has-text-white is-vcentered"></td>
                      <td className="has-text-white is-vcentered"></td>
                      <td className="has-text-white is-vcentered">
                        {/* <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          // onClick={checkOut}
                        >
                          Check Out
                        </motion.button> */}
                      </td>

                      <td className="has-text-white is-vcentered"></td>
                      <td className="has-text-white has-text-centered is-vcentered"></td>
                      <td className="has-text-white is-vcentered">
                        {/* ${totalPrice.toLocaleString("en-US")} */}
                      </td>
                      <td className="has-text-centered is-vcentered"></td>
                      <td className="has-text-centered is-vcentered"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            {/* <div class="column">
              <p class="bd-notification is-info">Second nested column</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
