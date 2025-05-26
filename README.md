# Wellfino Pharmaceutical Website

A modern pharmaceutical website built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Project Structure
```
wellfino/
├── client/               # React frontend
│   ├── public/          # Static files
│   └── src/             # React source code
├── server/              # Node.js backend
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   └── utils/         # Utility functions
└── package.json        # Project dependencies
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the server directory with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wellfino
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup
1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the client directory with:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

## Features
- User authentication (JWT)
- Product catalog
- Responsive design
- Modern UI/UX
- Secure API endpoints
- MongoDB integration

## Technologies Used
- MongoDB
- Express.js
- React.js
- Node.js
- JWT for authentication
- Mongoose ODM
- React Router
- Material-UI
- Axios 