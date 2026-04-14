import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="brand">Healix</div>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/doctors">Doctors</Link>

        {user && <Link to="/appointments">Appointments</Link>}
        {user && <Link to="/records">Records</Link>}
        {user && <Link to="/chat">Chat</Link>}
        {user && <Link to="/dashboard">Dashboard</Link>}
      </nav>

      <div className="nav-right">
        {user ? (
          <>
            <span className="badge">
              {user.name} ({user.role})
            </span>

            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}