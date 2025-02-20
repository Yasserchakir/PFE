import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceCard from './ServiceCard';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState({
    _id: '',
    servicename: '',
    description: '',
    price: '',
    availability: '',
    state: '',
  });

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/services')
      .then(response => {
        setServices(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDeleteService = (id) => {
    axios
      .delete(`http://localhost:5000/api/services/${id}`)
      .then(() => {
        setServices(services.filter(service => service._id !== id));
      })
      .catch(err => setError(err.message));
  };

  const handleUpdateService = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setSelectedService(prevService => ({
      ...prevService,
      [name]: value,
    }));
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    const { _id, createdBy, ...updatedService } = selectedService; // Exclure `createdBy`

    try {
      await axios.put(`http://localhost:5000/api/services/${_id}`, updatedService);
      setShowModal(false);
      setServices(services.map(service =>
        service._id === _id ? { ...service, ...updatedService } : service
      ));
    } catch (error) {
      console.error('Error updating service', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>All Services</h2>
      <div className="service-list">
        {services.length === 0 ? (
          <p>No services available</p>
        ) : (
          services.map(service => (
            <ServiceCard 
              key={service._id}
              service={service}
              onDelete={handleDeleteService}
              onUpdate={handleUpdateService}
            />
          ))
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Update Service</h3>
            <form onSubmit={handleSubmitUpdate}>
              <input
                type="text"
                name="servicename"
                value={selectedService.servicename}
                onChange={handleModalChange}
                placeholder="Service Name"
                required
              />
              <textarea
                name="description"
                value={selectedService.description}
                onChange={handleModalChange}
                placeholder="Service Description"
                required
              />
              <input
                type="number"
                name="price"
                value={selectedService.price}
                onChange={handleModalChange}
                placeholder="Price"
                required
              />
              <select
                name="availability"
                value={selectedService.availability}
                onChange={handleModalChange}
              >
                <option value="ouvert">Open</option>
                <option value="fermé">Closed</option>
              </select>
              <select
                name="state"
                value={selectedService.state}
                onChange={handleModalChange}
              >
                <option value="à faire">To Do</option>
                <option value="en cours">In Progress</option>
                <option value="terminé">Completed</option>
              </select>
              <div className="modal-footer">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
