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
Create a `.env` file in the backend directory with:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Install Frontend Dependencies:
```bash
cd ../frontend
npm install
```

5. Run the Application:

Backend (from backend directory):
```bash
npm run dev
```

Frontend (from frontend directory):
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

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
