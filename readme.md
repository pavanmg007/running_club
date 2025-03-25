# Running Club Manager

**Running Club Manager** is a private web application designed to manage running clubs—whether it’s a single exclusive club or an organization handling multiple clubs. It provides tools for club admins to onboard members, create running events (marathons), and track participation, all while ensuring privacy and club-specific control. Built with a multi-tenant architecture, each club operates in its own secure space, with the option to open events to other clubs if desired.

---

## Current Features

### Club Management

- **Multi-Tenant Design**: Each club has a unique `club_id`, keeping users, invitations, and events isolated.
- **Member Onboarding**: Admins can send bulk email invitations with unique codes for new members to join their club.
- **Roles**: Supports `admin` (manage club) and `member` (participate in events) roles.

### Event Management

- **Marathon Creation**: Admins create events with details like name, date, location, and categories (e.g., 5K, 10K).
- **Privacy Control**: Events are private by default (`is_private = true`), restricting them to club members. Admins can mark them open (`is_private = false`) for other clubs.
- **Categories**: Events can have multiple categories with prices, allowing flexible participation options.

### Participation

- **Event Signup**: Members register for marathons by choosing a category.
- **Privacy Enforcement**:
  - Private events: Only club members can participate and view participants.
  - Open events: Any authenticated user from any club can join and see participants.

### Security

- **Authentication**: JWT-based login ensures secure access.
- **Data Isolation**: Club-specific data is separated by `club_id`, ensuring exclusivity for private clubs or organizations.

### Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer (e.g., Gmail)
- **Dependencies**: `bcrypt`, `jsonwebtoken`, `nodemailer`, `uuid`, `pg`

---

## Detailed Features

### Authentication

- **Signup**: Users can sign up using an invitation code. The invitation code must match the email and must not be used before. The user is created and the invitation is marked as used. A JWT token is returned upon successful signup.
- **Login**: Users can log in using their email and password. A JWT token is returned upon successful login.

### Marathon Management

- **Create Marathon**: Admins can create marathons with details like name, date, location, registration link, and categories. The marathon can be marked as private or open.
- **Get All Marathons**: Users can get a list of all marathons. Club members can see both their club's marathons and open marathons from other clubs.
- **Get Marathon Participants**: Users can get a list of participants for a marathon. For private marathons, only club members can view participants.

### Participation

- **Participate in Marathon**: Users can register for a marathon by choosing a category. The system checks for privacy and club membership before allowing participation.

### Invitations

- **Create Invitation**: Admins can create invitations for new members by providing an email and a unique code.
- **Bulk Invite Members**: Admins can send bulk email invitations to new members. The system generates unique codes and sends emails asynchronously.

### Middleware

- **Authentication Middleware**: Verifies the JWT token and attaches the user information to the request.
- **Admin Middleware**: Ensures that the user has an admin role before allowing access to certain routes.

### Logging

- **Logger**: Uses Winston to log messages to the console and a file. The log format includes a timestamp, log level, and message.

### Database Schema

- **Clubs**: Stores club information.
- **Users**: Stores user information, including club membership and roles.
- **Invitations**: Stores invitation codes and their usage status.
- **Marathons**: Stores marathon information, including privacy settings.
- **Categories**: Stores categories for marathons.
- **Participations**: Stores user participation in marathons, including the chosen category.

---

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL

---

## API Endpoints

### Authentication

- **POST /api/auth/signup**: Sign up using an invitation code.
- **POST /api/auth/login**: Log in with email and password.

### Marathons

- **GET /api/marathons**: Get all marathons (private and open).
- **GET /api/marathons/:id/participants**: Get participants for a marathon.
- **POST /api/marathons/:id/participate**: Register for a marathon.

### Admin

- **POST /api/admin/marathons**: Create a new marathon.
- **POST /api/admin/invitations**: Create a new invitation.
- **POST /api/admin/invite-members**: Send bulk email invitations to new members.
