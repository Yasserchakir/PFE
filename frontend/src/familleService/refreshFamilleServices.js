const refreshFamilleServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/familleservices');
      const data = await response.json();
      setFamilleServices(data); // Met à jour l'état des familles de services
    } catch (error) {
      console.error('Error fetching famille services', error);
    }
  };
  