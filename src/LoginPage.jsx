import React, { useState } from "react";
import "./components/styling/LoginPage.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
} from "firebase/auth";
import { auth } from "./firebase/firebaseAuth";
import { useNavigate } from "react-router-dom";
// import "./LoginPage.css";
import { addUserToFirestore } from "./firebase/firebaseStore";

import Footer from "./components/Footer";

const LoginForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const navigate = useNavigate();

  function handleEmailChange(event) {
    setEmail(event.target.value);
    setError(null);
  }
  function handlePasswordChange(event) {
    setPassword(event.target.value);
    setError(null);
  }
  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInAnonymously(auth);
      navigate("/home", {
        state: { typeOfUser: "guest", message: "Welcome Guest!" },
      });
    } catch (error) {
      setError("Guest login failed, Please try again");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegistering) {
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredentials.user;
        await addUserToFirestore(user);
        setIsRegistering(false);
        setEmail("");
        setPassword("");
        navigate("/home");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setEmail("");
        setPassword("");
        navigate("/home");
      }
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setError("Please enter a valid email address");
          break;
        case "auth/wrong-password":
        case "auth/user-not-found":
        case "auth/invalid-credential":
          setError("Incorrect password or email, Please try again");
          break;
        case "auth/email-already-in-use":
          setError("This email is already registered");
          break;
        case "auth/weak-password":
          setError("Password must be atleast 6 characters");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your internet connection");
          break;
        default:
          setError("Something went wrong. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="login-page">
      <h1>
        <span class="logo-text1">interi</span>
        <span class="logo-text2">yours</span>
      </h1>

      {loading && <p>Loading, please wait ...</p>}
      {error && <p>{error}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">
          Email
          <input
            type="text"
            placeholder="Email"
            required
            value={email}
            onChange={handleEmailChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            minLength={6}
            onChange={handlePasswordChange}
          />
        </label>
        <button
          type="submit"
          onClick={() => setIsRegistering(false)}
          disabled={loading}
        >
          Login
        </button>
        <button type="submit" onClick={() => setIsRegistering(true)}>
          Register
        </button>
        <button onClick={handleGuestLogin} disabled={loading}>
          Login as Guest
        </button>
      </form>
      <div className="footer">

      </div>
    </section>
  );
};
export default LoginForm;
