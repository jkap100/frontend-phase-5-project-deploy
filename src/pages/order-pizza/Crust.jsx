import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PizzaOrder from "../../components/PizzaOrder";

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

function Crust({
  crusts,
  setCrusts,
  addCrust,
  pizza,
  spanClass,
  setSpanClass,
  crustOrder,
  setCrustOrder,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/crusts").then((r) => {
      if (r.ok) {
        r.json().then(setCrusts);
      } else {
        r.json().then((error) => console.log(error.errors));
        // navigate("/login");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //   console.log(pizza.crust);

  const onAddCrust = (crust) => {
    setSpanClass("active");
    setCrustOrder(crust);
  };

  const startOrder = () => {};

  return (
    <div className="container">
      <div className="columns">
        <div className="column mr-6">
          <div className="columns is-mobile">
            <div className="column">
              <div className="">
                <div className="">
                  <motion.div
                    className="base container"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <h3 className="subtitle has-text-white">
                      Step 1: Select Your Crust
                    </h3>
                    <div className="ml-6">
                      <ul>
                        {crusts.map((crust) => {
                          let spanClass = pizza.crust === crust ? "active" : "";
                          //   console.log(crust);
                          return (
                            <motion.li
                              key={crust.id}
                              onClick={() => onAddCrust(crust)}
                              whileHover={{
                                scale: 1.3,
                                originX: 0,
                                color: "#f8e112",
                              }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <span className={spanClass}>{crust.name}</span>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </div>

                    {crustOrder.name && (
                      <motion.div className="next" variants={nextVariants}>
                        <Link to="/toppings">
                          <div className="mt-4 ml-6">
                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              onClick={startOrder}
                            >
                              Next
                            </motion.button>
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="column ml-6">
          <motion.div
            className="base container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3 className="subtitle has-text-white">Your Pizza</h3>
            <div className="ml-6">
              <PizzaOrder crustOrder={crustOrder} pizza={pizza} />
            </div>
          </motion.div>
          {/* <motion.div className="next" variants={nextVariants}>
            <Link to="/toppings">
              <div className="mt-4">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  onClick=""
                >
                  Start Over
                </motion.button>
              </div>
            </Link>
          </motion.div> */}
        </div>
      </div>
    </div>
  );
}

export default Crust;
