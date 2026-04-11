import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

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
            <span className="badge">{user.name} ({user.role})</span>
            <button className="btn small danger" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="btn small" to="/login">Login</Link>
            <Link className="btn small outline" to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}