# Smart Plant Watering System - Feature Guide

## Overview

This document summarizes feature sets for both the Web application and the Mobile application. Use this as a reference for product behavior, help text, and bot responses.

---

## Web App Features

### 1. Dashboard

#### General
- Role-based landing:
  - Admin sees `AdminDashboard`
  - User sees `DashboardComponent`
- Data from `localStorage`: `plants`, `wateringHistory`, `currentUser`

#### Stats
- Total plants
- Healthy plants (moisture >= 50)
- Needs attention (moisture < 50)
- Avg moisture

#### Plants categories
- Plants needing attention (sorted by lowest moisture)
- Recently added plants
- Recently watered plants

#### Actions
- Add plant (`AddPlantForm` modal)
- Water plant (updates moisture, history, and notifications)
- Navigate to `All Users Plants` and `Analytics`

---

### 2. Analytics

#### Main Sections
- Overview tab
  - System stats cards (total/healthy/attention/avg/max/min moisture)
  - Water usage trend chart by time range (week/month/year)
  - Plant health distribution (excellent/good/warning/critical)
  - Plants by location
  - Insights (most watered, health score, recommendations)

- User Engagement tab (`UserEngagement` component)
- Plant Health Trends tab (`PlantHealthTrends` component)
- Watering Analytics tab (`WateringAnalytics` component)
- Communication tab (`CommunicationCenter` + `BatchOperations`)

##### Data
- `plants` from `localStorage`
- `wateringHistory` from `localStorage`
- `users`, `userActivityLog`

---

### 3. All Users' Plants

#### Controls
- Search (`name`, `owner`, `location`, `type`)
- Health status filter (critical/warning/healthy)
- Owner/location filter
- Sort by name/moisture/owner/location/recent water
- View modes (table/card)

#### Bulk actions
- Select all / individual select
- Water selected plants (set moisture to 85)
- Archive selected plants
- Export selected to CSV

#### Stats
- Quick overview: critical/warning/healthy/total

---

### 4. Settings

#### Tabs
- System Configuration (`EnhancedSettings`)
- Watering Schedules (`WateringScheduleManager`)
- Plant Type & Location (`PlantTypeLocationManager`)
- Automation Rules (`AutomatedActionsManager`)

#### Shared behavior
- Persisted in `localStorage` or app state
- Admin-only controls via sidebar role check

---

## Web UI Shared Components

### AdminSidebar
- Responsive (desktop + mobile)
- collapse toggle + mobile open/close
- navigation links: dashboard, analytics, all plants, settings
- logout button

### StatsCard
- reusable stat card for metrics

---

## Mobile App Features

### 1. Dashboard (screens/DashboardScreen.js)

#### Header
- greeting with user name
- sign out button (confirmation dialog)

#### Stats cards (StatsCard component)
- Total Plants
- Healthy Plants
- Need Attention
- Avg Moisture

#### Actions
- View All Plants (navigate to Plants screen)
- Care Guide

#### Plant lists
- Needs attention list (up to 3)
- Recently watered list (up to 3)
- Empty state when no plants

#### Pull to refresh
- `RefreshControl` updates stats and content

### 2. Plant Details / List
- Accessed via `onPress` card
- Watering action triggers state update and success/error alert

### 3. Shared mobile components
- `StatsCard` simple card with icon, value, label
- `PlantCard` per-plant tile

---

## Notes

- Local storage used for offline persistence.
- `useDashboard`, `usePlants`, `useAuth` hooks provide state management and actions.
- Charts and graphs on web are rendered via custom SVG/chart components (Analytics pages).

