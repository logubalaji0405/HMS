import { useState } from "react";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    alert("Login working ✅");
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          onChange={e => setFormData({ ...formData, email: e.target.value })}
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setFormData({ ...formData, password: e.target.value })}
        /><br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;