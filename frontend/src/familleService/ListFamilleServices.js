import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListFamilleServices = () => {
  const [familleServices, setFamilleServices] = useState([]);
  const navigate = useNavigate(); // Pour gérer la redirection vers la page de mise à jour

  // Effectuer un appel pour récupérer les familles de services
  useEffect(() => {
    const fetchFamilleServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/familleservices"); // Assure-toi que l'URL correspond à ton backend
        setFamilleServices(response.data);
      } catch (error) {
        console.error("Error fetching familles de services", error);
      }
    };

    fetchFamilleServices();
  }, []); // Appel de l'API une seule fois au montage du composant

  // Fonction de suppression d'une famille de service
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/familleservice/${id}`);
      setFamilleServices(familleServices.filter((famille) => famille._id !== id));
    } catch (error) {
      console.error("Error deleting famille service", error);
    }
  };

  // Fonction pour rediriger vers la page de mise à jour
  const handleUpdate = (id) => {
    navigate(`/update/${id}`); // Rediriger vers la page de mise à jour
  };

  return (
    <div className="famille-service-list">
      <h2>Liste des Familles de Service</h2>
      <ul>
        {familleServices.map((familleService) => (
          <li key={familleService._id}>
            <strong>{familleService.nom}</strong> - {familleService.description}
            <button onClick={() => handleDelete(familleService._id)}>Supprimer</button>
            <button onClick={() => handleUpdate(familleService._id)}>Modifier</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListFamilleServices;
