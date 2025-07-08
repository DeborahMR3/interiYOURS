import { useState } from "react";
import "./LoginPage.css";


function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Login attempt:", { email, password });
  }

  return (
    <section>
      <span className="login-avatar"></span>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
        </label>

        <label htmlFor="password">Password:
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>

        <button
          type="submit"
          disabled={email.trim() === "" || password.trim() === ""}
        >
          Login
        </button>
      </form>
      <button>Create an account</button>
      <button>Login as Guest</button>
    </section>
  );
}

export default LoginPage;
