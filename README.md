# Foresight - AI-Powered Decision Guidance Platform

A comprehensive life decision simulator that helps users visualize potential outcomes before making important choices. Features a multi-agent AI advisory board providing personalized guidance from multiple perspectives.

![Foresight Screenshot](https://via.placeholder.com/800x400/1a1a2e/ffffff?text=Foresight+AI+Decision+Platform)

## Features

### AI Advisory Board
- **Aria (Risk Analyst)** - Identifies potential risks and mitigation strategies
- **Blaze (Opportunity Coach)** - Highlights growth opportunities and upside potential
- **Cora (Financial Advisor)** - Analyzes cost-benefit and financial implications
- **Dawn (Life Balance Mentor)** - Ensures wellbeing and work-life balance considerations

### Core Capabilities
- **Multi-Agent Analysis** - Get consensus and divergent viewpoints on your decisions
- **AI Chat Interface** - Have conversations with individual advisors
- **Timeline Simulations** - See projections for 3 months, 1 year, and 5 years
- **Action Plan** - Track tasks, milestones, and resources
- **Report Generation** - Export comprehensive decision analysis
- **User Authentication** - Save decisions and track progress

## Tech Stack

### Frontend
- React 19.2
- TypeScript
- Vite 7.2.4
- Tailwind CSS
- GSAP (animations)
- Radix UI (components)
- Recharts (data visualization)

### Backend
- Node.js
- Express
- TypeScript
- OpenAI GPT-4o-mini integration

### Database & Auth
- Supabase PostgreSQL
- JWT Authentication
- Row Level Security (RLS)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API key (optional - runs in mock mode without)
- Supabase account (optional - uses localStorage fallback)

### Installation

1. Clone the repository
```bash
git clone https://github.com/codeRueben/Foresight---AI-Powered-Decision-Guidance-Platform.git
cd Foresight---AI-Powered-Decision-Guidance-Platform
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd api
npm install
cd ..
```

4. Set up environment variables

Create `.env` in the root directory:
```env
VITE_API_URL=http://localhost:3001/api
```

Create `api/.env`:
```env
PORT=3001
OPENAI_API_KEY=your_openai_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
```

### Running the Application

1. Start the backend server
```bash
cd api
npm run dev
```

2. In a new terminal, start the frontend
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

### Development Mode

The app works without API keys in development mode:
- AI responses use mock data
- Authentication uses localStorage
- All features are functional for testing

## Project Structure

```
.
├── src/                    # Frontend source
│   ├── components/         # React components
│   │   ├── ui/            # UI primitives
│   │   ├── SidePanel.tsx  # Navigation panel
│   │   ├── AIChat.tsx     # AI chat interface
│   │   └── ...
│   ├── sections/          # Page sections
│   │   ├── OrbHero.tsx    # Landing section
│   │   ├── DecisionInput.tsx
│   │   ├── AgentConsultation.tsx
│   │   ├── Simulation*.tsx
│   │   └── ...
│   ├── context/           # React contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities
│   └── types/             # TypeScript types
├── api/                    # Backend source
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── types/         # TypeScript types
│   └── package.json
└── package.json
```

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your GitHub repo to Vercel or Netlify
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

### Backend (Railway/Render/Heroku)
1. Deploy the `api` folder as a separate service
2. Add environment variables
3. Update frontend `VITE_API_URL` to point to deployed backend

### Database (Supabase)
1. Create a new Supabase project
2. Run the SQL schema (see `api/supabase/schema.sql`)
3. Enable Row Level Security
4. Add connection details to backend env

## API Endpoints

### Agents
- `POST /api/agents/analyze` - Get multi-agent analysis
- `POST /api/agents/chat` - Chat with specific agent
- `GET /api/agents/list` - List available agents

### Decisions
- `POST /api/decisions` - Save a decision
- `GET /api/decisions` - Get user's decisions
- `GET /api/decisions/:id` - Get specific decision

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- OpenAI for the GPT API
- Supabase for the backend infrastructure
- The React and Vite communities for excellent tools
