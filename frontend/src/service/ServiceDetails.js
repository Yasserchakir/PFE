import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/services/${id}`)
      .then(response => setService(response.data))
      .catch(error => console.error('Erreur:', error));
  }, [id]);

  if (!service) return <p>Chargement...</p>;

  return (
    <div className="service-details">
      <h2>{service.servicename}</h2>
      <p><strong>Description:</strong> {service.description}</p>
      <p><strong>Prix:</strong> {service.price} €</p>
      <p><strong>État:</strong> {service.state}</p>
      <Link to="/" className="btn">Retour</Link>
    </div>
  );
};

export default ServiceDetails;
