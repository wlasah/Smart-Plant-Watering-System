import React from 'react';
import '../styles/AllUsersPlants.css';

const AllUsersPlantsTable = ({ plants = [] }) => {
  return (
    <div className="all-users-plants-table-wrapper">
      <table className="all-users-plants-table">
        <thead>
          <tr>
            <th>Plant Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Location</th>
            <th>Owner</th>
            <th>Last Watered</th>
            <th>Moisture Level</th>
          </tr>
        </thead>
        <tbody>
          {plants.length === 0 ? (
            <tr><td colSpan="7">No plants found.</td></tr>
          ) : (
            plants.map(plant => (
              <tr key={plant.id}>
                <td>{plant.name}</td>
                <td>{plant.type}</td>
                <td>{plant.moistureLevel >= 50 ? 'Healthy' : 'Needs Attention'}</td>
                <td>{plant.location}</td>
                <td>{plant.owner || 'Unknown'}</td>
                <td>{plant.lastWatered ? new Date(plant.lastWatered).toLocaleDateString() : 'Never'}</td>
                <td>{plant.moistureLevel}%</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsersPlantsTable;
