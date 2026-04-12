import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors({
  origin: "https://your-frontend.vercel.app"
}));

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});