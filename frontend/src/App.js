import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/signup";
import Welcome from "./components/Welcome";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import GereProfile from "./components/GereProfile";
import FamilleProduitListe from "./familleProduit/FamilleProduitListe";
import FamilleServiceList from "./familleService/FamilleServiceList";
import ServiceList from './service/ServiceList';
import ServiceForm from './service/ServiceForm';
import ServiceDetails from './service/ServiceDetails';
import SocieteList from './societe/SocieteList';
import EditSociete from './societe/EditSociete';
import CreateSociete from './societe/CreateSociete';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gererprofile" element={<GereProfile />} />
        <Route path="/admin/familleserv" element={<FamilleServiceList />} />
        <Route path="/admin/familleprod" element={<FamilleProduitListe />} />
        
        {/* Services Routes */}
        <Route path="/services" element={<ServiceList />} />
        <Route path="/services/add" element={<ServiceForm />} />
        <Route path="/services/edit/:id" element={<ServiceForm />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        
        {/* Societe Routes */}
        <Route path="/societes" element={<SocieteList />} />
        <Route path="/societes/create" element={<CreateSociete />} />
        <Route path="/societes/edit/:id" element={<EditSociete />} />

      </Routes>
    </Router>
  );
}

export default App;
