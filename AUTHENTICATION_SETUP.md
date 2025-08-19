# Authentication System Setup Guide

## Overview
This guide will help you set up and test the authentication system for both users and admins in the Zeynix website.

## Prerequisites
1. MongoDB installed and running locally, or a MongoDB Atlas connection string
2. Node.js and npm installed
3. The project dependencies installed (`npm install`)

## Environment Setup

### 1. Create Environment File
Create a `.env.local` file in the root directory with the following content:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/zeynix-website

# JWT Configuration (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### 2. MongoDB Setup
- **Local MongoDB**: Ensure MongoDB is running on port 27017
- **MongoDB Atlas**: Replace the MONGODB_URI with your Atlas connection string

## Testing the Authentication System

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test User Registration
1. Navigate to `/register`
2. Fill out the registration form with:
   - Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
   - Password: password123
   - Confirm Password: password123
3. Submit the form
4. You should be automatically logged in and redirected to the home page

### 3. Test User Login
1. Navigate to `/login`
2. Use the credentials from registration:
   - Email: test@example.com
   - Password: password123
3. Submit the form
4. You should be logged in and redirected to the home page

### 4. Test Admin Setup (First Time Only)
1. Navigate to `/admin/setup`
2. Fill out the admin setup form with:
   - Name: Admin User
   - Email: admin@example.com
   - Phone: 9876543210
   - Password: admin123
3. Submit the form
4. You should be logged in as admin and redirected to `/admin/dashboard`

### 5. Test Admin Login
1. Navigate to `/admin/login`
2. Use the admin credentials:
   - Email: admin@example.com
   - Password: admin123
3. Submit the form
4. You should be logged in as admin and redirected to `/admin/dashboard`

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
- Ensure MongoDB is running
- Check your MONGODB_URI in the environment file
- Verify network connectivity if using Atlas

#### 2. JWT Secret Issues
- Ensure JWT_SECRET is set in your environment file
- The system will use a fallback secret if not set, but this is not secure for production

#### 3. Registration Fails
- Check browser console for errors
- Verify all required fields are filled
- Ensure email and phone are unique

#### 4. Login Fails
- Verify the user exists in the database
- Check if the password matches
- Ensure the account is active

#### 5. Admin Access Issues
- Verify the user has role: 'admin' in the database
- Check if the admin account is active
- Ensure you're using the correct admin login endpoint

### Debug Steps

1. **Check Browser Console**: Look for JavaScript errors
2. **Check Network Tab**: Verify API calls are being made to correct endpoints
3. **Check Server Logs**: Look for backend errors in the terminal
4. **Verify Database**: Check if users are being created in MongoDB

## Security Notes

1. **JWT_SECRET**: Always use a strong, unique secret in production
2. **Password Requirements**: Passwords must be at least 6 characters
3. **Phone Validation**: Phone numbers must be exactly 10 digits
4. **Email Validation**: Emails must be in valid format
5. **Role-based Access**: Admin routes are protected and require admin role

## API Endpoints

### User Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Admin Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/setup` - First admin setup
- `POST /api/admin/dashboard` - Get admin dashboard data

## Database Schema

### User Model
```typescript
{
  name: string (required, max 50 chars),
  email: string (required, unique, lowercase),
  phone: string (required, unique, 10 digits),
  password: string (required, min 6 chars, hashed),
  role: 'user' | 'admin' (default: 'user'),
  isActive: boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## Next Steps

1. **Add Password Reset**: Implement forgot password functionality
2. **Email Verification**: Add email verification for new accounts
3. **Social Login**: Integrate Google, Facebook, etc.
4. **Two-Factor Authentication**: Add 2FA for enhanced security
5. **Session Management**: Implement proper session handling
6. **Rate Limiting**: Add rate limiting to prevent brute force attacks

## Support

If you encounter issues not covered in this guide:
1. Check the browser console for errors
2. Review the server logs
3. Verify your environment configuration
4. Check the MongoDB connection
5. Ensure all dependencies are properly installed
