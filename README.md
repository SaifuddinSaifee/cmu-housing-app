# CMU-SV Housing App

The CMU-SV Housing App is a comprehensive solution designed to address the housing challenges faced by students at Carnegie Mellon University's Silicon Valley campus. This application streamlines the process of finding suitable accommodation by connecting students with landlords and providing an efficient platform for managing housing listings.

### Key Features

- User authentication for students, landlords, and administrators
- Apartment listing creation and management for landlords
- Advanced search and filter options for students to find suitable housing
- Ability for students to save and track favorite listings
- Admin panel for overseeing all users and listings
- Detailed profiles for students to specify their preferences and requirements

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- JWT for authentication

### Frontend (Planned)
- React.js
- Redux for state management
- Axios for API requests

## Project Setup

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB (v4 or later)

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/cmu-sv-housing-app.git
   cd cmu-sv-housing-app
   ```

2. Navigate to the server directory:
   ```
   cd server
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the server directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=90d
   ```
   Replace `your_mongodb_connection_string` with your actual MongoDB connection string and `your_jwt_secret` with a secure random string.

5. Start the server:
   ```
   npm run dev
   ```

The server should now be running on `http://localhost:5000`.

### API Documentation

Once the server is running, you can access the Swagger API documentation at `http://localhost:5000/api-docs`.

### Frontend Setup (To be implemented)

1. Navigate to the client directory:
   ```
   cd ../client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The frontend development server should now be running on `http://localhost:3000`.

## Project Structure

```
cmu-sv-housing-app/
├── server/ (backend)
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── client/ (frontend)
└── README.md
```

## API Endpoints

- `/api/students` - Student-related operations
- `/api/landlords` - Landlord-related operations
- `/api/apartments` - Apartment listing operations
- `/api/admin` - Admin operations

For detailed API documentation, please refer to the Swagger documentation available at `/api-docs` when the server is running.

## Acknowledgments

- Mustafa Saifee for the project idea, innovation, idea, and feedback.
- Carnegie Mellon University Silicon Valley campus for inspiring this project
