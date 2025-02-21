// EditSociete.js (React Component)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // pour obtenir l'id et rediriger

const EditSociete = () => {
  const { id } = useParams(); // Récupérer l'ID de la société à modifier depuis l'URL
  const history = useNavigate(); // Pour rediriger après modification
  const [formData, setFormData] = useState({
    typeVendeur: '',
    nomEntreprise: '',
    secteurActivite: '',
    description: '',
    email: '',
    numeroTelephone: '',
    ribIban: '',
    methodesPaiement: []
  });

  // Charger les données de la société à modifier
  useEffect(() => {
    const fetchSociete = async () => {
      const token = localStorage.getItem('token');  // Récupérer le token
      try {
        const response = await axios.get(`http://localhost:5000/api/societes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setFormData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la société:', error);
      }
    };

    fetchSociete();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');  // Récupérer le token
    try {
      const response = await axios.put(`http://localhost:5000/api/societes/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Société modifiée avec succès!');
      history.push('/societes'); // Rediriger vers la liste des sociétés
    } catch (error) {
      console.error('Erreur lors de la modification de la société:', error);
      alert('Erreur lors de la modification de la société.');
    }
  };

  return (
    <div>
      <h1>Modifier une Société</h1>
      <form onSubmit={handleSubmit}>
        {/* Le même formulaire que pour la création, mais avec les valeurs pré-remplies */}
        <div>
          <label>Nom de l'entreprise</label>
          <input
            type="text"
            name="nomEntreprise"
            value={formData.nomEntreprise}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Secteur d'activité</label>
          <input
            type="text"
            name="secteurActivite"
            value={formData.secteurActivite}
            onChange={handleChange}
            required
          />
        </div>
        {/* Ajoutez ici les autres champs similaires */}
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default EditSociete;
