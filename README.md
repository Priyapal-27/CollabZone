# CollabZone - Intra-College Event Management System

A full-stack web application for managing college events, registrations, and social interactions between colleges.

## Tech Stack

- **Frontend**: React.js with JavaScript
- **Backend**: Node.js with Express.js
- **Database**: In-memory storage (ready for MongoDB integration)
- **Styling**: Tailwind CSS
- **Development**: Vite for bundling

## Features

### Public Features
- Browse colleges and their events
- View detailed event information
- Register for events
- Social feed for inter-college interactions
- Contact information

### College Admin Features
- College login and dashboard
- Create and manage events
- View event registrations
- Event analytics

### System Admin Features
- Admin dashboard
- Manage all events across colleges
- User management
- Content moderation

## Quick Start

### For Windows 10 with VS Code

1. **Prerequisites**
   - Install Node.js (v18+) from https://nodejs.org/
   - Install VS Code from https://code.visualstudio.com/

2. **Setup**
   ```bash
   git clone <repository-url>
   cd CollabZone
   npm install
   npm run dev
   ```

3. **Access the application**
   - Open http://localhost:5000
   - Admin login: username `admin`, password `admin123`
   - College login: Use any email from the sample colleges

## Development

### Project Structure
```
CollabZone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── admin/          # Admin panel pages
│   │   ├── college-admin/  # College admin pages
│   │   └── api.js          # API client functions
├── server/                 # Express.js backend
│   ├── index.js           # Main server file (with MongoDB comments)
│   └── vite.js            # Vite integration
├── .vscode/               # VS Code configuration
└── package.json           # Dependencies and scripts
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

### VS Code Setup
The project includes VS Code configuration for optimal development experience:
- JavaScript/React syntax highlighting
- Auto-formatting on save
- Debugging configuration
- Recommended extensions

## Database Integration

The application currently uses in-memory storage for development. All database operations are clearly marked with comments for easy MongoDB integration:

```javascript
// TEMPORARY: Using in-memory array
// MongoDB replacement: const colleges = await collegesCollection.find({}).toArray();
```

### MongoDB Integration Steps
1. Install MongoDB driver: `npm install mongodb`
2. Replace commented sections in `server/index.js`
3. Update connection string and collections
4. Remove temporary arrays and ID counters

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details