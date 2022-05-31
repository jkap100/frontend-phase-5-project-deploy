import React, { useEffect } from "react";
import { Link } from "react-router-dom";
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

const Toppings = ({
  crusts,
  setCrusts,
  sauces,
  setSauces,
  veggies,
  setVeggies,
  meats,
  setMeats,
  topping,
  setTopping,
  toppingType,
  setToppingType,
}) => {
  useEffect(() => {
    fetch("https://backend-phase-5-project.herokuapp.com/crusts").then((r) => {
      if (r.ok) {
        r.json().then(setCrusts);
      } else {
        r.json().then((error) => console.log(error.errors));
        // navigate("/login");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch("https://backend-phase-5-project.herokuapp.com/sauces").then((r) => {
      if (r.ok) {
        r.json().then(setSauces);
      } else {
        r.json().then((error) => console.log(error.errors));
        // navigate("/login");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch("https://backend-phase-5-project.herokuapp.com/meats").then((r) => {
      if (r.ok) {
        r.json().then(setMeats);
      } else {
        r.json().then((error) => console.log(error.errors));
        // navigate("/login");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch("https://backend-phase-5-project.herokuapp.com/veggies").then((r) => {
      if (r.ok) {
        r.json().then(setVeggies);
      } else {
        r.json().then((error) => console.log(error.errors));
        // navigate("/login");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orderTopping = (e) => {
    e.preventDefault();

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    };

    const body = {
      name: topping,
    };

    if (toppingType === "Crust") {
      fetch(`https://backend-phase-5-project.herokuapp.com/crusts`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      })
        .then((r) => r.json())
        .then((r) => {
          if (r.error) {
            console.log(r.error);
          } else {
            setToppingType("");
            setTopping("");
            fetch("https://backend-phase-5-project.herokuapp.com/crusts").then(
              (r) => {
                if (r.ok) {
                  r.json().then(setCrusts);
                } else {
                  r.json().then((error) => console.log(error.errors));
                  // navigate("/login");
                }
              }
            );
          }
        });
    } else if (toppingType === "Sauce") {
      fetch(`https://backend-phase-5-project.herokuapp.com/sauces`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      })
        .then((r) => r.json())
        .then((r) => {
          if (r.error) {
            console.log(r.error);
          } else {
            setToppingType("");
            setTopping("");
            fetch("https://backend-phase-5-project.herokuapp.com/sauces").then(
              (r) => {
                if (r.ok) {
                  r.json().then(setSauces);
                } else {
                  r.json().then((error) => console.log(error.errors));
                  // navigate("/login");
                }
              }
            );
          }
        });
    } else if (toppingType === "Meat" || toppingType === "Veggies") {
      fetch(`https://backend-phase-5-project.herokuapp.com/toppings`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          name: topping,
          category: toppingType,
        }),
      })
        .then((r) => r.json())
        .then((r) => {
          if (r.error) {
            console.log(r.error);
          } else {
            setToppingType("");
            setTopping("");
            fetch("https://backend-phase-5-project.herokuapp.com/meats").then(
              (r) => {
                if (r.ok) {
                  r.json().then(setMeats);
                } else {
                  r.json().then((error) => console.log(error.errors));
                  // navigate("/login");
                }
              }
            );
            fetch("https://backend-phase-5-project.herokuapp.com/veggies").then(
              (r) => {
                if (r.ok) {
                  r.json().then(setVeggies);
                } else {
                  r.json().then((error) => console.log(error.errors));
                  // navigate("/login");
                }
              }
            );
          }
        });
    }
  };

  const deleteCrust = (c) => {
    console.log(c);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    };

    fetch(`https://backend-phase-5-project.herokuapp.com/crusts/${c.id}`, {
      method: "DELETE",
      headers: headers,
    }).then((r) => {
      if (r.ok) {
        console.log("deleted");

        fetch("https://backend-phase-5-project.herokuapp.com/crusts").then(
          (r) => {
            if (r.ok) {
              r.json().then(setCrusts);
            } else {
              r.json().then((error) => console.log(error.errors));
              // navigate("/login");
            }
          }
        );
      } else {
        r.json().then((error) => console.log(error.errors));
      }
    });
  };

  const deleteSauce = (s) => {
    console.log(s);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    };

    fetch(`https://backend-phase-5-project.herokuapp.com/sauces/${s.id}`, {
      method: "DELETE",
      headers: headers,
    }).then((r) => {
      if (r.ok) {
        console.log("deleted");

        fetch("https://backend-phase-5-project.herokuapp.com/sauces").then(
          (r) => {
            if (r.ok) {
              r.json().then(setSauces);
            } else {
              r.json().then((error) => console.log(error.errors));
              // navigate("/login");
            }
          }
        );
      } else {
        r.json().then((error) => console.log(error.errors));
      }
    });
  };

  const deleteTopping = (t) => {
    console.log(t);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    };

    fetch(`https://backend-phase-5-project.herokuapp.com/toppings/${t.id}`, {
      method: "DELETE",
      headers: headers,
    }).then((r) => {
      if (r.ok) {
        console.log("deleted");

        fetch("https://backend-phase-5-project.herokuapp.com/meats").then(
          (r) => {
            if (r.ok) {
              r.json().then(setMeats);
            } else {
              r.json().then((error) => console.log(error.errors));
              // navigate("/login");
            }
          }
        );

        fetch("https://backend-phase-5-project.herokuapp.com/veggies").then(
          (r) => {
            if (r.ok) {
              r.json().then(setVeggies);
            } else {
              r.json().then((error) => console.log(error.errors));
              // navigate("/login");
            }
          }
        );
      } else {
        r.json().then((error) => console.log(error.errors));
      }
    });
  };

  return (
    <div className="container">
      <div className="columns">
        <motion.div
          className="column"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <h3 className="bd-notification is-info">
            Toppings (click to delete)
          </h3>
          <div className="columns is-mobile">
            <div className="column">
              <h3 className="bd-notification is-info">Crust</h3>
              <ul>
                {crusts.map((crust) => (
                  <motion.li
                    onClick={() => deleteCrust(crust)}
                    whileHover={{
                      scale: 1.3,
                      originX: 0,
                      color: "#f8e112",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {crust.name}
                    {/* <button onClick={(c) => deleteCrust(c)}></button> */}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="column">
              <h3 className="bd-notification is-info">Sauce</h3>
              <ul>
                {sauces.map((sauce) => (
                  <motion.li
                    onClick={() => deleteSauce(sauce)}
                    whileHover={{
                      scale: 1.3,
                      originX: 0,
                      color: "#f8e112",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {sauce.name}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="column">
              <h3 className="bd-notification is-info">Meats</h3>
              <ul>
                {meats.map((meat) => (
                  <motion.li
                    onClick={() => deleteTopping(meat)}
                    whileHover={{
                      scale: 1.3,
                      originX: 0,
                      color: "#f8e112",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {meat.name}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="column">
              <h3 className="bd-notification is-info">Veggies</h3>
              <ul>
                {veggies.map((veggie) => (
                  <motion.li
                    onClick={() => deleteTopping(veggie)}
                    whileHover={{
                      scale: 1.3,
                      originX: 0,
                      color: "#f8e112",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {veggie.name}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="column is-one-third"
          variants={mapVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <h3 className="bd-notification is-danger">Add a Topping</h3>
          <form onSubmit={orderTopping}>
            <div className="field">
              <label className="label has-text-white"></label>
              <p className="control has-icons-left has-icons-right">
                <input
                  className="input"
                  type="text"
                  name="topping"
                  placeholder="Topping"
                  value={topping}
                  onChange={(event) => setTopping(event.target.value)}
                ></input>
              </p>
            </div>
            <div className="field">
              <label className="label has-text-white"></label>
              <p className="control has-icons-left has-icons-right">
                <select
                  className="input"
                  type="text"
                  name=""
                  value={toppingType}
                  onChange={(event) => setToppingType(event.target.value)}
                >
                  <option>Select Type</option>
                  <option>Crust</option>
                  <option>Sauce</option>
                  <option>Meat</option>
                  <option>Veggies</option>
                </select>
              </p>
            </div>

            <div className="field">
              <p className="control">
                <motion.button variants={buttonVariants} whileHover="hover">
                  Order
                </motion.button>
              </p>
            </div>
          </form>
          <div className="columns is-mobile">
            {/* <div className="column is-one-third">
              <p className="bd-notification is-danger">50%</p>
            </div>
            <div className="column">
              <p className="bd-notification is-danger">Auto</p>
            </div>
            <div className="column">
              <p className="bd-notification is-danger">Auto</p>
            </div> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Toppings;
