// src/AddFamilleProduit.js
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const AddFamilleProduit = ({ show, onClose, refreshFamilleProduits }) => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://localhost:5000/api/familleproduits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming you are using token-based auth
      },
      body: JSON.stringify({ nom, description }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('FamilleProduit added successfully!');
      refreshFamilleProduits();
      onClose();
    } else {
      alert('Failed to add FamilleProduit.');
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add FamilleProduit</Modal.Title>
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
          <Button variant="primary" type="submit" className="mt-3">Save</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddFamilleProduit;
