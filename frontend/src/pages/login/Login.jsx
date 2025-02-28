import { useState } from "react";

const Login = () => {
  const accessToken = localStorage.getItem('accessToken');

  const handleLogin = (e) => {
    e.preventDefault()
    window.location.href = 'http://localhost:4000/auth/google';
  };
  return (
    <div className="login-with-google">
      {!accessToken ? (
        <button type="submit" className="google-login-btn" onClick={e=>handleLogin(e)}>
          <img src="./public/google_icon.png" alt="Google Icon" className="google-icon" />
          Login with Google
        </button>
      ) : (
        <p>Logged in successfully!</p>
      )}
    </div>
  )
}
export default Login;