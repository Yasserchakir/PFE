// src/FamilleProduitListe.js
import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import AddFamilleProduit from './AddFamilleProduit';
import UpdateFamilleProduit from './UpdateFamilleProduit';
import DeleteFamilleProduit from './DeleteFamilleProduit';

const FamilleProduitListe = () => {
  const [familleProduits, setFamilleProduits] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [familleProduitToEdit, setFamilleProduitToEdit] = useState(null);

  // Fetch all FamilleProduits
  const fetchFamilleProduits = async () => {
    const response = await fetch('http://localhost:5000/api/familleproduits', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    setFamilleProduits(data);
  };

  useEffect(() => {
    fetchFamilleProduits();
  }, []);

  return (
    <>
      <Button variant="primary" onClick={() => setShowAddModal(true)}>
        Add FamilleProduit
      </Button>

      <AddFamilleProduit show={showAddModal} onClose={() => setShowAddModal(false)} refreshFamilleProduits={fetchFamilleProduits} />

      {familleProduitToEdit && (
        <UpdateFamilleProduit
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          familleProduit={familleProduitToEdit}
          refreshFamilleProduits={fetchFamilleProduits}
        />
      )}

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {familleProduits.map((familleProduit) => (
            <tr key={familleProduit._id}>
              <td>{familleProduit._id}</td>
              <td>{familleProduit.nom}</td>
              <td>{familleProduit.description}</td>
              <td>
                <Button variant="warning" onClick={() => { setFamilleProduitToEdit(familleProduit); setShowEditModal(true); }}>
                  Edit
                </Button>{' '}
                <DeleteFamilleProduit id={familleProduit._id} refreshFamilleProduits={fetchFamilleProduits} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default FamilleProduitListe;
