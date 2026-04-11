import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function DoctorsPage() {
  const { authFetch } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await authFetch("/doctors");

        if (Array.isArray(data)) {
          setDoctors(data);
        } else {
          setDoctors([]);
          setError("Invalid doctors data");
        }
      } catch (err) {
        setDoctors([]);
        setError(err.message || "Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, [authFetch]);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Doctors</h2>

      {loading && <p>Loading doctors...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && doctors.length === 0 && <p>No doctors found</p>}

      <div>
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            style={{
              background: "#fff",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
            }}
          >
            <h3>{doctor.name}</h3>
            <p>{doctor.email}</p>
            <p>{doctor.specialization || "General"}</p>
            <p>{doctor.availability || "Available"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}