import "bulma/css/bulma.min.css";
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// "proxy": "https://backend-phase-5-project.herokuapp.com/",

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

function Login({
  username,
  setUsername,
  password,
  setPassword,
  isAdmin,
  setIsAdmin,
}) {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    const user = {
      username: username,
      password: password,
    };

    fetch("https://backend-phase-5-project.herokuapp.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          navigate("/");
          console.error(result.error);
        } else {
          console.log("token", result.token);

          navigate("/home");
          localStorage.setItem("token", result.token);

          if (result.message === "Invalid username or password") {
            console.log(result.message);
            alert("invalid username or password");
            navigate("/");
          } else {
            localStorage.setItem("currentUserId", result.user.id);
            localStorage.setItem("isAdmin", result.user.admin);
            localStorage.setItem("currentUsername", result.user.username);
            localStorage.setItem("currentEmail", result.user.email);

            console.log(localStorage);
            setIsAdmin(localStorage.getItem("isAdmin"));
          }
        }
      });
    setUsername("");
    setPassword("");
  };

  return (
    <motion.div
      className="container my-6"
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: window.innerWidth, transition: { duration: 0.3 } }}
    >
      <div className="columns is-centered">
        <form onSubmit={handleLogin}>
          <div className="field">
            <label className="label has-text-white">Username</label>
            <p className="control has-icons-left has-icons-right">
              <input
                className="input"
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              ></input>
              <span className="icon is-small is-left">
                <i className="fas fa-user"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check"></i>
              </span>
            </p>
          </div>
          <div className="field">
            <label className="label has-text-white">Password</label>
            <p className="control has-icons-left has-icons-right">
              <input
                className="input"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              ></input>
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check"></i>
              </span>
            </p>
          </div>

          <div className="field">
            <p className="control">
              <motion.button variants={buttonVariants} whileHover="hover">
                Login
              </motion.button>
              <Link to="/signup">
                <motion.button
                  className="ml-3"
                  variants={buttonVariants}
                  whileHover="hover"
                >
                  Sign Up
                </motion.button>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default Login;
