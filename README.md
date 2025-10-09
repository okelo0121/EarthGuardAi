# EarthGuard AI - Environmental Intelligence System

A comprehensive AI-powered platform that uses satellite data, GIS mapping, and machine learning to monitor, predict, and protect Earth's ecosystems in real-time.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Overview

EarthGuard AI empowers individuals, researchers, and governments to understand environmental changes, respond faster to ecological threats, and promote sustainable practices through data-driven insights and predictive analytics.

## Features

### Interactive GIS Map Dashboard
- Real-time visualization of global environmental data
- Color-coded severity indicators (critical, high, medium, low)
- Multiple data layers: deforestation, air quality, water quality, temperature
- Clickable markers with detailed information
- Geographic filtering and search capabilities

### Analytics & Insights
- Real-time environmental metrics and trends
- Interactive charts showing 7-day alert patterns
- Severity distribution analysis
- Data type breakdowns with visual representations
- Key performance indicators dashboard

### AI-Powered Predictions
- Machine learning forecasts for environmental events
- Drought, flood, wildfire, and pollution surge predictions
- Probability scores and confidence ratings
- Impact level assessments
- Actionable recommendations for each prediction
- Model transparency with algorithm details

### Community Reporting
- Submit environmental observations from anywhere
- GPS location tracking
- Photo upload support (ready for integration)
- Severity classification
- AI verification of reports
- Community upvoting system
- Status tracking: pending, verified, investigating, resolved

### AI Environmental Analyst
- Natural language chatbot for environmental questions
- Explains complex environmental data in simple terms
- Provides insights on:
  - Deforestation and land-use changes
  - Air quality and pollution levels
  - Water resources and drought prediction
  - Climate change impacts
  - Personal action recommendations
- Context-aware responses

### User Impact Dashboard
- Track personal environmental contributions
- Impact scoring system with gamification
- Achievement badges and milestones
- Activity history and timeline
- Role-based profiles (Citizen, Researcher, Activist, Policy Maker)
- Community leaderboards (coming soon)

## Technology Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Leaflet** - Interactive maps
- **Recharts** - Data visualizations
- **Lucide React** - Icon library

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database with PostGIS
  - Authentication and user management
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Edge Functions for AI processing

### Data & APIs
- NASA EarthData (satellite imagery)
- Sentinel Hub (remote sensing)
- Google Earth Engine API ready
- Custom ML models for predictions

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd earthguard-ai
```

2. Install dependencies
```bash
npm install
```

3. Environment Setup

The Supabase environment variables are already configured in your `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. Database Setup

The database migrations have already been applied. Your database includes:
- Environmental data tables
- Community reports system
- Predictions and forecasts
- User profiles and actions
- AI insights storage

5. Start Development Server
```bash
npm run dev
```

6. Build for Production
```bash
npm run build
```

## Database Schema

### Core Tables

**environmental_data**
- Stores satellite and sensor data
- Geographic points with severity levels
- Flexible metrics in JSONB format
- Source tracking and confidence scores

**community_reports**
- User-submitted observations
- Location-based reporting
- AI verification status
- Community engagement (upvotes)

**predictions**
- ML-generated forecasts
- Probability and confidence scores
- Impact assessments
- Recommendations

**user_profiles**
- Extended user information
- Role management
- Impact scoring
- Notification preferences

**user_actions**
- Activity tracking
- Gamification points
- Contribution history

**ai_insights**
- Generated analysis summaries
- Trend reports
- Risk assessments

## Security

### Row Level Security (RLS)
All tables implement comprehensive RLS policies:
- Environmental data is publicly readable (transparency)
- Users can only modify their own reports
- Private user data protected by authentication
- Service role for system operations

### Authentication
- Email/password authentication via Supabase
- Secure session management
- JWT-based authorization
- Protected API endpoints

## API Endpoints

### Edge Functions

**ai-analyst**
- POST `/functions/v1/ai-analyst`
- Processes natural language queries
- Returns environmental insights
- Requires authentication

## Sample Data

The system includes pre-populated sample data:
- 10 environmental monitoring points across global hotspots
- 6 predictive forecasts for various events
- 4 AI-generated insights and trends
- Real-world scenarios for demonstration

## Contributing

We welcome contributions to EarthGuard AI:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Roadmap

### Phase 1 (Current)
- Core monitoring and visualization
- AI chatbot integration
- Community reporting
- Basic predictions

### Phase 2 (Planned)
- Real-time satellite data integration
- Advanced ML models
- Mobile application
- Photo upload and analysis
- Social sharing features

### Phase 3 (Future)
- Government API integrations
- Custom alerting system
- Collaborative research tools
- Export and reporting features
- Multi-language support

## Environmental Impact

### UN Sustainable Development Goals
This project supports:
- **SDG 13**: Climate Action
- **SDG 15**: Life on Land
- **SDG 6**: Clean Water and Sanitation
- **SDG 11**: Sustainable Cities and Communities

### Use Cases
- Early warning systems for natural disasters
- Policy decision support with data
- Research and academic studies
- Community environmental activism
- Corporate sustainability tracking
- Educational awareness programs

## Performance

- Fast initial load with code splitting
- Optimized map rendering
- Efficient data queries with indexes
- Real-time updates via Supabase subscriptions
- Production build under 250KB (gzipped)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - see LICENSE file for details

## Acknowledgments

- NASA for EarthData APIs
- ESA for Sentinel satellite data
- OpenStreetMap contributors
- Supabase team for backend infrastructure
- Open source community

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact the development team
- Join our community discussions

## Demo Credentials

To explore the platform, create an account through the sign-up form. Sample environmental data is pre-loaded for demonstration.

---

**Built with purpose. Monitoring Earth, Protecting our Future.**
