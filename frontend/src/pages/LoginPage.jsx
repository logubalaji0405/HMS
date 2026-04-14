import React, { useState } from "react";

const API = "https://hms-production-673e.up.railway.app/api/auth";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful ✅");
        
          // 🔐 save user (optional)
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🚀 REDIRECT TO HOME
      navigate("/");

      } else {
        setMessage(data.message);
      }

    } catch (err) {
      setMessage("Server error ❌");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Login</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email"
          onChange={e => setFormData({ ...formData, email: e.target.value })}
        /><br /><br />

        <input type="password" placeholder="Password"
          onChange={e => setFormData({ ...formData, password: e.target.value })}
        /><br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;