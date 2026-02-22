import React, { useState, useEffect } from 'react';
import '../styles/PlantCarePage.css';

const PlantCarePage = () => {
  const [selectedPlant, setSelectedPlant] = useState('general');

  const careTips = {
    general: {
      title: 'General Plant Care',
      description: 'Essential tips for maintaining healthy plants',
      tips: [
        {
          id: 1,
          title: 'Watering',
          icon: '💧',
          content: 'Water your plants when the top inch of soil is dry. Most plants prefer consistent moisture but not soggy soil. Check soil moisture regularly with your finger.'
        },
        {
          id: 2,
          title: 'Lighting',
          icon: '☀️',
          content: 'Most houseplants need 6-8 hours of indirect light daily. Rotate your plants every few weeks to ensure even growth on all sides.'
        },
        {
          id: 3,
          title: 'Temperature & Humidity',
          icon: '🌡️',
          content: 'Keep temperatures between 65-75°F. Most houseplants prefer humidity levels of 40-60%. Use a humidifier or place plants on pebble trays.'
        },
        {
          id: 4,
          title: 'Fertilizing',
          icon: '🧪',
          content: 'Fertilize during growing season (spring/summer) every 2-4 weeks. Use diluted liquid fertilizer to avoid burning roots. Reduce fertilizing in fall/winter.'
        }
      ]
    },
    succulents: {
      title: 'Succulent Care',
      description: 'Special care tips for succulents and cacti',
      tips: [
        {
          id: 1,
          title: 'Minimal Watering',
          icon: '💧',
          content: 'Water succulents infrequently - only when soil is completely dry. In winter, reduce watering to once a month or less.'
        },
        {
          id: 2,
          title: 'Well-Draining Soil',
          icon: '🏜️',
          content: 'Use cactus/succulent soil mix to prevent root rot. Repot every 2-3 years using fresh soil. Ensure pots have drainage holes.'
        },
        {
          id: 3,
          title: 'Plenty of Sunlight',
          icon: '☀️',
          content: 'Succulents need 6+ hours of direct sunlight daily. Place near a south-facing window. Low light causes etiolation (stretching).'
        },
        {
          id: 4,
          title: 'Temperature Tolerance',
          icon: '🌡️',
          content: 'Most succulents prefer cooler winters (50-60°F) to promote blooming. Protect from frost and extreme heat.'
        }
      ]
    },
    herbs: {
      title: 'Herb Gardening',
      description: 'Tips for growing fresh culinary and medicinal herbs',
      tips: [
        {
          id: 1,
          title: 'Regular Harvesting',
          icon: '✂️',
          content: 'Pinch off leaves regularly to encourage bushier growth. Harvest in the morning for best flavor. Never remove more than 1/3 of the plant.'
        },
        {
          id: 2,
          title: 'Consistent Moisture',
          icon: '💧',
          content: 'Keep soil consistently moist but not waterlogged. Most herbs prefer indoor temperatures between 60-70°F with moderate humidity.'
        },
        {
          id: 3,
          title: 'Abundant Light',
          icon: '☀️',
          content: 'Herbs need 6-8 hours of sunlight daily. Use grow lights if natural light is limited. This promotes better flavor and growth.'
        },
        {
          id: 4,
          title: 'Regular Feeding',
          icon: '🧪',
          content: 'Feed herbs every 2-3 weeks during growing season with balanced fertilizer. Include calcium and potassium for stronger stems.'
        }
      ]
    },
    vines: {
      title: 'Climbing Plants & Vines',
      description: 'Care instructions for vining and climbing plants',
      tips: [
        {
          id: 1,
          title: 'Support Structure',
          icon: '🪜',
          content: 'Provide trellises, poles, or hanging baskets for vines to climb. Train stems gently using soft ties to attach them to supports.'
        },
        {
          id: 2,
          title: 'Pruning',
          icon: '✂️',
          content: 'Prune regularly to control growth and maintain shape. Remove dead or diseased growth. Spring is the best time for heavy pruning.'
        },
        {
          id: 3,
          title: 'Bright, Indirect Light',
          icon: '☀️',
          content: 'Most vines prefer bright, indirect light. Some varieties tolerate lower light. Avoid direct afternoon sun which may scorch leaves.'
        },
        {
          id: 4,
          title: 'Consistent Watering',
          icon: '💧',
          content: 'Keep soil evenly moist during growing season. Water less frequently in winter. Mist foliage to increase humidity and prevent pests.'
        }
      ]
    }
  };

  return (
    <div className="plant-care-page">
      <div className="plant-care-header">
        <h1>🌿 Plant Care Guide</h1>
        <p>Learn how to keep your plants healthy and thriving</p>
      </div>

      <div className="plant-care-container">
        <aside className="care-sidebar">
          <h2>Care Categories</h2>
          <button
            className={`category-btn ${selectedPlant === 'general' ? 'active' : ''}`}
            onClick={() => setSelectedPlant('general')}
          >
            General Care
          </button>
          <button
            className={`category-btn ${selectedPlant === 'succulents' ? 'active' : ''}`}
            onClick={() => setSelectedPlant('succulents')}
          >
            Succulents
          </button>
          <button
            className={`category-btn ${selectedPlant === 'herbs' ? 'active' : ''}`}
            onClick={() => setSelectedPlant('herbs')}
          >
            Herbs
          </button>
          <button
            className={`category-btn ${selectedPlant === 'vines' ? 'active' : ''}`}
            onClick={() => setSelectedPlant('vines')}
          >
            Vines & Climbers
          </button>
        </aside>

        <main className="care-content">
          <div className="care-section">
            <h2>{careTips[selectedPlant].title}</h2>
            <p className="care-description">{careTips[selectedPlant].description}</p>

            <div className="tips-grid">
              {careTips[selectedPlant].tips.map((tip) => (
                <div key={tip.id} className="tip-card">
                  <div className="tip-icon">{tip.icon}</div>
                  <h3>{tip.title}</h3>
                  <p>{tip.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="care-footer">
            <h3>More Tips?</h3>
            <p>Check the Analytics page to see your plant's performance and get personalized recommendations.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlantCarePage;
