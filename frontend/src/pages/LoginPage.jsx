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
    } catch (err) {
      setError("Failed to fetch");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{color:"red"}}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input placeholder="Name" onChange={e => setFormData({...formData, name:e.target.value})} />
        <input placeholder="Email" onChange={e => setFormData({...formData, email:e.target.value})} />
        <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password:e.target.value})} />
        <input placeholder="Phone" onChange={e => setFormData({...formData, phone:e.target.value})} />

        <select onChange={e => setFormData({...formData, role:e.target.value})}>
          <option>Patient</option>
          <option>Doctor</option>
        </select>

        <button type="submit">Create account</button>
      </form>
    </div>
  );
}

export default LoginPage;