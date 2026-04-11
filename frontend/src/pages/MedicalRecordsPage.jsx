import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function MedicalRecordsPage() {
  const { user, authFetch } = useAuth();
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    patientId: "",
    diagnosis: "",
    medicines: "",
    notes: ""
  });

  const loadData = async () => {
    try {
      const recordList = await authFetch("/records/mine");
      setRecords(recordList);

      if (user.role === "doctor") {
        const patientList = await authFetch("/records/patients-for-doctor");
        setPatients(patientList);
      }
    } catch (error) {
      setMsg(error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addRecord = async (e) => {
    e.preventDefault();
    try {
      await authFetch("/records", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setMsg("Medical record added");
      setForm({ patientId: "", diagnosis: "", medicines: "", notes: "" });
      loadData();
    } catch (error) {
      setMsg(error.message);
    }
  };

  return (
    <div>
      <h2>Medical Records</h2>
      {msg && <p className="success">{msg}</p>}

      {user.role === "doctor" && (
        <div className="card form-card">
          <h3>Add medical record</h3>
          <form onSubmit={addRecord}>
            <select
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              required
            >
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              placeholder="Diagnosis"
              value={form.diagnosis}
              onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
              required
            />

            <input
              placeholder="Medicines"
              value={form.medicines}
              onChange={(e) => setForm({ ...form, medicines: e.target.value })}
            />

            <textarea
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            ></textarea>

            <button className="btn">Save record</button>
          </form>
        </div>
      )}

      <div className="grid two">
        {records.map((item) => (
          <div className="card" key={item._id}>
            <h3>{item.patient?.name || "Patient"}</h3>
            <p><strong>Doctor:</strong> {item.doctor?.name}</p>
            <p><strong>Diagnosis:</strong> {item.diagnosis}</p>
            <p><strong>Medicines:</strong> {item.medicines}</p>
            <p><strong>Notes:</strong> {item.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}