import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AppointmentsPage() {
  const { user, authFetch } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    paymentReference: ""
  });

  const loadData = async () => {
    try {
      const [doctorList, appointmentList] = await Promise.all([
        fetch("http://localhost:5000/api/doctors").then((r) => r.json()),
        authFetch("/appointments/mine")
      ]);
      setDoctors(doctorList);
      setAppointments(appointmentList);
    } catch (error) {
      setMsg(error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const bookAppointment = async (e) => {
    e.preventDefault();
    try {
      await authFetch("/appointments", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setMsg("Appointment booked successfully");
      setForm({
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
        paymentReference: ""
      });
      loadData();
    } catch (error) {
      setMsg(error.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await authFetch(`/appointments/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });
      loadData();
    } catch (error) {
      setMsg(error.message);
    }
  };

  return (
    <div>
      <h2>Appointments</h2>
      {msg && <p className="success">{msg}</p>}

      {user.role === "patient" && (
        <div className="card form-card">
          <h3>Book appointment</h3>
          <form onSubmit={bookAppointment}>
            <select
              value={form.doctorId}
              onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
              required
            >
              <option value="">Select doctor</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} - {d.specialization}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.appointmentDate}
              onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
              required
            />

            <input
              type="time"
              value={form.appointmentTime}
              onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })}
              required
            />

            <input
              placeholder="Reason"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />

            <input
              placeholder="Payment reference"
              value={form.paymentReference}
              onChange={(e) => setForm({ ...form, paymentReference: e.target.value })}
            />

            <button className="btn">Book</button>
          </form>
        </div>
      )}

      <div className="grid two">
        {appointments.map((item) => (
          <div className="card" key={item._id}>
            <h3>{item.doctor?.name || item.patient?.name}</h3>
            <p><strong>Date:</strong> {item.appointmentDate}</p>
            <p><strong>Time:</strong> {item.appointmentTime}</p>
            <p><strong>Status:</strong> {item.status}</p>
            <p><strong>Reason:</strong> {item.reason}</p>

            {user.role !== "patient" && (
              <div className="row">
                <button className="btn small" onClick={() => updateStatus(item._id, "confirmed")}>
                  Confirm
                </button>
                <button className="btn small outline" onClick={() => updateStatus(item._id, "completed")}>
                  Complete
                </button>
                <button className="btn small danger" onClick={() => updateStatus(item._id, "cancelled")}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}