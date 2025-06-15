# CollabZone - Intra-College Event Management System

A full-stack web application designed to connect multiple colleges and manage inter-college events. The platform allows colleges to register, post events, and users can explore and register for events across institutions.

## Features

### Public Features
- **Browse Colleges**: Explore colleges and their upcoming events
- **Event Discovery**: View detailed event information with registration capabilities
- **Event Registration**: Register for events with integrated payment support
- **Social Feed**: Community posts and announcements
- **Dark/Light Theme**: Toggle between themes with system preference detection

### College Admin Features
- **College Dashboard**: Overview of events and registrations
- **Event Management**: Create, edit, and delete events
- **Registration Management**: View and export event registrations
- **Automatic Approval**: Colleges are auto-approved upon registration

### Super Admin Features
- **Platform Overview**: Monitor all colleges, events, and users
- **Event Moderation**: View and manage all platform events
- **Feed Moderation**: Review and approve community posts
- **User Management**: View platform users and activity

## Tech Stack

### Frontend
- **React 18** with JavaScript
- **React Router DOM** for routing
- **Tailwind CSS** for styling
- **Axios** for API requests

### Backend
- **Node.js** with Express.js
- **JavaScript ES Modules**
- **CORS** enabled for cross-origin requests

### Development
- **Vite** for fast development and building
- **Hot Module Replacement** for development efficiency

## Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable components (Navbar, Footer, Cards)
│   │   ├── pages/          # Public pages (Home, Colleges, Events, etc.)
│   │   ├── college-admin/  # College admin interface
│   │   ├── admin/          # Super admin interface
│   │   └── assets/         # Static assets
├── server/                 # Express.js backend
├── uploads/                # File upload directory
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collabzone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Demo Credentials

### College Admin
- **Email**: admin@techuni.edu
- **Password**: password123

### Super Admin
- **Username**: admin
- **Password**: admin123

## API Endpoints

### Public Routes
- `GET /api/colleges` - Get all colleges
- `GET /api/colleges/:id` - Get college details with events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/registrations` - Register for an event
- `GET /api/feed` - Get approved feed posts
- `POST /api/feed` - Create new feed post

### College Admin Routes
- `POST /api/college/login` - College admin login
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/:id/registrations` - Get event registrations

### Super Admin Routes
- `POST /api/admin/login` - Super admin login
- `GET /api/admin/events` - Get all events
- `GET /api/admin/feed` - Get all feed posts
- `GET /api/users` - Get all users

## Development Features

### VS Code Compatibility
- Configured for Windows 10 development
- ESLint and Prettier support
- IntelliSense for JavaScript and React

### Hot Reload
- Instant refresh on file changes
- Fast development workflow with Vite

### Responsive Design
- Mobile-first approach
- Tailwind CSS utilities
- Dark mode support

## Environment Configuration

### Development
- Server runs on port 5000
- Client runs on port 3000
- Hot reload enabled

### Production
- Built assets served from Express
- Optimized bundle with Vite
- Static file serving

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: support@collabzone.com
- Phone: +91 1800-123-4567

---

Built with ❤️ for inter-college collaboration