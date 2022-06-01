import React from "react";
import { Link } from "react-router-dom";
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

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { delay: 1.3, duration: 1.3 },
  },
  exit: {
    x: "-100vh",
    transition: { ease: "easeInOut" },
  },
};

const startOrder = () => {
  console.log("order");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.token}`,
  };

  const body = {
    user_id: "",
    address_id: "",
  };

  fetch("http://localhost:3000/pizza_orders", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  }).then((r) => {
    if (r.ok) {
      alert("Added to cart");
    } else {
      r.json().then((err) => console.log(err.errors));
    }
  });
};

function Home() {
  return (
    <motion.div
      className="home container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h2>Welcome and Enjoy</h2>
      <p>All Pizza's are $10 + $1.50 per topping</p>
      <Link to="/map">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          onClick={startOrder}
        >
          Create Your Pizza
        </motion.button>
      </Link>
    </motion.div>
  );
}

export default Home;
