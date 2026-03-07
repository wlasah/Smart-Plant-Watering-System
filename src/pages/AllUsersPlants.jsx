import React, { useState, useEffect } from 'react';
import AllUsersPlantsTable from '../components/AllUsersPlantsTable';
import PlantsDistribution from '../components/PlantsDistribution';
import SearchFilter from '../components/SearchFilter';
import '../styles/AllUsersPlants.css';

const AllUsersPlants = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);

  useEffect(() => {
    // Load all plants from localStorage
    const allPlants = JSON.parse(localStorage.getItem('plants')) || [];
    setPlants(allPlants);
    setFilteredPlants(allPlants);
  }, []);

  const handleFilterChange = (filtered) => {
    setFilteredPlants(filtered);
  };

  return (
    <div className="all-users-plants-page">
      <header className="all-users-plants-header">
        <h1>🌍 All Users' Plants</h1>
        <p>View, filter, and analyze all plants across all users.</p>
      </header>
      <section className="all-users-plants-controls">
        <SearchFilter plants={plants} onFilterChange={handleFilterChange} showUserFilter={true} />
      </section>
      <section className="all-users-plants-table-section">
        <AllUsersPlantsTable plants={filteredPlants} />
      </section>
      <section className="all-users-plants-distribution-section">
        <PlantsDistribution plants={filteredPlants} />
      </section>
    </div>
  );
};

export default AllUsersPlants;
