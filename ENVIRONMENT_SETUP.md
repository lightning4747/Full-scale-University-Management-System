# Environment Variables Setup Guide

## Backend Environment Variables

Create a `.env` file in the `classroom-backend` directory with the following variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/university_management

# Auth Configuration
BETTER_AUTH_SECRET=your-secure-random-string-here
BETTER_AUTH_URL=http://localhost:8000
ADMIN_EMAIL=vignesh112847@gmail.com
FRONTEND_URL=http://localhost:5173

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth 2.0
GITHUB_CLIENT_ID=<your-github-id>
GITHUB_CLIENT_SECRET=<your-github-secret>

# CORS Configuration (comma-separated URLs)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
CORS_ORIGIN=http://localhost:5173
```

## Frontend Environment Variables

Create a `.env.local` file in the `classroom-frontend` directory with the following variables:

```bash
# Backend Configuration
VITE_BACKEND_BASE_URL=http://localhost:8000
VITE_API_URL=http://localhost:8000/api

# Cloudinary Configuration (for image uploads)
VITE_CLOUDINARY_UPLOAD_URL=https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Token Storage Keys
VITE_ACCESS_TOKEN_KEY=access_token
VITE_REFRESH_TOKEN_KEY=refresh_token
```

## Generating BETTER_AUTH_SECRET

Run this command to generate a secure random string for `BETTER_AUTH_SECRET`:

```bash
# On Linux/Mac
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## GitHub OAuth Callback URL Configuration

After setting up the environment variables, make sure to configure the callback URL in GitHub OAuth settings:

1. Go to https://github.com/settings/developers
2. Click on your OAuth App
3. Set the Authorization callback URL to: `http://localhost:8000/api/auth/callback/github`
4. For production, update this to: `https://yourdomain.com/api/auth/callback/github`

## Testing the OAuth Flow

1. **Start the backend server:**
   ```bash
   cd classroom-backend
   npm install
   npm run dev
   ```

2. **Start the frontend dev server:**
   ```bash
   cd classroom-frontend
   npm install
   npm run dev
   ```

3. **Test sign-in/sign-up:**
   - Navigate to http://localhost:5173
   - Click on "Sign in with Google" or "Sign in with GitHub"
   - You should be redirected to the respective OAuth provider
   - After authentication, you'll be redirected back to the application

## Troubleshooting

### CORS Errors
- Make sure `ALLOWED_ORIGINS` and `CORS_ORIGIN` include your frontend URL
- Ensure credentials are enabled in CORS configuration

### OAuth Redirect Issues
- Verify the callback URLs match exactly in OAuth provider settings
- Check that `BETTER_AUTH_URL` and `FRONTEND_URL` are correctly set
- Make sure cookies are allowed in the CORS configuration

### Session/Authentication Issues
- Clear browser cookies and local storage
- Ensure `BETTER_AUTH_SECRET` is set and consistent
- Verify database connection is working

## Production Deployment

When deploying to production:

1. Update `BETTER_AUTH_URL` to your production backend URL
2. Update `FRONTEND_URL` to your production frontend URL
3. Update OAuth callback URLs in Google and GitHub settings
4. Use strong, randomly generated values for `BETTER_AUTH_SECRET`
5. Ensure environment variables are securely stored in your hosting provider
