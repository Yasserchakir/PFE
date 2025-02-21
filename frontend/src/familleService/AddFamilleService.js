import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const AddFamilleService = ({ show, onClose, refreshFamilleServices }) => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/familleservices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Si tu utilises une authentification basée sur un token
      },
      body: JSON.stringify({ nom, description }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('FamilleService added successfully!');
      refreshFamilleServices(); // Appelle la fonction pour actualiser la liste des familles de services
      onClose(); // Ferme le modal après l'ajout
    } else {
      alert('Failed to add FamilleService.');
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add FamilleService</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nom">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="description" className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">Save</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddFamilleService;
