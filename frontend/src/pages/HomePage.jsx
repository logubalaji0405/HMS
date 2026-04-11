import React from "react";

export default function HomePage() {
  return (
    <div>
      <section className="hero">
        <div>
          <h1>Healix Hospital Management System</h1>
          <p>
            Web-based hospital platform for patient booking, doctor management,
            medical records, chat, and admin monitoring.
          </p>
        </div>
      </section>

      <section className="grid three">
        <div className="card">
          <h3>Patient Portal</h3>
          <p>Register, log in, book appointments, view records, and chat with doctors.</p>
        </div>
        <div className="card">
          <h3>Doctor Panel</h3>
          <p>Manage availability, see appointments, and add medical records.</p>
        </div>
        <div className="card">
          <h3>Admin Dashboard</h3>
          <p>Track user counts, appointments, records, and platform activity.</p>
        </div>
      </section>
    </div>
  );
}