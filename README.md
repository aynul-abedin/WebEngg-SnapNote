# SnapNote

SnapNote is a full-stack web application that allows users to create, manage, and share notes. Built with Next.js for the frontend and Node.js/Express for the backend, it provides a modern and responsive user experience.

## Features

- 🔐 User authentication (register/login)
- 📝 Create and edit notes
- 👤 User profiles
- 🔍 View and manage personal notes
- 🌐 Responsive design with Tailwind CSS

## Tech Stack

### Frontend
- **Next.js** - React framework for production
- **React** - JavaScript library for UI
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - Runtime environment
- **Express** - Web application framework
- **MongoDB** - Database (with Mongoose ODM)
- **JWT** - Authentication middleware
- **Bcrypt** - Password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running
- Git

### Installation

1. Clone the repository:
```bash
git clone git@github.com:aynul-abedin/WebEngg-SnapNote.git
cd WebEngg-SnapNote
```

2. Install Backend Dependencies:
```bash
cd backend
npm install
```

3. Configure Environment Variables:

Backend (.env):
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000  # For development
UPLOADS_DIR=./uploads
```

Frontend (.env):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000  # For development
# Use https://snapnote-backend-oypz.onrender.com for production
```

4. Install Frontend Dependencies:
```bash
cd ../frontend
npm install
```

5. Run the Application:

Development Mode:
```bash
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory)
npm run dev
```

Production Mode:
```bash
# Backend
npm run build
npm start

# Frontend
npm run build
npm start
```

Access Points:
- Development:
  - Frontend: http://localhost:3000
  - Backend API: http://localhost:5000
- Production:
  - Frontend: Your deployed URL
  - Backend API: https://snapnote-backend-oypz.onrender.com

## Project Structure

```
WebEngg-SnapNote/
├── backend/                # Backend server code
│   ├── server.js          # Entry point
│   └── package.json       # Backend dependencies
└── frontend/              # Frontend Next.js app
    ├── components/        # Reusable React components
    ├── context/          # React context providers
    ├── pages/            # Next.js pages
    ├── styles/           # Global styles
    ├── utils/            # Utility functions
    └── package.json      # Frontend dependencies
```

## Available Scripts

Backend:
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

Frontend:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Next.js Documentation
- Express.js Documentation
- Tailwind CSS Documentation
- MongoDB Documentation
