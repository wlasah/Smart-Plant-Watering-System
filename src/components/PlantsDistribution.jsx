import React from 'react';
import '../styles/AllUsersPlants.css';

const getMostWateredPlants = (plants) => {
  return plants
    .filter(p => p.lastWatered)
    .sort((a, b) => new Date(b.lastWatered) - new Date(a.lastWatered))
    .slice(0, 5);
};

const getPlantTypesCount = (plants) => {
  const types = {};
  plants.forEach(p => {
    types[p.type] = (types[p.type] || 0) + 1;
  });
  return types;
};

const getLocationCount = (plants) => {
  const locations = {};
  plants.forEach(p => {
    locations[p.location] = (locations[p.location] || 0) + 1;
  });
  return locations;
};

const PlantsDistribution = ({ plants }) => {
  const mostWatered = getMostWateredPlants(plants);
  const typeCounts = getPlantTypesCount(plants);
  const locationCounts = getLocationCount(plants);

  return (
    <div className="plants-distribution">
      <h2>Plant Distribution Analytics</h2>
      <div className="distribution-cards">
        <div className="distribution-card">
          <h3>Most Recently Watered Plants</h3>
          <ul>
            {mostWatered.length === 0 ? <li>No data</li> : mostWatered.map(p => (
              <li key={p.id}>{p.name} ({p.owner || 'Unknown'}) - {new Date(p.lastWatered).toLocaleDateString()}</li>
            ))}
          </ul>
        </div>
        <div className="distribution-card">
          <h3>Plant Types</h3>
          <ul>
            {Object.keys(typeCounts).length === 0 ? <li>No data</li> : Object.entries(typeCounts).map(([type, count]) => (
              <li key={type}>{type}: {count}</li>
            ))}
          </ul>
        </div>
        <div className="distribution-card">
          <h3>Locations</h3>
          <ul>
            {Object.keys(locationCounts).length === 0 ? <li>No data</li> : Object.entries(locationCounts).map(([loc, count]) => (
              <li key={loc}>{loc}: {count}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlantsDistribution;
