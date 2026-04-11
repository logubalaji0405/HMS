import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export default function ChatPage() {
  const { user, authFetch } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const loadDoctors = useCallback(async () => {
    try {
      const data = await authFetch("/doctors");
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      setMsg(error.message || "Failed to load doctors");
    }
  }, [authFetch]);

  const loadConversations = useCallback(async () => {
    try {
      const data = await authFetch("/conversations");
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      setMsg(error.message || "Failed to load conversations");
    }
  }, [authFetch]);

  const loadMessages = useCallback(
    async (otherUserId) => {
      if (!otherUserId) return;

      try {
        setLoading(true);
        const data = await authFetch(`/${otherUserId}`);
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        setMsg(error.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    },
    [authFetch]
  );

  useEffect(() => {
    if (!user) return;

    if (user.role === "patient") {
      loadDoctors();
    }

    if (user.role === "doctor") {
      loadConversations();
    }
  }, [user, loadDoctors, loadConversations]);

  useEffect(() => {
    if (!selectedUser?._id) return;

    loadMessages(selectedUser._id);

    const interval = setInterval(() => {
      loadMessages(selectedUser._id);
      if (user?.role === "doctor") {
        loadConversations();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedUser, loadMessages, loadConversations, user]);

  const handleDoctorChange = async (doctorId) => {
    const doctor = doctors.find((d) => d._id === doctorId);
    setSelectedUser(doctor || null);
    setMessages([]);

    if (doctor) {
      await loadMessages(doctor._id);
    }
  };

  const openConversation = async (conversation) => {
    setSelectedUser(conversation.user);
    await loadMessages(conversation.user._id);

    try {
      await authFetch(`/read/${conversation.user._id}`, {
        method: "PUT",
      });
      loadConversations();
    } catch (error) {
      setMsg(error.message || "Failed to mark messages as read");
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!selectedUser?._id || !text.trim()) return;

    try {
      await authFetch("/", {
        method: "POST",
        body: JSON.stringify({
          receiverId: selectedUser._id,
          message: text.trim(),
        }),
      });

      setText("");
      await loadMessages(selectedUser._id);

      if (user?.role === "doctor") {
        loadConversations();
      }
    } catch (error) {
      setMsg(error.message || "Failed to send message");
    }
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "30px auto", padding: "20px" }}>
      <h2 style={{ color: "#0d2f6b", marginBottom: "20px" }}>Chat</h2>

      {msg && <p style={{ color: "red" }}>{msg}</p>}

      {user?.role === "patient" && (
        <>
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "18px",
              marginBottom: "18px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            }}
          >
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
              Select doctor
            </label>
            <select
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #d9dfeb",
              }}
              defaultValue=""
              onChange={(e) => handleDoctorChange(e.target.value)}
            >
              <option value="">Select doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          {selectedUser && (
            <>
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "18px",
                  marginBottom: "18px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                }}
              >
                <h3 style={{ margin: 0 }}>Chat with Dr. {selectedUser.name}</h3>
              </div>

              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "18px",
                  marginBottom: "18px",
                  minHeight: "350px",
                  maxHeight: "450px",
                  overflowY: "auto",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                }}
              >
                {loading ? (
                  <p>Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p>No messages yet</p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m._id}
                      style={{
                        maxWidth: "75%",
                        padding: "12px 14px",
                        borderRadius: "14px",
                        marginBottom: "12px",
                        background:
                          String(m.sender?._id) === String(user.id) ? "#dbeafe" : "#eef2f7",
                        marginLeft:
                          String(m.sender?._id) === String(user.id) ? "auto" : "0",
                      }}
                    >
                      <strong style={{ display: "block", marginBottom: "4px" }}>
                        {m.sender?.name}
                      </strong>
                      <p style={{ margin: 0 }}>{m.message}</p>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={sendMessage}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "18px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                }}
              >
                <input
                  type="text"
                  placeholder="Type message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #d9dfeb",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    marginTop: "12px",
                    background: "#0d2f6b",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "11px 20px",
                    cursor: "pointer",
                  }}
                >
                  Send
                </button>
              </form>
            </>
          )}
        </>
      )}

      {user?.role === "doctor" && (
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div
            style={{
              width: "320px",
              background: "#fff",
              borderRadius: "16px",
              padding: "18px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h3>Patient Messages</h3>

            {conversations.length === 0 ? (
              <p>No patient messages yet</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.user._id}
                  onClick={() => openConversation(conv)}
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    background:
                      selectedUser?._id === conv.user._id ? "#dbeafe" : "#f6f8fc",
                    marginBottom: "12px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div>
                    <strong>{conv.user.name}</strong>
                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#666" }}>
                      {conv.lastMessage}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span
                      style={{
                        minWidth: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        background: "#ef4444",
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                    >
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={{ flex: 1, minWidth: "300px" }}>
            {selectedUser ? (
              <>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "18px",
                    marginBottom: "18px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <h3 style={{ margin: 0 }}>{selectedUser.name}</h3>
                </div>

                <div
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "18px",
                    marginBottom: "18px",
                    minHeight: "350px",
                    maxHeight: "450px",
                    overflowY: "auto",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  {loading ? (
                    <p>Loading messages...</p>
                  ) : messages.length === 0 ? (
                    <p>No messages yet</p>
                  ) : (
                    messages.map((m) => (
                      <div
                        key={m._id}
                        style={{
                          maxWidth: "75%",
                          padding: "12px 14px",
                          borderRadius: "14px",
                          marginBottom: "12px",
                          background:
                            String(m.sender?._id) === String(user.id)
                              ? "#dbeafe"
                              : "#eef2f7",
                          marginLeft:
                            String(m.sender?._id) === String(user.id) ? "auto" : "0",
                        }}
                      >
                        <strong style={{ display: "block", marginBottom: "4px" }}>
                          {m.sender?.name}
                        </strong>
                        <p style={{ margin: 0 }}>{m.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <form
                  onSubmit={sendMessage}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "18px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Type reply..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid #d9dfeb",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      marginTop: "12px",
                      background: "#0d2f6b",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "11px 20px",
                      cursor: "pointer",
                    }}
                  >
                    Reply
                  </button>
                </form>
              </>
            ) : (
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "18px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                }}
              >
                <p>Select patient conversation to reply.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}