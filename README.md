# **Authentication Service**

This project is a **rapid prototype** showcasing the potential of **TypeScript, Node.js, and Fastify** for building high-performance authentication services. The goal is to create a modular, testable, and scalable authentication system that efficiently handles user authentication and security.

## **Features & Functionality**

### **User Registration** (`POST /register`)
- Allows users to create an account.
- Requires `username`, `email`, and `password`.
- Validates input and ensures unique email/username.

### **User Login** (`POST /login`)
- Authenticates users using email and password.
- Returns an **access token** (short-lived) and a **refresh token** (long-lived).
- Tokens are signed using **JWT (RS256 encryption)**.

### **Refresh Token Handling** (`POST /refresh`)
- Allows users to obtain a new access token using a valid refresh token.
- **Old refresh tokens are invalidated upon use**.
- Each refresh token is uniquely generated to prevent replay attacks.

---

## **Remaining Features to Implement**

### **Password Change** (`POST /change-password`)
- Requires authentication via **JWT**.
- Users must provide **current password + new password**.
- **Invalidates all refresh tokens upon success**.

### **Logout** (`POST /logout`)
- Requires authentication via **JWT**.
- **Deletes user’s refresh token** from the database.

### **Password Reset** (`POST /forgot-password`, `POST /reset-password`)
- Users can request a **password reset link** via email.
- A **temporary reset token** is issued, allowing password change.
- Reset token expires after X minutes.

### **Email Verification** (`POST /verify-email`)
- Ensures users confirm their email before logging in.
- System sends a **verification email** after registration.
- Users click a link to verify their account.

### **Rate Limiting & Security Enhancements**
- **Rate limit login attempts** to prevent brute-force attacks.
- **Limit password change/reset requests** to prevent abuse.
- Implement **IP-based restrictions** for suspicious activities.

---

## **Tech Stack**
- **Node.js** & **TypeScript**
- **Fastify** (for high-performance HTTP handling)
- **Prisma** (PostgreSQL ORM & query builder)
- **JWT (RS256 encryption)** for secure authentication
- **Bcrypt** for password hashing
- **Jest & Supertest** for automated testing
- **Docker & Docker Compose** for containerized development

## **Setup & Running the Project**

### **Clone the Repository**
```bash
git clone <repo_url>
cd auth-service
```

### **Install Dependencies**
```bash
npm install
```

### **Start the Development Server**
```bash
docker compose up --build
```

### **Run Tests**
```bash
make tests
```