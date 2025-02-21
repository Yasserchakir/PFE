import React from 'react';
import { Button } from 'react-bootstrap';

const DeleteFamilleService = ({ id, refreshFamilleServices }) => {
  const handleDelete = async () => {
    const response = await fetch(`http://localhost:5000/api/familleservices/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Si tu utilises une authentification basée sur un token
      },
    });

    const data = await response.json();
    if (response.ok) {
      alert('FamilleService deleted successfully!');
      refreshFamilleServices(); // Appelle la fonction pour actualiser la liste après suppression
    } else {
      alert('Failed to delete FamilleService.');
    }
  };

  return (
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  );
};

export default DeleteFamilleService;
