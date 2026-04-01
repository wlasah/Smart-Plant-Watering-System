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

## Deployment to Vercel

This application is deployed and hosted on [Vercel](https://vercel.com). Follow these steps to deploy your own instance:

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```
Follow the prompts to authenticate with your Vercel account.

3. **Deploy the project**:
```bash
vercel
```
Or for production deployment:
```bash
vercel --prod
```

4. **Follow the prompts** to configure your project settings:
   - Project name (default: smart-plant-watering-system)
   - Framework: Select "Next.js" or "Other" → "Create React App" 
   - Root directory: `./` (or `./Smart-Plant-Watering-System` if deploying from parent directory)

5. **Your app will be deployed** and you'll receive a live URL.

### Option 2: Deploy via GitHub Integration

1. **Push your code to GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your GitHub repository
   - Click "Import"

3. **Configure Project Settings**:
   - **Framework Preset**: Next.js / Create React App
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `build` (default)
   - **Install Command**: `npm install` (default)

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - You'll receive a production URL

### Option 3: Manual Deployment via Git

1. **Install Vercel**:
```bash
npm install -g vercel
```

2. **Link your project**:
```bash
vercel link
```

3. **Deploy**:
```bash
vercel --prod
```

### Environment Variables (if needed)

If your app requires environment variables:

1. Create a `.env.local` file in the root directory:
```
REACT_APP_API_URL=https://your-api-url.com
REACT_APP_VERCEL_ENV=production
```

2. In Vercel Dashboard:
   - Go to **Settings** → **Environment Variables**
   - Add your environment variables
   - Redeploy

### Post-Deployment

- **View Analytics**: 
  - Go to your Vercel Dashboard
  - Select your project
  - Click **Analytics** tab to view traffic and performance metrics

- **Custom Domain** (Optional):
  - In Vercel Dashboard → **Settings** → **Domains**
  - Add your custom domain
  - Update DNS records as instructed

- **Automatic Deployments**:
  - Vercel automatically redeploys when you push to your main branch
  - Preview deployments are created for pull requests

### Troubleshooting Deployment

**Build fails with "npm not found"**:
- Ensure `package.json` is in the root directory
- Check that Node.js version is 14.0 or higher

**App shows blank page**:
- Check browser console for errors (F12)
- Verify all imports and paths are correct
- Clear Vercel cache: In Dashboard → **Settings** → **Advanced** → **Clear Build Cache**

**Performance issues**:
- Monitor **Analytics tab** in Vercel Dashboard
- Check **Core Web Vitals** for optimization tips
- Reduce bundle size by reviewing dependencies

### Vercel URL Format

Your deployed app will be accessible at:
```
https://<project-name>.vercel.app
```

You can also set up a custom domain to replace this URL.

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
