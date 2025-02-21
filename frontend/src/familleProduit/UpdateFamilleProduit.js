// src/UpdateFamilleProduit.js
import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const UpdateFamilleProduit = ({ show, onClose, familleProduit, refreshFamilleProduits }) => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (familleProduit) {
      setNom(familleProduit.nom);
      setDescription(familleProduit.description);
    }
  }, [familleProduit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:5000/api/familleproduits/${familleProduit._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Using token-based auth
      },
      body: JSON.stringify({ nom, description }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('FamilleProduit updated successfully!');
      refreshFamilleProduits();
      onClose();
    } else {
      alert('Failed to update FamilleProduit.');
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update FamilleProduit</Modal.Title>
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
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">Update</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateFamilleProduit;
