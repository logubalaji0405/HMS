// 🔥 Replace with your Railway URL
const API = "https://hms-production-673e.up.railway.app/api/auth";

export const registerUser = async (data) => {
  try {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    return result;

  } catch (error) {
    console.error("Fetch Error:", error);
    return { message: "Server not reachable" };
  }
};