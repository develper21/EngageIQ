# Social Media Analytics Dashboard

A comprehensive data-driven content strategy optimizer that helps creators, marketers, and businesses analyze their social media performance across multiple platforms.

## 🚀 Features

### Core Features
- **Multi-Platform Integration**: Connect Instagram, YouTube, and X/Twitter accounts
- **Content Performance Analysis**: Detailed metrics for Reels, Posts, Videos, and Tweets
- **Best Time & Frequency Analyzer**: AI-powered recommendations for optimal posting schedules
- **AI Chat Assistant**: Natural language queries about your social media performance
- **Reports & Export**: Generate weekly/monthly reports with PDF/Excel export

### Advanced Features
- **Sentiment Analysis**: Analyze comment sentiment across platforms
- **Viral Content Prediction**: AI-powered prediction of content virality potential
- **Competitor Comparison**: Compare performance with competitors
- **Real-time Analytics**: Live dashboard with interactive charts

## 🛠 Tech Stack

### Frontend
- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL
- **JWT** for authentication
- **OpenAI API** for AI features

### Database
- **PostgreSQL** with Prisma ORM
- **Redis** for caching (optional)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd social-media-dashboard
```

2. **Install dependencies**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

3. **Environment Setup**
```bash
# Backend environment
cd backend
cp .env.example .env
# Fill in your API keys and database URL
```

4. **Database Setup**
```bash
cd backend
npx prisma generate
npx prisma db push
```

5. **Start the application**
```bash
# Start backend (terminal 1)
cd backend
npm run dev

# Start frontend (terminal 2)
cd ..
npm run dev
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile

### Analytics
- `GET /api/analytics/overview` - Dashboard overview
- `GET /api/analytics/engagement-trend` - Engagement trends
- `GET /api/analytics/content-performance` - Content analysis
- `GET /api/analytics/best-time` - Best posting times

### Social Media Integration
- `POST /api/social/connect/instagram` - Connect Instagram
- `POST /api/social/connect/youtube` - Connect YouTube
- `POST /api/social/connect/twitter` - Connect Twitter
- `GET /api/social/accounts` - Get connected accounts

### AI Features
- `POST /api/ai/chat` - AI chat assistant
- `POST /api/ai/analyze-content` - Content analysis
- `POST /api/ai/generate-ideas` - Generate content ideas
- `POST /api/ai/sentiment-analysis` - Sentiment analysis

### Reports
- `POST /api/reports/generate` - Generate report
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id/export` - Export report

## 🎯 Usage

1. **Sign up** for an account
2. **Connect** your social media accounts
3. **View** your analytics dashboard
4. **Get insights** from AI assistant
5. **Generate reports** for sharing

## 📊 Dashboard Features

### Overview Tab
- Total engagement metrics
- Platform-wise performance
- Engagement trends
- Content type distribution
- Best posting times

### Content Tab
- Platform-specific metrics
- Top performing content
- Content recommendations
- Growth opportunities

### Insights Tab
- AI-powered recommendations
- Content strategy suggestions
- Growth opportunities analysis
- Performance predictions

### Reports Tab
- Weekly/Monthly reports
- Custom date range reports
- Export functionality
- Historical data

## 🔐 Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/social_media_dashboard"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Social Media API Keys
INSTAGRAM_CLIENT_ID="your-instagram-client-id"
INSTAGRAM_CLIENT_SECRET="your-instagram-client-secret"
YOUTUBE_API_KEY="your-youtube-api-key"
TWITTER_API_KEY="your-twitter-api-key"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Heroku/Railway)
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🎨 Design System

The dashboard follows a modern, clean design with:
- **Primary Color**: Blue (#3B82F6)
- **Secondary Colors**: Platform-specific (Instagram Pink, YouTube Red, Twitter Blue)
- **Typography**: Geist Sans font family
- **Spacing**: Tailwind CSS spacing system
- **Components**: Reusable card-based layout

## 📈 Performance

- **Lighthouse Score**: 95+
- **Page Load**: < 2 seconds
- **Mobile Responsive**: Fully responsive design
- **Accessibility**: WCAG 2.1 compliant

## 🔮 Future Features

- [ ] TikTok integration
- [ ] LinkedIn analytics
- [ ] Advanced competitor analysis
- [ ] Automated posting scheduler
- [ ] Mobile app
- [ ] Team collaboration features
