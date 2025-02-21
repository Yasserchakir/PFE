import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ServiceList = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/services')
      .then(response => setServices(response.data))
      .catch(error => console.error('Erreur:', error));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/services/${id}`)
      .then(() => setServices(services.filter(service => service._id !== id)))
      .catch(error => console.error('Erreur:', error));
  };

  return (
    <div className="service-list">
      <Link to="/add" className="btn-add">Ajouter un Service</Link>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prix</th>
            <th>État</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service._id}>
              <td>{service.servicename}</td>
              <td>{service.price} €</td>
              <td>{service.state}</td>
              <td>
                <Link to={`/service/${service._id}`} className="btn">Voir</Link>
                <Link to={`/edit/${service._id}`} className="btn">Modifier</Link>
                <button onClick={() => handleDelete(service._id)} className="btn-delete">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceList;
