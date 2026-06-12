# Am Able - AI-Powered Sign Language Translation Platform

A modern, scalable, production-ready web platform that helps deaf and hard-of-hearing users communicate through AI-powered sign language translation and accessibility tools.

## 🚀 Features

### Core Features
- **Sign to Text Translation**: Real-time hand gesture recognition powered by AI for instant translation
- **Text to Sign Conversion**: Convert written text into animated sign language demonstrations
- **Voice to Sign Translation**: Speech recognition that translates spoken words into sign language
- **Translation History**: Track and review all your past translations
- **Saved Items**: Save important translations for quick access

### Accessibility Features
- **High Contrast Mode**: Enhanced contrast for better visibility
- **Large Text**: Increased text size for better readability
- **Reduced Motion**: Minimize animations for comfort
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Screen Reader Optimization**: Optimized for screen readers

### Admin Features
- **User Management**: Manage platform users and roles
- **Reports Management**: Review and handle user reports
- **Analytics Dashboard**: Platform statistics and activity monitoring
- **AI Logs**: Track AI predictions and system performance

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Handling**: TanStack Query
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Validation**: Zod

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with refresh tokens
- **API Documentation**: Swagger
- **Security**: Helmet, CORS, rate limiting, validation pipes

### AI/Computer Vision
- **Hand Tracking**: MediaPipe Hands (placeholder implementation)
- **Speech Recognition**: Web Speech API
- **Text-to-Speech**: Web Speech API

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB 6+
- npm or yarn or pnpm

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/amable.git
cd amable
```

### 2. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 3. Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb://localhost:27017/amable
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

#### Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Using MongoDB locally
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Run the Application

#### Start Backend
```bash
cd backend
npm run start:dev
```

The backend will run on `http://localhost:3001`

#### Start Frontend
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Swagger Documentation**: http://localhost:3001/api/docs

## 📁 Project Structure

```
amable/
├── backend/
│   ├── src/
│   │   ├── admin/           # Admin module
│   │   ├── ai/              # AI/Computer Vision module
│   │   ├── auth/            # Authentication module
│   │   ├── database/        # Database configuration
│   │   ├── translations/    # Translations module
│   │   ├── users/           # Users module
│   │   ├── app.module.ts    # Root module
│   │   └── main.ts          # Application entry point
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── dashboard/   # User dashboard pages
│   │   │   ├── login/       # Authentication pages
│   │   │   └── page.tsx     # Landing page
│   │   ├── components/      # Reusable components
│   │   │   ├── accessibility/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── lib/             # Utility functions
│   │   └── store/           # Zustand stores
│   ├── .env.local           # Environment variables
│   └── package.json
└── README.md
```

## 🔐 Authentication

The platform uses JWT-based authentication with refresh tokens:

1. **Registration**: Users can register with email and password
2. **Login**: Users receive access and refresh tokens
3. **Token Refresh**: Access tokens are automatically refreshed when expired
4. **Role-Based Access**: Admin users have access to admin dashboard

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/accessibility` - Update accessibility preferences

### Translations
- `POST /api/translations` - Create new translation
- `GET /api/translations` - Get all translations
- `GET /api/translations/history` - Get translation history
- `GET /api/translations/saved` - Get saved translations
- `GET /api/translations/stats` - Get translation statistics
- `POST /api/translations/:id/save` - Save translation
- `DELETE /api/translations/:id/save` - Unsave translation
- `DELETE /api/translations/:id` - Delete translation

### AI
- `POST /api/ai/predict` - Predict gesture from data
- `GET /api/ai/logs` - Get AI logs
- `GET /api/ai/stats` - Get AI statistics

### Admin
- `GET /api/admin/stats` - Get admin statistics
- `GET /api/admin/reports` - Get all reports
- `POST /api/admin/reports` - Create new report
- `PUT /api/admin/reports/:id/status` - Update report status

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
4. Deploy

### Backend Deployment (Railway/Render)

1. Push your code to GitHub
2. Import project in Railway/Render
3. Set environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret
   - `JWT_REFRESH_SECRET`: Your refresh token secret
   - `PORT`: 3001
   - `FRONTEND_URL`: Your frontend URL
   - `NODE_ENV`: production
4. Deploy

### MongoDB Deployment (MongoDB Atlas)

1. Create a free account on MongoDB Atlas
2. Create a new cluster
3. Get your connection string
4. Update your backend environment variables

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 📝 Development Notes

### AI Integration
The current implementation includes placeholder AI integration. To integrate real MediaPipe Hands:

1. Install MediaPipe dependencies:
```bash
npm install @mediapipe/hands @mediapipe/camera_utils @mediapipe/drawing_utils
```

2. Update the translation studio to use MediaPipe for real-time hand tracking

### Adding New Features
- Follow the existing code structure
- Use TypeScript for type safety
- Add proper error handling
- Update API documentation
- Test thoroughly before committing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- MediaPipe for hand tracking library
- NestJS for the backend framework
- Next.js for the frontend framework
- The deaf and hard-of-hearing community for inspiration

## 📞 Support

For support, email hello@amable.com or open an issue in the repository.

---

Built with ❤️ for accessibility and inclusion.
