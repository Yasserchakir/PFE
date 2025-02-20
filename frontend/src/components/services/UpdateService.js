import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

const UpdateService = () => {
  const [service, setService] = useState({
    servicename: '',
    description: '',
    price: '',
    availability: true,
    state: 'active',
    media: '',
    createdBy: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get the service ID from the URL
  const history = useHistory(); // To redirect after the update

  useEffect(() => {
    // Fetch the service by ID
    axios.get(`http://localhost:5000/api/services/${id}`)
      .then((response) => {
        setService(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevService) => ({
      ...prevService,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the updated service data to the backend
      await axios.put(`http://localhost:5000/api/services/${id}`, service);
      history.push('/'); // Redirect back to the service list after the update
    } catch (error) {
      console.error('Error updating service', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="update-service-form">
      <h2>Update Service</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="servicename"
          value={service.servicename}
          onChange={handleChange}
          placeholder="Service Name"
          required
        />
        <textarea
          name="description"
          value={service.description}
          onChange={handleChange}
          placeholder="Service Description"
          required
        />
        <input
          type="text"
          name="price"
          value={service.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <input
          type="text"
          name="createdBy"
          value={service.createdBy}
          onChange={handleChange}
          placeholder="Created By"
          required
        />
        <button type="submit">Update Service</button>
      </form>
    </div>
  );
};

export default UpdateService;
