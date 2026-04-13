import { useState } from "react";
import { registerUser } from "../api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "Patient"
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await registerUser(formData);

    if (res.message) {
      setMessage(res.message);
    } else {
      setMessage("Registration failed");
    }
  };

  return (
    <div style={{ width: "300px", margin: "auto" }}>
      <h2>Register</h2>

      <p style={{ color: "red" }}>{message}</p>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required /><br /><br />
        <input name="email" placeholder="Email" onChange={handleChange} required /><br /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br /><br />
        <input name="phone" placeholder="Phone" onChange={handleChange} required /><br /><br />

        <select name="role" onChange={handleChange}>
          <option>Patient</option>
          <option>Doctor</option>
        </select><br /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;