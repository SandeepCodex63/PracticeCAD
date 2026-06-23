# PracticeCAD - Quiz Application

A full-stack web application for conducting online quizzes with real-time analytics, leaderboards, and user authentication.

## 🎯 Features

- **User Authentication**
  - User registration and login with email verification
  - OTP-based password reset functionality
  - Secure session management with JWT tokens

- **Quiz Management**
  - Create, edit, and delete quizzes
  - Support for multiple quiz formats
  - Image upload and display capabilities
  - Quiz scheduling and availability management

- **Quiz Taking Experience**
  - Interactive quiz interface with zoom capability
  - Real-time timer for timed quizzes
  - Instant feedback on answers
  - Progress tracking

- **Analytics & Leaderboards**
  - Comprehensive user performance analytics
  - Global leaderboard rankings
  - Detailed attempt history and statistics
  - Badge system for achievements

- **Admin Dashboard**
  - Admin-only access controls
  - Quiz creation and management interface
  - User management
  - Analytics overview
  - Content moderation tools

- **UI/UX Features**
  - Dark/Light theme toggle
  - Responsive design for all devices
  - Intuitive navigation
  - Accessibility support

## 🛠 Tech Stack

### Frontend
- **React** 18+ - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **CSS3** - Styling with dark theme support

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Cloudinary** - Image storage and management
- **Nodemailer** - Email service
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Cloudinary account (for image uploads)
- Gmail account (for email notifications)
- Google OAuth credentials (optional, for social login)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/SandeepCodex63/PracticeCAD.git
cd PracticeCAD
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

## ⚙️ Configuration

### Backend Setup (server/.env)
Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/practiceCAD

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Service
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
```

### Frontend Setup (client/.env)
Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=PracticeCAD
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173` (frontend) and backend at `http://localhost:5000`.

### Production Build

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

## 📁 Project Structure

```
PracticeCAD/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── layouts/            # Layout wrappers
│   │   ├── routes/             # Routing configuration
│   │   ├── services/           # API services
│   │   ├── context/            # React context (Auth, Theme)
│   │   ├── hooks/              # Custom React hooks
│   │   └── App.jsx             # Root component
│   ├── vite.config.js          # Vite configuration
│   └── package.json
│
├── server/                      # Express backend
│   ├── controllers/            # Route handlers
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware
│   ├── services/               # Business logic
│   ├── config/                 # Configuration files
│   ├── utils/                  # Utility functions
│   ├── uploads/                # Upload directory
│   ├── app.js                  # Express app setup
│   ├── server.js               # Server entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🔐 Security Considerations

- All sensitive environment variables are stored in `.env` files (not tracked in git)
- Passwords are hashed using bcryptjs before storage
- JWT tokens are used for secure API authentication
- Admin routes are protected with middleware
- CORS is configured for secure cross-origin requests
- Image uploads are handled through Cloudinary for security

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get quiz details
- `POST /api/quizzes` - Create quiz (Admin)
- `PUT /api/quizzes/:id` - Update quiz (Admin)
- `DELETE /api/quizzes/:id` - Delete quiz (Admin)

### Attempts
- `POST /api/attempts` - Submit quiz attempt
- `GET /api/attempts/:userId` - Get user's attempts
- `GET /api/attempts/:quizId/results` - Get quiz results

### Leaderboard
- `GET /api/leaderboard` - Get global leaderboard
- `GET /api/leaderboard/:quizId` - Get quiz-specific leaderboard

### Analytics
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/user/:userId` - Get user analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Author

**Sandeep Singh**
- GitHub: [@SandeepCodex63](https://github.com/SandeepCodex63)
- Email: 06389sandeepcool@gmail.com

## 🙏 Acknowledgments

- MongoDB for the database
- Cloudinary for image hosting
- Express.js community
- React ecosystem

## 📞 Support

For support, email 06389sandeepcool@gmail.com or open an issue on GitHub.

---

**Happy Quizzing! 🎓**
