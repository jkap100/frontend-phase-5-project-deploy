import React, { useEffect } from "react";
import CartItems from "../components/CartItems";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { delay: 1, duration: 1 },
  },
  exit: {
    x: "-100vh",
    transition: { ease: "easeInOut" },
  },
};

function Cart({
  cart,
  setCart,
  isVisible,
  setIsVisible,
  checkOutData,
  setCheckOutData,
  dueDate,
  setDueDate,
  dueTime,
  setDueTime,
  cardNumber,
  setCardNumber,
  ccv,
  setCCV,
  ccDate,
  setCCDate,
  ccZip,
  setCCZip,
}) {
  const navigate = useNavigate();
  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    };

    fetch(
      `https://backend-phase-5-project.herokuapp.com/carts?user_id=${localStorage.getItem(
        "currentUserId"
      )}`,
      {
        method: "GET",
        headers: headers,
      }
    ).then((r) => {
      if (r.ok) {
        r.json().then(setCart);
      } else {
        r.json().then((error) => console.log(error.errors));
        // navigate("/login");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(cart.length);
  const cartItems = cart.map((c) => (
    <CartItems key={c.id} cartObj={c} cart={cart} setCart={setCart} />
  ));

  cart.map((c) => setCheckOutData(c));
  // console.log(checkOutData);

  let totalPrice = 0;
  const pizzaPrice = cart.map((c) => {
    totalPrice = totalPrice + c.price;
  });

  const checkOut = () => {
    console.log("check out");
    setIsVisible(!isVisible);
  };

  const submitOrder = (e) => {
    e.preventDefault();
    console.log(dueDate, dueTime);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    };

    const body = {
      due_date: dueDate,
      due_time: dueTime,
      status: "Order Placed",
      card_number: cardNumber,
      ccv: ccv,
      card_expiration: ccDate,
      card_zip: ccZip,
    };

    fetch(
      `https://backend-phase-5-project.herokuapp.com/carts/?user_id=${localStorage.getItem(
        "currentUserId"
      )}`,
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
          console.log(r.length);
          // console.log(r.length);
          for (let i = 0; i < r.length; i++) {
            fetch(
              `https://backend-phase-5-project.herokuapp.com/pizza_orders/${r[i].id}`,
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
                  // console.log(r);
                  fetch(
                    `https://backend-phase-5-project.herokuapp.com/carts/?user_id=${localStorage.getItem(
                      "currentUserId"
                    )}`,
                    {
                      method: "GET",
                      headers: headers,
                    }
                  ).then((r) => {
                    r.json().then((r) => {
                      if (r.error) {
                        console.log(r.error);
                      } else {
                        setCart(r);
                        navigate("/cart");
                      }
                    });
                  });
                }
              });
          }
        }
      });
    setIsVisible(false);
    alert("Order Received");
  };

  return (
    <motion.div
      className="container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="column">
        <div className="">
          <table id="table-background" className="table is-fullwidth">
            <thead>
              <tr className="has-text-white">
                <th className="cart-image has-text-white">Crust</th>
                <th className="product has-text-white">Sauce</th>
                <th className="category has-text-white">Toppings</th>
                <th className="price has-text-white">Order Type</th>
                <th className="price has-text-white">Price</th>
                <th className="qty has-text-centered has-text-white">
                  Quantity
                </th>
                <th className="Total has-text-white">Total</th>
                <th className="has-text-centered has-text-white">Add</th>
                <th className="has-text-centered has-text-white">Remove</th>
              </tr>
            </thead>
            {cartItems}
            <tfoot>
              <tr>
                <td className="has-text-white is-vcentered"></td>
                <td className="has-text-white is-vcentered"></td>
                <td className="has-text-white is-vcentered"></td>
                <td className="has-text-white is-vcentered">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    onClick={checkOut}
                  >
                    Check Out
                  </motion.button>
                </td>

                <td className="has-text-white is-vcentered"></td>
                <td className="has-text-white has-text-centered is-vcentered">
                  Total
                </td>
                <td className="has-text-white is-vcentered">
                  ${totalPrice.toLocaleString("en-US")}
                </td>
                <td className="has-text-centered is-vcentered">
                  {/* <button onClick={() => handleAddToCart(cartObj)}>+</button> */}
                </td>
                <td className="has-text-centered is-vcentered">
                  {/* <button onClick={() => handeleRemoveFromCart(cartObj)}>-</button> */}
                </td>
              </tr>
            </tfoot>
          </table>
          {isVisible && (
            <div className="columns is-mobile">
              <div className="column">
                <ul className="ml-6">
                  <li id="checkout" className="checkout">
                    {checkOutData.order_type} from {checkOutData.store_name}
                  </li>

                  <li>
                    {checkOutData.first_name} {checkOutData.last_name}
                  </li>
                  <li>{checkOutData.street}</li>
                  <li>
                    {checkOutData.city} {checkOutData.state} {checkOutData.zip}
                  </li>
                </ul>
              </div>
              <div className="column">
                <form onSubmit={submitOrder}>
                  <div className="is-expanded">
                    <label className="label has-text-white ml-3">
                      When do you want it?
                    </label>
                    <div className="field is-grouped mr-3 ml-3 is-grouped-multiline mb-4">
                      <p className="control ">
                        <input
                          className="input"
                          type="date"
                          name="orderDate"
                          placeholder=""
                          value={dueDate}
                          onChange={(event) => setDueDate(event.target.value)}
                        ></input>
                      </p>

                      <p className="control ">
                        <select
                          className="input"
                          type="text"
                          name="orderTime"
                          placeholder=""
                          value={dueTime}
                          onChange={(event) => setDueTime(event.target.value)}
                        >
                          <option>Select Time</option>
                          <option>11:30 AM</option>
                          <option>12:00 PM</option>
                          <option>12:30 PM</option>
                          <option>1:00 PM</option>
                          <option>12:30 PM</option>
                          <option>1:00 PM</option>
                          <option>1:30 PM</option>
                          <option>2:30 PM</option>
                          <option>3:00 PM</option>
                          <option>3:30 PM</option>
                          <option>4:00 PM</option>
                          <option>4:30 PM</option>
                          <option>5:00 PM</option>
                          <option>5:30 PM</option>
                          <option>5:00 PM</option>
                          <option>5:30 PM</option>
                          <option>6:00 PM</option>
                          <option>6:30 PM</option>
                          <option>7:00 PM</option>
                          <option>7:30 PM</option>
                          <option>8:00 PM</option>
                          <option>8:30 PM</option>
                          <option>9:00 PM</option>
                          <option>9:30 PM</option>
                          <option>10:00 PM</option>
                          <option>10:30 PM</option>
                        </select>
                      </p>
                    </div>

                    <div className="field mr-3 ml-3">
                      <label className="label has-text-white">
                        Payment Information
                      </label>
                      <p className="control ">
                        <input
                          className="input"
                          type="text"
                          name="creditCard"
                          placeholder="Card Number"
                          value={cardNumber}
                          onChange={(event) =>
                            setCardNumber(event.target.value)
                          }
                        ></input>
                      </p>
                    </div>

                    <div className="field is-grouped is-grouped-multiline ml-3 mr-3 mb-4">
                      <p className="control ">
                        <input
                          className="input"
                          type="text"
                          name="ccv"
                          placeholder="CCV"
                          value={ccv}
                          onChange={(event) => setCCV(event.target.value)}
                        ></input>
                      </p>

                      <p className="control ">
                        <input
                          className="input"
                          type="date"
                          name="expiration"
                          placeholder="Expiration"
                          value={ccDate}
                          onChange={(event) => setCCDate(event.target.value)}
                        ></input>
                      </p>
                      <p className="control ">
                        <input
                          className="input"
                          type="text"
                          name="ccZip"
                          placeholder="Zip Code"
                          value={ccZip}
                          onChange={(event) => setCCZip(event.target.value)}
                        ></input>
                      </p>
                    </div>
                    <div className="field ml-3 mb-4">
                      <p className="control">
                        <motion.button
                          className=""
                          variants={buttonVariants}
                          whileHover="hover"
                        >
                          Submit Order
                        </motion.button>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Cart;
