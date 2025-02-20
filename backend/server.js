require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const productRoutes = require('./routes/productRoutes'); // Ensure correct path to productRoutes
const bodyParser = require('body-parser');
const familleProduitRoutes = require('./routes/familleProduitRoutes');
const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use('/api/products', productRoutes); // This ensures that '/api/products' is the correct base URL for your product routes
app.use('/api/famille-produits', familleProduitRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// Setup multer for avatar uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
const serviceRoutes = require("./routes/serviceRoutes");
app.use("/api", serviceRoutes);
// --------------------
// Registration Route
// --------------------
app.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    const { name, prenom, email, password, role,city, telephone } = req.body;
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
        city:newUser.city,
         telephone:newUser.telephone,
      },
    });
  } catch (error) {
    console.error(error);
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

    // Create a JWT token (include role and userId in payload)
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
        city:user.city,
        telephone:user.telephone,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});


// --------------------
// Middleware: isAdmin
// --------------------
const isAdmin = (req, res, next) => {
  // Expecting header "Authorization: Bearer <token>"
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // Remove "Bearer" prefix
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Failed to authenticate token." });
    // Only allow if role is Admin
    if (decoded.role !== "Admin") {
      return res.status(403).json({ message: "Access to the resource is prohibited. Admins only." });
    }
    req.userId = decoded.userId; // (optional)
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
    res.status(500).json({ message: "Error fetching users!" });
  }
});
// --------------------
// Admin Route: Add User (POST)
// --------------------
app.post("/admin/users", isAdmin, async (req, res) => {
  try {
    const { name, prenom, email, password, role,city,telephone} = req.body;
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
    console.error(error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});

// --------------------
// Admin Route: Update User (PUT)
// --------------------
app.put("/admin/users/:id", isAdmin, async (req, res) => {
  try {
    const { name, prenom, email, role,city, telephone } = req.body;
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
    res.status(500).json({ message: "Server error, please try again." });
  }
});

// --------------------
// Admin Route: Delete User (DELETE)
// --------------------
app.delete("/admin/users/:id", isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again." });
  }
});
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
          updateData.avatar = req.file.path; // Mise à jour de l'avatar si fourni
      }

      const updatedUser = await User.findByIdAndUpdate(decoded.userId, updateData, { new: true }).select("-password");
      res.json({ message: "Profile updated successfully!", user: updatedUser });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});


app.use(cors({
  origin: 'http://localhost:3000', // Ensure your frontend URL is allowed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
