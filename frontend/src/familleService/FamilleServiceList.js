import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import AddFamilleService from './AddFamilleService'; // Assurez-vous de bien importer le composant
import axios from 'axios';

const FamilleServiceList = () => {
  const [familleServices, setFamilleServices] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Récupérer les familles de services
  const refreshFamilleServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/familleservices');
      setFamilleServices(response.data);
    } catch (error) {
      console.error('Error fetching famille services', error);
    }
  };

  useEffect(() => {
    refreshFamilleServices();
  }, []);

  return (
    <div>
      <Button variant="primary" onClick={() => setShowModal(true)}>Ajouter FamilleService</Button>
      <AddFamilleService
        show={showModal}
        onClose={() => setShowModal(false)}
        refreshFamilleServices={refreshFamilleServices}
      />
      <ul>
        {familleServices.map((familleService) => (
          <li key={familleService._id}>{familleService.nom} - {familleService.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default FamilleServiceList;
