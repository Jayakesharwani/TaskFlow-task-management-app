# TaskFlow — Task Management Application

TaskFlow is a full-stack task management application that allows users to securely register, log in, and manage their personal tasks. Each user's tasks are private and accessible only to the authenticated user.

The application provides JWT-based authentication, complete task CRUD operations, task status and priority management, due dates, locations, and attachment support.

## Live Application

* Frontend: [Add your Vercel URL here]
* Backend API: [Add your Render URL here]

## Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Protected task routes
* Authenticated user-specific task access
* Secure password handling
* Logout functionality

### Task Management

* Create tasks
* View tasks
* View individual task details
* Update tasks
* Delete tasks
* Task status management
* Task priority management
* Due date support
* Location/city support
* Attachment support

### Security

* JWT authentication
* Protected API endpoints
* User-specific task ownership
* Users cannot access another user's private tasks
* Passwords are stored securely using hashing
* Environment variables are used for sensitive configuration

### Frontend

* Responsive Next.js interface
* Registration page
* Login page
* Dashboard
* Task creation and editing
* Task status and priority controls
* Task deletion
* Authentication-aware UI

## Technology Stack

### Frontend

* Next.js 16
* React
* TypeScript
* HTML5
* CSS
* JavaScript

### Backend

* NestJS
* TypeScript
* REST API
* JWT
* Passport / authentication middleware

### Database

* PostgreSQL
* Prisma ORM

### Development & Deployment

* Git
* GitHub
* Postman
* Vercel — Frontend deployment
* Render — Backend deployment
* PostgreSQL — Production database

## Application Architecture

```text
                    ┌──────────────────────┐
                    │      User / Browser  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Next.js Frontend   │
                    │       Vercel         │
                    └──────────┬───────────┘
                               │
                         REST API / JWT
                               │
                               ▼
                    ┌──────────────────────┐
                    │    NestJS Backend    │
                    │        Render        │
                    └──────────┬───────────┘
                               │
                         Prisma ORM
                               │
                               ▼
                    ┌──────────────────────┐
                    │     PostgreSQL DB     │
                    └──────────────────────┘
```

## Project Structure

```text
taskflow/
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── tasks/
│   │   ├── prisma/
│   │   └── ...
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── dashboard/
│   │       ├── login/
│   │       ├── register/
│   │       └── ...
│   ├── package.json
│   ├── next.config.ts
│   └── ...
│
└── README.md
```

## Environment Variables

### Backend

Create a `.env` file inside the `backend` directory.

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

Use your actual production environment configuration in Render.

Never commit real secrets, passwords, database credentials, or API keys to GitHub.

### Frontend

Create a `.env.local` file inside the `frontend` directory for local development.

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production, configure the variable in Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-render-backend-url
```

## Local Development

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* PostgreSQL
* Git

### Clone the repository

```bash
git clone <your-github-repository-url>
cd taskflow
```

## Backend Setup

```bash
cd backend
npm install
```

Configure the backend `.env` file.

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run start:dev
```

The backend will run on the configured local port.

## Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

Open the application in the browser at:

```text
http://localhost:3000
```

## Production Deployment

### Frontend

The Next.js frontend is deployed using Vercel.

The Vercel project uses:

```text
Root Directory: frontend
Build Command: npm run build
Framework: Next.js
```

### Backend

The NestJS backend is deployed using Render.

The backend connects to the PostgreSQL production database through Prisma.

## Authentication Flow

1. User registers using `/auth/register`.
2. Backend validates the registration data.
3. Password is securely hashed.
4. User account is stored in PostgreSQL.
5. Backend returns an authentication token.
6. User logs in through `/auth/login`.
7. JWT authentication is used for protected task requests.
8. Backend identifies the authenticated user from the JWT.
9. Task queries are restricted to the authenticated user's records.

## Task Privacy

Task records are associated with the authenticated user.

Every protected task operation uses the authenticated user's identity to ensure that users can only access and modify their own tasks.

This prevents one user from viewing, updating, or deleting another user's tasks.

## API Documentation

Detailed API documentation is available in:

```text
docs/API.md
```

The documentation covers:

* Authentication endpoints
* Task CRUD endpoints
* Request bodies
* Authentication headers
* Response examples
* Error responses

## Testing

The REST API can be tested using Postman.

Recommended testing flow:

1. Register a user.
2. Login.
3. Copy the returned JWT.
4. Add the JWT to the Authorization header.
5. Create a task.
6. Retrieve tasks.
7. Update a task.
8. Delete a task.
9. Verify unauthorized requests are rejected.
10. Verify users cannot access another user's tasks.

Authorization header:

```text
Authorization: Bearer <JWT_TOKEN>
```

## Build

### Frontend

```bash
cd frontend
npm run build
```

### Backend

```bash
cd backend
npm run build
```

## Security Considerations

* Passwords are never stored as plain text.
* JWT secrets are stored through environment variables.
* Database credentials are not committed to source control.
* Protected task routes require authentication.
* Task access is restricted by user ownership.
* Production secrets are configured through deployment-platform environment variables.

## Future Improvements

Possible future enhancements include:

* Task search
* Filtering and sorting
* Pagination
* Task categories/tags
* Email notifications
* Calendar integration
* Cloud object storage for attachments
* Refresh-token authentication
* Role-based administration
* Automated CI/CD testing

## Author

**Jaya Kesharwani**

Full-Stack Developer

## License

This project was developed as a full-stack technical assignment and is intended for demonstration and evaluation purposes.
