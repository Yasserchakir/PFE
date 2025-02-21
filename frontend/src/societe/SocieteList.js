import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SocieteList = () => {
  const [societes, setSocietes] = useState([]);
  
  // Récupérer la liste des sociétés au chargement du composant
  useEffect(() => {
    const fetchSocietes = async () => {
      const token = localStorage.getItem('token'); // Récupérer le token
      try {
        const response = await axios.get('http://localhost:5000/api/societes', {
          headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête
          },
        });
        setSocietes(response.data); // Mettre à jour l'état avec les sociétés
      } catch (error) {
        console.error('Erreur lors de la récupération des sociétés:', error);
        alert('Erreur lors de la récupération des sociétés.');
      }
    };

    fetchSocietes();
  }, []);

  // Fonction pour supprimer une société
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token'); // Récupérer le token
    try {
      await axios.delete(`http://localhost:5000/api/societes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Ajouter le token dans l'en-tête
        },
      });
      alert('Société supprimée avec succès');
      setSocietes(societes.filter((societe) => societe._id !== id)); // Mettre à jour la liste après suppression
    } catch (error) {
      console.error('Erreur lors de la suppression de la société:', error);
      alert('Erreur lors de la suppression de la société.');
    }
  };

  return (
    <div>
      <h2>Liste des Sociétés</h2>
      
      {societes.length === 0 ? (
        <p>Aucune société trouvée.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nom de l'entreprise</th>
              <th>Secteur d'activité</th>
              <th>Email</th>
              <th>Numéro de téléphone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {societes.map((societe) => (
              <tr key={societe._id}>
                <td>{societe.nomEntreprise}</td>
                <td>{societe.secteurActivite}</td>
                <td>{societe.email}</td>
                <td>{societe.numeroTelephone}</td>
                <td>
                  {/* Lien vers le formulaire de modification de la société */}
                  <Link to={`/societes/edit/${societe._id}`}>Modifier</Link>
                  
                  {/* Bouton pour supprimer la société */}
                  <button onClick={() => handleDelete(societe._id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />
      <Link to="/societes/create">Créer une nouvelle société</Link> {/* Lien vers le formulaire de création */}
    </div>
  );
};

export default SocieteList;
