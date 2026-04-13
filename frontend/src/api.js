const API = "https://hms-production-673e.up.railway.app/";

export const registerUser = async (data) => {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
    mode: "cors"
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  return res.json();
};
