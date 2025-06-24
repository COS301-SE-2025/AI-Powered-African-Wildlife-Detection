import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import './AuthScreen.css';
import Logo from '../assets/EpiUseLogo.png';

const AuthScreen = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    navigate('/main');  // remove this when login works

    const userData = JSON.parse(localStorage.getItem(data.email));
    if (userData) {
      if (userData.password === data.password) {
        console.log(userData.name + " You Are Successfully Logged In");
        navigate('/main');
      } else {
        console.log("Email or Password is not matching with our record");
      }
    } else {
      console.log("Email or Password is not matching with our record");
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-background">

        {/* <img
            src={Logo}
            alt="Epi-Use Logo"
            className="auth-logo"
        /> */}

        <div className="auth-form">
            <h1 color="white">BushBuddy</h1>
            
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <input
                type="email"
                {...register("email", { required: true })}
                placeholder="Email"
            />
            {/* {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>} */}

            <input
                type="password"
                {...register("password", { required: true })}
                placeholder="Password"
            />
            {/* {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>} */}

            <input type="submit" value="Login" className="auth-button"/>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
