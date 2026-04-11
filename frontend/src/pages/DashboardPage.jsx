import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user, authFetch } = useAuth();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const appointmentList = await authFetch("/appointments/mine");
        setAppointments(appointmentList);

        if (user.role === "admin") {
          const data = await authFetch("/admin/dashboard");
          setStats(data);
        }
      } catch (error) {
        setMsg(error.message);
      }
    };

    load();
  }, []);

  return (
    <div>
      <h2>{user.role[0].toUpperCase() + user.role.slice(1)} Dashboard</h2>
      {msg && <p className="error">{msg}</p>}

      {stats && (
        <div className="grid three">
          <div className="card"><h3>{stats.patients}</h3><p>Patients</p></div>
          <div className="card"><h3>{stats.doctors}</h3><p>Doctors</p></div>
          <div className="card"><h3>{stats.appointments}</h3><p>Appointments</p></div>
          <div className="card"><h3>{stats.records}</h3><p>Medical Records</p></div>
          <div className="card"><h3>{stats.messages}</h3><p>Messages</p></div>
          <div className="card"><h3>{stats.admins}</h3><p>Admins</p></div>
        </div>
      )}

      <div className="card">
        <h3>Recent Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments yet.</p>
        ) : (
          <ul>
            {appointments.map((item) => (
              <li key={item._id}>
                {item.appointmentDate} - {item.appointmentTime} - {item.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}