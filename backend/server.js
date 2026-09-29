require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// =====================================
// MONGODB CONNECTION
// =====================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });

// =====================================
// USER SCHEMA
// =====================================

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true,
  },

  password: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

// =====================================
// PREDICTION SCHEMA
// =====================================

const predictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  text: String,

  sentiment: String,

  confidence: Number,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Prediction = mongoose.model("Prediction", predictionSchema);

// =====================================
// REGISTER API
// =====================================

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      email: email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});

// =====================================
// LOGIN API
// =====================================

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.json({
      message: "Login successful",

      token: token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

// =====================================
// JWT VERIFY MIDDLEWARE
// =====================================

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. Token required.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.log("JWT Error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// =====================================
// PREDICTION API
// =====================================

app.post("/predict", verifyToken, async (req, res) => {
  try {
    const text = req.body.text;

    if (!text || !text.trim()) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    // Send text to Python ML API

    const response = await axios.post("http://127.0.0.1:5000/predict", {
      text: text,
    });

    // Save prediction with USER ID

    const prediction = new Prediction({
      userId: req.userId,

      text: response.data.text,

      sentiment: response.data.sentiment,

      confidence: response.data.confidence,
    });

    await prediction.save();

    // Send result to React

    res.json(response.data);
  } catch (error) {
    console.log("Prediction Error:", error.response?.data || error.message);

    res.status(500).json({
      error: "Prediction failed",
    });
  }
});

// =====================================
// USER-WISE HISTORY API
// =====================================

app.get("/history", verifyToken, async (req, res) => {
  try {
    const history = await Prediction.find({
      userId: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.json(history);
  } catch (error) {
    console.log("History Error:", error);

    res.status(500).json({
      error: "Failed to fetch history",
    });
  }
});

// =====================================
// HOME
// =====================================

app.get("/", (req, res) => {
  res.send("Node Backend is running!");
});

// =====================================
// START SERVER
// =====================================

app.listen(3000, () => {
  console.log("Node server running on http://localhost:3000");
});
