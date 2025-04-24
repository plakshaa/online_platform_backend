# SkillUp - Online Course Platform Backend

A robust backend system for an online learning platform built with Node.js, Express.js, and MySQL.

## Features

- 👤 User Authentication (JWT)
- 👨‍🏫 Role-based Access Control (Admin/Student)
- 📚 Course Management
- ✍️ Enrollment System
- 📊 Progress Tracking
- 🔒 Secure Password Handling
- 🎯 RESTful API Architecture

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/skillup.git
cd skillup
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=skillup_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
```

4. Set up the database:
```bash
mysql -u root -p < src/config/schema.sql
```

5. Start the server:
```bash
npm start
```

## API Documentation

### Authentication

#### Register User
- **POST** `/api/auth/signup`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "role": "student"  // Optional, defaults to "student"
}
```

#### Login
- **POST** `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

### Courses

#### Get All Courses
- **GET** `/api/courses`

#### Get Single Course
- **GET** `/api/courses/:id`

#### Create Course (Admin only)
- **POST** `/api/courses`
```json
{
  "title": "Introduction to JavaScript",
  "description": "Learn the basics of JavaScript programming"
}
```

#### Update Course (Admin only)
- **PUT** `/api/courses/:id`
```json
{
  "title": "Updated Course Title",
  "description": "Updated course description"
}
```

#### Delete Course (Admin only)
- **DELETE** `/api/courses/:id`

### Enrollments

#### Enroll in Course
- **POST** `/api/enrollments/:courseId`

#### Get My Enrolled Courses
- **GET** `/api/enrollments/my-courses`

#### Unenroll from Course
- **DELETE** `/api/enrollments/:courseId`

### Progress

#### Mark Lesson as Completed
- **POST** `/api/progress/:lessonId`

#### Get Course Progress
- **GET** `/api/progress/:courseId`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer your_jwt_token
```

## Error Handling

The API returns appropriate HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Role-based access control
- SQL injection protection
- Input validation
- CORS enabled

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
