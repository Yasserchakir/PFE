import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CreateSociete = () => {
  const [formData, setFormData] = useState({
    typeVendeur: '',
    nomEntreprise: '',
    nomVendeur: '',
    secteurActivite: '',
    description: '',
    email: '',
    numeroTelephone: '',
    ribIban: '',
    methodesPaiement: []
  });

  const handleChange = (e) => {
    const { name, value, type, options } = e.target;

    if (type === 'select-multiple') {
      const selectedValues = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: selectedValues,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');  // Récupérer le token

    try {
      const response = await axios.post('http://localhost:5000/api/societes', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Ajouter le token dans l'en-tête
        },
      });
      console.log('Société créée:', response.data);
      alert('Société créée avec succès!');
    } catch (error) {
      console.error('Erreur lors de la création de la société:', error);
      alert('Erreur lors de la création de la société.');
    }
  };

  return (
    <div>
      <h1>Créer une Société</h1>
      <Link to="/societes">Voir la liste des sociétés</Link> {/* Lien vers la liste */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Type de vendeur</label>
          <select
            name="typeVendeur"
            value={formData.typeVendeur}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez le type</option>
            <option value="Personne physique">Personne physique</option>
            <option value="Société">Société</option>
          </select>
        </div>

        {formData.typeVendeur === 'Société' && (
          <>
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
              <label>Numéro d'enregistrement</label>
              <input
                type="text"
                name="numeroEnregistrement"
                value={formData.numeroEnregistrement}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Nom du responsable</label>
              <input
                type="text"
                name="nomResponsable"
                value={formData.nomResponsable}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Adresse de l'entreprise</label>
              <input
                type="text"
                name="adresseEntreprise"
                value={formData.adresseEntreprise}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Statut juridique</label>
              <input
                type="text"
                name="statutJuridique"
                value={formData.statutJuridique}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        {formData.typeVendeur === 'Personne physique' && (
          <div>
            <label>Nom du vendeur</label>
            <input
              type="text"
              name="nomVendeur"
              value={formData.nomVendeur}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div>
          <label>Secteur d'activité</label>
          <select
            name="secteurActivite"
            value={formData.secteurActivite}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez un secteur</option>
            <option value="Informatique">Informatique</option>
            <option value="Construction">Construction</option>
            <option value="Finance">Finance</option>
            {/* Add more options as needed */}
          </select>
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Numéro de téléphone</label>
          <input
            type="text"
            name="numeroTelephone"
            value={formData.numeroTelephone}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>RIB/IBAN</label>
          <input
            type="text"
            name="ribIban"
            value={formData.ribIban}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Méthodes de paiement</label>
          <select
            name="methodesPaiement"
            multiple
            value={formData.methodesPaiement}
            onChange={handleChange}
            required
          >
            <option value="Carte bancaire">Carte bancaire</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        <button type="submit">Créer la société</button>
      </form>
    </div>
  );
};

export default CreateSociete;
