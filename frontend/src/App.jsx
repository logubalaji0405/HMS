import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

function Home() {
  return (
    <div style={{ padding: "40px", fontSize: "24px" }}>
      Home Page
    </div>
  );
}

function Doctors() {
  return (
    <div style={{ padding: "40px", fontSize: "24px" }}>
      Doctors Page
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;