# Smart Plant Watering Irrigation System - Frontend

A React-based frontend for the Smart Plant Watering Irrigation System that helps users monitor and control their plants' watering needs.

## Project Overview

This application provides a user-friendly dashboard interface for the Smart Plant Watering Irrigation System, allowing users to:
- Monitor soil moisture levels for multiple plants
- Track watering schedules and history
- View plant health status
- Water plants manually through the interface
- Track plant location and current conditions

## Features

### Dashboard Screen
- **System Overview**: Quick statistics including total plants, healthy plants, plants needing attention, and average moisture level
- **Plant Status Cards**: Individual cards for each plant showing:
  - Plant name and location
  - Current soil moisture level (with color-coded indicators)
  - Health status (Healthy or Needs Attention)
  - Last watering time
  - Watering schedule
  - Water Now button for manual watering

### Dynamic Data Display
- Uses React state and mock data to simulate real system data
- Responsive grid layout that adapts to different screen sizes
- Real-time status updates and calculations

### Semantic HTML
- Proper use of `<header>`, `<main>`, `<section>`, `<article>`, and `<footer>` tags
- Semantic elements for better accessibility and SEO

### CSS Styling
- Modern, responsive design with:
  - Gradient backgrounds
  - Smooth transitions and hover effects
  - Mobile-responsive grid layouts
  - Color-coded status indicators
  - Accessibility-focused design

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd smart-plant-watering
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
smart-plant-watering/
├── src/
│   ├── components/
│   │   └── Dashboard.jsx          # Main dashboard component
│   ├── styles/
│   │   └── Dashboard.css          # Dashboard styling
│   ├── App.js                     # Main App component
│   ├── App.css                    # App styling
│   ├── index.js                   # React entry point
│   └── index.css                  # Global styles
├── public/
│   └── index.html                 # HTML template
├── package.json                   # Project dependencies
└── README.md                      # This file
```

## Data Structure

The dashboard uses the following plant data structure:

```javascript
{
  id: number,
  name: string,
  moistureLevel: number (0-100),
  status: "Healthy" | "Needs Attention",
  lastWatered: string,
  location: string,
  wateringSchedule: string
}
```

## Future Enhancements

- Connect to backend API for real plant data
- Implement user authentication
- Add plant watering history graphs
- Create settings/configuration screen
- Add notifications for watering reminders
- Implement plant-specific care guides

## Technologies Used

- React 18.x
- CSS3 with Flexbox and Grid
- Node.js/npm

## License

This project is part of the Smart Plant Watering Irrigation System initiative.

## Created

February 2026

---

**Note**: This is the frontend React application. Make sure to have the backend API server running for full system functionality.
