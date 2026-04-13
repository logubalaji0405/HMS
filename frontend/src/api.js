// 🔥 IMPORTANT: Replace with your Railway URL
const API = "https://hms-production-673e.up.railway.app/api/auth";

export const registerUser = async (data) => {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};