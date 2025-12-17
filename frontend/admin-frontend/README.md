# Admin Frontend

Frontend application for restaurant administration system.

## Features

- **User Management**: Create, edit, and manage users with role-based access control (Admin, Chef, Waiter)
- **Product Management**: Full CRUD operations for menu items with pricing and descriptions
- **Table Management**: Manage restaurant tables with real-time status updates (Available, Occupied, Reserved, Cleaning)
- **Configuration**: Restaurant settings including schedule, contact info, and preparation times
- **Orders Monitor**: View and track all orders with detailed information and status filters
- **Dashboard**: Overview with statistics and quick actions

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **Axios** for API communication
- **Tailwind CSS** for styling
- **Lucide React** for icons

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

## Configuration

Edit `.env` file:

```env
VITE_API_URL=http://localhost:4000/api
```

## Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
admin-frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── AdminLayout.tsx      # Main layout with sidebar
│   │   ├── ui/
│   │   │   ├── Button.tsx           # Reusable button component
│   │   │   ├── Card.tsx             # Card container
│   │   │   ├── Input.tsx            # Form input
│   │   │   ├── Modal.tsx            # Modal dialog
│   │   │   └── Table.tsx            # Generic table component
│   │   ├── LogoutButton.tsx         # Logout button
│   │   └── ProtectedRoute.tsx       # Route protection
│   ├── pages/
│   │   ├── LoginPage.tsx            # Login page
│   │   ├── DashboardPage.tsx        # Dashboard with stats
│   │   ├── UsersPage.tsx            # User management
│   │   ├── ProductsPage.tsx         # Product management
│   │   ├── TablesPage.tsx           # Table management
│   │   ├── ConfigPage.tsx           # Restaurant configuration
│   │   └── OrdersPage.tsx           # Orders monitor
│   ├── services/
│   │   └── api.ts                   # API client with interceptors
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   ├── App.tsx                      # Main app with routing
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
├── public/
├── .env                             # Environment variables
├── Dockerfile                       # Docker configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Tables
- `GET /tables` - Get all tables
- `GET /tables/:id` - Get table by ID
- `POST /tables` - Create table
- `PUT /tables/:id` - Update table
- `PATCH /tables/:id/status` - Update table status
- `DELETE /tables/:id` - Delete table

### Configuration
- `GET /config` - Get restaurant config
- `PUT /config` - Update config

### Orders
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID

## Authentication

The application uses JWT tokens for authentication. The token is stored in `localStorage` and automatically included in all API requests via Axios interceptors.

### Protected Routes

All routes under `/admin/*` are protected and require authentication. If the user is not authenticated, they will be redirected to the login page.

## User Roles

- **Admin**: Full access to all features
- **Chef**: Access to kitchen-related features (handled by different frontend)
- **Waiter**: Access to order creation (handled by different frontend)

## Docker

```bash
# Build image
docker build -t admin-frontend .

# Run container
docker run -p 5173:5173 admin-frontend
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:4000/api |

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
