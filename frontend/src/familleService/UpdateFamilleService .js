import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const UpdateFamilleService = ({ show, onClose, familleService, refreshFamilleServices }) => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');

  // Populate fields if familleService is provided
  useEffect(() => {
    if (familleService) {
      setNom(familleService.nom);
      setDescription(familleService.description);
    }
  }, [familleService]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make the PUT request to update the familleService
    const response = await fetch(`http://localhost:5000/api/familleservices/${familleService._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming you are using token-based auth
      },
      body: JSON.stringify({ nom, description }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('FamilleService updated successfully!');
      refreshFamilleServices(); // Refresh list after updating
      onClose(); // Close the modal
    } else {
      alert('Failed to update FamilleService.');
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update FamilleService</Modal.Title>
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

export default UpdateFamilleService;
