import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateFamilleService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchFamilleService = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/familleservices/${id}`);
        setNom(response.data.nom);
        setDescription(response.data.description);
      } catch (error) {
        console.error("Error fetching famille service", error);
      }
    };

    fetchFamilleService();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFamilleService = { nom, description };
      await axios.put(`http://localhost:5000/api/familleservice/${id}`, updatedFamilleService);
      alert("Famille de service mise à jour avec succès");
      navigate("/"); // Redirection après la mise à jour
    } catch (error) {
      console.error("Error updating famille service", error);
    }
  };

  return (
    <div className="update-famille-service">
      <h2>Mettre à jour une famille de service</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default UpdateFamilleService;
