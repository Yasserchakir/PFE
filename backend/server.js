require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const bodyParser = require('body-parser');
const familleProduitRoutes = require('./routes/familleProduitRoutes');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const serviceRoutes = require('./routes/serviceRoutes'); // Path to the routes file
const productRoutes = require('./routes/productRoutes');
const societeRoutes=require("./routes/societeRoutes");
const familleServiceRoutes=require("./routes/familleServiceRoutes");
app.use('/api/products', productRoutes);
app.use(express.json());
app.use(cors());
app.use('/api/services',serviceRoutes);
app.use("/uploads", express.static("uploads"));
app.use('/api/familleservices',familleServiceRoutes)
app.use('/api/familleproduits', familleProduitRoutes); // Corrected route path
app.use('/api/societes', societeRoutes);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Setup multer for avatar uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// --------------------
// Registration Route
// --------------------
app.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    const { name, prenom, email, password, role, city, telephone } = req.body;
    const avatar = req.file ? req.file.path : null;

    // Validate role
    const validRoles = ["Admin", "Client", "Vendeur"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role!" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      prenom,
      email,
      password: hashedPassword,
      role,
      avatar,
      city,
      telephone,
    });

    await newUser.save();

    res.json({
      message: "User registered successfully!",
      user: {
        name: newUser.name,
        prenom: newUser.prenom,
        email: newUser.email,
        role: newUser.role,
        city: newUser.city,
        telephone: newUser.telephone,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful!",
      user: {
        name: user.name,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        city: user.city,
        telephone: user.telephone,
      },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});

// --------------------
// Middleware: isAdmin
// --------------------
const isAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Failed to authenticate token." });
    if (decoded.role !== "Admin") {
      return res.status(403).json({ message: "Access to the resource is prohibited. Admins only." });
    }
    req.userId = decoded.userId;
    next();
  });
};

// --------------------
// Admin Route: Get All Users (Protected)
// --------------------
app.get("/admin/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users!" });
  }
});

// Admin Route: Add User (POST)
app.post("/admin/users", isAdmin, async (req, res) => {
  try {
    const { name, prenom, email, password, role, city, telephone } = req.body;
    const avatar = req.file ? req.file.path : null;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      prenom,
      email,
      password: hashedPassword,
      role,
      avatar,
      city,
      telephone,
    });

    await newUser.save();

    res.json({
      message: "User added successfully!",
      user: newUser,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});

// Admin Route: Update User (PUT)
app.put("/admin/users/:id", isAdmin, async (req, res) => {
  try {
    const { name, prenom, email, role, city, telephone } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    user.name = name || user.name;
    user.prenom = prenom || user.prenom;
    user.email = email || user.email;
    user.role = role || user.role;
    user.city = city || user.city;
    user.telephone = telephone || user.telephone;

    await user.save();
    res.json({ message: "User updated successfully!", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});

// Admin Route: Delete User (DELETE)
app.delete("/admin/users/:id", isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});

// Profile Routes
app.get("/profile", async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

app.put("/profile", upload.single("avatar"), async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let updateData = { ...req.body };
    if (req.file) {
      updateData.avatar = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(decoded.userId, updateData, { new: true }).select("-password");
    res.json({ message: "Profile updated successfully!", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// CORS setup for frontend
app.use(cors({
  origin: 'http://localhost:3000', // Adjust according to your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
// Route pour récupérer la liste des sociétés
app.get('/api/societes', async (req, res) => {
  try {
    const societes = await Societe.find(); // Récupérer toutes les sociétés
    res.json(societes); // Retourner les sociétés en réponse
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour supprimer une société
app.delete('/api/societes/:id', async (req, res) => {
  try {
    const societe = await Societe.findByIdAndDelete(req.params.id); // Supprimer la société par ID
    if (!societe) {
      return res.status(404).json({ message: 'Société non trouvée' });
    }
    res.json({ message: 'Société supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});
// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
