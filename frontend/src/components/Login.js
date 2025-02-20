import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", formData);

      if (response.data && response.data.user && response.data.token) {
        alert(response.data.message);

        // Save JWT token and role in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.user.role.trim()); // Trim any spaces

        // Extract user role correctly
        const userRole = response.data.user.role.trim();
        console.log("User role:", userRole);

        // Redirect user based on role
        switch (userRole) {
          case "Admin":
            navigate("/admin");
            break;
          case "Vendeur":
            navigate("/profile");
            break;
          case "Client":
            navigate("/profile");
            break;
          default:
            setErrorMessage("Rôle invalide ! Redirection impossible.");
        }
      } else {
        setErrorMessage("Échec de connexion ! Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setErrorMessage("Échec de connexion ! Erreur du serveur.");
    }
  };

  return (
    <div className="App">
      <form className="form-container" onSubmit={handleSubmit}>
        <h1>Login</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <div className="password-field">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Login</button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
}

export default Login;
