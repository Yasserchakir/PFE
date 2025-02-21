import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ServiceForm = () => {
  const [service, setService] = useState({
    servicename: '',
    description: '',
    price: '',
    tva: 19,
    state: 'à faire'
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/services/${id}`)
        .then(response => setService(response.data))
        .catch(error => console.error('Erreur:', error));
    }
  }, [id]);

  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = id ? `http://localhost:5000/api/services/${id}` : 'http://localhost:5000/api/services';
    const method = id ? 'put' : 'post';

    axios[method](url, service)
      .then(() => navigate('/'))
      .catch(error => console.error('Erreur:', error));
  };

  return (
    <div className="service-form">
      <h2>{id ? "Modifier le Service" : "Ajouter un Service"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Nom:</label>
        <input type="text" name="servicename" value={service.servicename} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={service.description} onChange={handleChange} required></textarea>

        <label>Prix:</label>
        <input type="number" name="price" value={service.price} onChange={handleChange} required />

        <label>TVA:</label>
        <select name="tva" value={service.tva} onChange={handleChange}>
          <option value={0}>0%</option>
          <option value={7}>7%</option>
          <option value={13}>13%</option>
          <option value={19}>19%</option>
        </select>

        <button type="submit" className="btn-submit">Enregistrer</button>
      </form>
    </div>
  );
};

export default ServiceForm;
