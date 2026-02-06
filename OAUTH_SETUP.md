# OAuth Setup Guide

This guide explains how to set up Google and GitHub OAuth for the University Management System.

## Environment Variables Required

You need to set the following environment variables in your project:

### Backend (classroom-backend)
```
BETTER_AUTH_SECRET=<secure-random-string>
BETTER_AUTH_URL=http://localhost:8000
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
FRONTEND_URL=http://localhost:5173
```

### Frontend (classroom-frontend)
```
VITE_BACKEND_BASE_URL=http://localhost:8000
VITE_CLOUDINARY_UPLOAD_URL=<your-cloudinary-url>
VITE_CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
VITE_CLOUDINARY_UPLOAD_PRESET=<your-cloudinary-preset>
VITE_API_URL=http://localhost:8000
VITE_ACCESS_TOKEN_KEY=access_token
VITE_REFRESH_TOKEN_KEY=refresh_token
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and click "Create Credentials"
5. Select "OAuth 2.0 Client ID"
6. Choose "Web Application"
7. Add authorized redirect URIs:
   - `http://localhost:8000/api/auth/callback/google` (development)
   - `http://localhost:5173` (frontend for development)
   - Your production URLs when deploying
8. Copy the **Client ID** and **Client Secret**

## GitHub OAuth Setup

1. Go to [GitHub Settings - Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: University Management System
   - **Homepage URL**: `http://localhost:8000` (development)
   - **Authorization callback URL**: `http://localhost:8000/api/auth/callback/github`
4. Create the OAuth app
5. Generate a new client secret (if needed)
6. Copy the **Client ID** and **Client Secret**

## Generating BETTER_AUTH_SECRET

Generate a secure random string using one of these methods:

```bash
# Using OpenSSL
openssl rand -hex 32

# Using Python
python3 -c "import secrets; print(secrets.token_hex(32))"

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Callback URL Notes

The auth callback URLs must match exactly:
- Google: `http://localhost:8000/api/auth/callback/google`
- GitHub: `http://localhost:8000/api/auth/callback/github`

When deploying to production, update these URLs to use your production domain.

## Testing OAuth

1. Start the backend server
2. Start the frontend development server
3. Go to the sign-in page
4. Click "Sign in using Google" or "Sign in using GitHub"
5. You should be redirected to the OAuth provider
6. After authentication, you should be redirected back to the application

## Common Issues

### Redirect URI Mismatch
- Make sure the redirect URI in your OAuth provider settings matches exactly what's in the code
- Check for trailing slashes and protocol (http vs https)

### CORS Issues
- Ensure `FRONTEND_URL` is added to `trustedOrigins` in the backend auth config
- Check that the frontend and backend are on different origins/ports

### Missing Environment Variables
- Verify all required environment variables are set
- Check that the variable names match exactly (case-sensitive)
