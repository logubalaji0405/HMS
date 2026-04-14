import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const navigate = useNavigate();      // ✅ FIX
  const { login } = useAuth();         // ✅ use context

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ call context login
      await login(formData.email, formData.password);

      setMessage("Login successful ✅");

      // 🚀 redirect to home
      navigate("/");

    } catch (err) {
      setMessage(err.message || "Login failed ❌");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Login</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={e =>
            setFormData({ ...formData, email: e.target.value })
          }
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={e =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;