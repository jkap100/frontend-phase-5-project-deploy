import React from "react";
import { motion } from "framer-motion";

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

function CartItems({ cartObj, cart, setCart }) {
  //   console.log(cartObj);

  //   console.log(cartObj.length);
  const orderToppings = cartObj.pizza_order_toppings.map(
    (t) => `${t.topping}, `
  );

  const price = cartObj.pizza_order_toppings.length * 1.5 + 10;
  //   console.log(price);

  const handleAddToCart = (p) => {
    console.log(p);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    };
    const body = {
      quantity: p.quantity + 1,
    };
    fetch(
      `https://backend-phase-5-project.herokuapp.com/pizza_orders/${p.id}`,
      {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(body),
      }
    ).then((r) => {
      if (r.ok) {
        console.log("added");
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
      } else {
        r.json().then((err) => console.log(err.errors));
      }
    });
  };

  const handleRemoveFromCart = (p) => {
    console.log(p);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    };
    const body = {
      quantity: p.quantity - 1,
    };

    if (p.quantity - 1 <= 0) {
      fetch(
        `https://backend-phase-5-project.herokuapp.com/pizza_orders/${p.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        }
      ).then((r) => {
        if (r.ok) {
          console.log("ok");
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
        } else {
          r.json().then((err) => console.log(err.errors));
        }
      });
    } else {
      fetch(
        `https://backend-phase-5-project.herokuapp.com/pizza_orders/${p.id}`,
        {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify(body),
        }
      ).then((r) => {
        if (r.ok) {
          console.log("added");
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
              console.log(cart);
            } else {
              r.json().then((error) => console.log(error.errors));
              // navigate("/login");
            }
          });
        } else {
          r.json().then((err) => console.log(err.errors));
        }
      });
    }
  };

  return (
    <>
      <tbody>
        <tr>
          <td className="has-text-white is-vcentered">{cartObj.crust}</td>
          <td className="has-text-white is-vcentered">{cartObj.sauce}</td>

          <td className="has-text-white is-vcentered">{orderToppings}</td>
          <td className="has-text-white is-vcentered">{cartObj.order_type}</td>
          <td className="has-text-white is-vcentered">${price}</td>
          <td className="has-text-white has-text-centered is-vcentered">
            {cartObj.quantity}
          </td>
          <td className="has-text-white is-vcentered">
            ${(price * cartObj.quantity).toLocaleString("en-US")}
          </td>
          <td className="has-text-centered is-vcentered">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              onClick={() => handleAddToCart(cartObj)}
            >
              +
            </motion.button>
          </td>
          <td className="has-text-centered is-vcentered">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              onClick={() => handleRemoveFromCart(cartObj)}
            >
              -
            </motion.button>
          </td>
        </tr>
      </tbody>
    </>
  );
}

export default CartItems;
