import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMsg("");

      const data = await login(formData.email, formData.password);

      if (data.user.role === "doctor") {
        navigate("/chat");
      } else if (data.user.role === "patient") {
        navigate("/chat");
      } else {
        navigate("/");
      }
    } catch (error) {
      setMsg(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "760px", margin: "30px auto", padding: "20px" }}>
      <div
        style={{
          background: "#fff",
          borderRadius: "18px",
          padding: "22px",
          boxShadow: "0 8px 22px rgba(0,0,0,0.08)"
        }}
      >
        <h2 style={{ color: "#0d2f6b", marginBottom: "16px" }}>Login</h2>

        {msg && <p style={{ color: "red" }}>{msg}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600"
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "16px", color: "#64748b" }}>
          Demo: admin@healix.com / 123456
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: "12px",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  fontSize: "15px",
  boxSizing: "border-box"
};