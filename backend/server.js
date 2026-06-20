require("dotenv").config();
const express = require("express");
const cors = require("cors");

const generateRoute = require("./routes/generate");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "PenguinAI Backend Running"
  });
});


app.use("/api/generate", generateRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});