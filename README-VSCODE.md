# CollabZone - VS Code Setup for Windows 10

## Prerequisites for Windows 10

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Install the LTS version

2. **VS Code**
   - Download from: https://code.visualstudio.com/

## Project Setup

1. **Clone/Open the project in VS Code**
   ```bash
   cd your-project-folder
   code .
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## Project Structure

```
CollabZone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── admin/          # Admin panel pages
│   │   ├── college-admin/  # College admin pages
│   │   └── api.js          # API client functions
│   └── index.html
├── server/                 # Express.js backend
│   ├── index.js           # Main server file
│   └── vite.js            # Vite integration
├── package.json           # Dependencies and scripts
└── vite.config.js         # Vite configuration
```

## Backend (Express.js + In-Memory Database)

The backend is currently using **in-memory storage** for development. When you're ready to integrate MongoDB:

1. Replace the in-memory arrays with MongoDB collections
2. Look for `// TODO:` comments in `server/index.js`
3. Install MongoDB driver: `npm install mongodb`

### Current Data Structure

- **Colleges**: University/college information
- **Events**: College events and competitions  
- **Registrations**: Student event registrations
- **Feed Posts**: Social media posts
- **Users**: User accounts

## API Endpoints

### Public API
- `GET /api/colleges` - List all colleges
- `GET /api/colleges/:id` - College details with events
- `GET /api/events` - List all events
- `GET /api/events/:id` - Event details
- `POST /api/registrations` - Register for event
- `GET /api/feed` - Social feed posts

### Authentication
- `POST /api/college/login` - College admin login
- `POST /api/admin/login` - System admin login

### Admin API
- `GET /api/admin/events` - Manage all events
- `GET /api/admin/feed` - Moderate feed posts
- `GET /api/users` - User management

## MongoDB Integration Guide

When ready to switch to MongoDB:

1. **Install MongoDB driver**
   ```bash
   npm install mongodb
   ```

2. **Create MongoDB connection** (replace in server/index.js)
   ```javascript
   import { MongoClient } from 'mongodb';
   
   const client = new MongoClient('mongodb://localhost:27017');
   const db = client.db('collabzone');
   ```

3. **Replace array operations** with MongoDB queries:
   - `colleges.find()` → `db.collection('colleges').find().toArray()`
   - `colleges.push()` → `db.collection('colleges').insertOne()`
   - `events.filter()` → `db.collection('events').find(query).toArray()`

## Running in VS Code

1. **Terminal**: Use VS Code's integrated terminal (Ctrl + `)
2. **Debugging**: Set breakpoints in server/index.js
3. **Extensions**: Install "ES6 String HTML" for better syntax highlighting

## Default Login Credentials

- **Admin**: username: `admin`, password: `admin123`
- **College**: Use any email from the colleges array

The project is now ready for development in VS Code on Windows 10!