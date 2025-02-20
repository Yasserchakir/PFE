import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Eyeicon from "../assets/eyeicon.png"; // Ensure this image exists
import "../App.css";

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    prenom: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "Client",
    city: "", // New property
    telephone: "" // New property
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("prenom", formData.prenom);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", formData.role);
    data.append("city", formData.city); // Append city
    data.append("telephone", formData.telephone); // Append telephone
    if (image) data.append("avatar", image);

    try {
      const response = await axios.post("http://localhost:5000/register", data);
      console.log(response);

      if (response.data && response.data.user) {
        alert(response.data.message);

        const { role } = response.data.user;
        if (role === "Client") {
          navigate("/home");
        } else if (role === "Vendeur") {
          navigate("/profile");
        } else if (role === "Admin") {
          navigate("/admin");
        }
      } else {
        setErrorMessage("Registration failed! Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Registration failed! Server error.");
    }
  };

  return (
    <div className="App">
      <form className="form-container" onSubmit={handleSubmit}>
        <h1>Inscription</h1>

        <input type="text" name="name" placeholder="Nom" onChange={handleChange} required />
        <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="text" name="city" placeholder="Ville" onChange={handleChange} required />
        <input type="tel" name="telephone" placeholder="Téléphone" onChange={handleChange} required />

        <div className="password-field">
          <input type={showPassword ? "text" : "password"} name="password" placeholder="Mot de passe" onChange={handleChange} required />
          <img src={Eyeicon} alt="Afficher/Masquer" className="eye-icon" onClick={() => setShowPassword(!showPassword)} />
        </div>

        <div className="password-field">
          <input type={showConfirmPassword ? "text" : "password"} name="confirm_password" placeholder="Confirmer mot de passe" onChange={handleChange} required />
          <img src={Eyeicon} alt="Afficher/Masquer" className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
        </div>

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="Admin">Admin</option>
          <option value="Client">Client</option>
          <option value="Vendeur">Vendeur</option>
        </select>

        <div className="avatar-upload">
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden id="fileUpload" />
          <label htmlFor="fileUpload">
            {image ? <img src={URL.createObjectURL(image)} alt="Avatar" className="avatar-preview" /> : <span>Donner l'image de l'avatar</span>}
          </label>
        </div>

        <button type="submit">Sign up</button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <p>
          Already have an account? {" "}
          <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
