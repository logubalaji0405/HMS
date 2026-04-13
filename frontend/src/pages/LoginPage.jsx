import { useState } from "react";
import { registerUser } from "../api";

function LoginPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "Patient"
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser(formData);
      alert(res.message);
      setError("");
    } catch (err) {
      setError("Failed to fetch");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input placeholder="Name"
          onChange={e => setFormData({ ...formData, name: e.target.value })} /><br /><br />

        <input placeholder="Email"
          onChange={e => setFormData({ ...formData, email: e.target.value })} /><br /><br />

        <input type="password" placeholder="Password"
          onChange={e => setFormData({ ...formData, password: e.target.value })} /><br /><br />

        <input placeholder="Phone"
          onChange={e => setFormData({ ...formData, phone: e.target.value })} /><br /><br />

        <select
          onChange={e => setFormData({ ...formData, role: e.target.value })}>
          <option>Patient</option>
          <option>Doctor</option>
        </select><br /><br />

        <button type="submit">Create account</button>
      </form>
    </div>
  );
}

export default LoginPage;