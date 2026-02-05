# OAuth 2.0 Implementation - Complete Guide

## Overview

This document provides a complete guide to the OAuth 2.0 implementation for the University Management System. The system supports authentication via:

- **Email & Password** (Traditional registration)
- **Google OAuth 2.0**
- **GitHub OAuth 2.0**

## What Has Been Fixed

### 1. Backend Route Handler (`classroom-backend/src/index.ts`)
- Fixed the auth route pattern from `/api/auth` to `/api/auth/*`
- This ensures all OAuth callback routes are properly handled

### 2. Frontend Auth Client (`classroom-frontend/src/lib/auth-client.ts`)
- Corrected the base URL configuration
- Separated `baseURL` and `basePath` for proper URL construction
- Fixed provider type assertions in auth provider

### 3. Backend Auth Configuration (`classroom-backend/src/lib/auth.ts`)
- OAuth providers are conditionally loaded based on environment variables
- Both Google and GitHub are pre-configured and ready to use

## Quick Start

### Step 1: Configure Environment Variables

**Backend (.env in classroom-backend/):**
```
BETTER_AUTH_SECRET=your-secure-random-string
BETTER_AUTH_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=vignesh112847@gmail.com

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (provided)
GITHUB_CLIENT_ID=Ov23liBBk8K6ZQLQ058v
GITHUB_CLIENT_SECRET=b09ade57e7d745be201317bf6eeace3b8d1b44cc

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/database

# CORS
ALLOWED_ORIGINS=http://localhost:5173
```

**Frontend (.env.local in classroom-frontend/):**
```
VITE_BACKEND_BASE_URL=http://localhost:8000
VITE_API_URL=http://localhost:8000/api
VITE_CLOUDINARY_UPLOAD_URL=your-cloudinary-url
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-preset
```

### Step 2: Start the Services

```bash
# Terminal 1 - Backend
cd classroom-backend
npm install
npm run dev

# Terminal 2 - Frontend
cd classroom-frontend
npm install
npm run dev
```

### Step 3: Test the OAuth Flow

1. Open http://localhost:5173
2. Go to Sign In/Sign Up page
3. Try:
   - Email & Password signup/login
   - GitHub OAuth
   - Google OAuth (if configured)

## Documentation Files

Refer to these files for detailed information:

1. **ENVIRONMENT_SETUP.md** - Complete environment variables configuration
2. **OAUTH_FIXES_SUMMARY.md** - Technical details of all fixes
3. **TESTING_OAUTH.md** - Comprehensive testing guide
4. **OAUTH_SETUP.md** - OAuth provider setup instructions

## Architecture Overview

### Authentication Flow

```
User → Frontend → Backend (better-auth) → OAuth Provider → Backend → Frontend → App
```

### Key Components

1. **Frontend:**
   - `src/lib/auth-client.ts` - better-auth client configuration
   - `src/providers/auth.ts` - Refine auth provider integration
   - `src/components/refine-ui/form/sign-in-form.tsx` - UI for authentication

2. **Backend:**
   - `src/lib/auth.ts` - better-auth server configuration
   - `src/db/schema/auth.ts` - Database schema for users and sessions
   - `src/index.ts` - Express route handler for `/api/auth/*`

3. **Database:**
   - `user` table - Stores user information
   - `account` table - Stores OAuth provider credentials
   - `session` table - Stores active sessions
   - `verification` table - Stores email verification tokens

## OAuth Providers Configuration

### Google OAuth Setup

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Set authorized redirect URI: `http://localhost:8000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

### GitHub OAuth Setup

Already configured with:
- Client ID: `Ov23liBBk8K6ZQLQ058v`
- Client Secret: `b09ade57e7d745be201317bf6eeace3b8d1b44cc`

Just ensure the callback URL in GitHub OAuth settings matches: `http://localhost:8000/api/auth/callback/github`

## Common Tasks

### Accessing the Current User

```typescript
// In frontend components
const { user } = useGetIdentity();
```

### Checking User Role

```typescript
// Admin check
if (user?.role === 'admin') {
  // Show admin features
}
```

### Adding a New OAuth Provider

1. Add provider configuration in `classroom-backend/src/lib/auth.ts`
2. Add social login button in UI component
3. Add provider handler in `classroom-frontend/src/providers/auth.ts`
4. Set environment variables
5. Configure provider's OAuth settings

## Troubleshooting

### Authentication not working?

1. ✅ Check all environment variables are set correctly
2. ✅ Verify database connection
3. ✅ Clear browser cookies and cache
4. ✅ Check backend logs for errors
5. ✅ Verify OAuth callback URLs match exactly

### CORS errors?

1. ✅ Add frontend URL to `ALLOWED_ORIGINS` in backend .env
2. ✅ Verify `FRONTEND_URL` is set correctly
3. ✅ Check backend CORS middleware configuration

### OAuth redirect failing?

1. ✅ Verify callback URL in OAuth provider settings
2. ✅ Check that backend is running and accessible
3. ✅ Verify `BETTER_AUTH_URL` is set correctly
4. ✅ Check network requests in browser DevTools

For more details, see **TESTING_OAUTH.md** and **ENVIRONMENT_SETUP.md**.

## Security Considerations

1. **Secure Secret Generation:**
   ```bash
   openssl rand -base64 32
   ```

2. **Environment Variables:**
   - Never commit `.env` files to version control
   - Use `.env.local` for development
   - Use secure environment variable management in production

3. **Session Management:**
   - Sessions are stored in database with expiration
   - Cookies are secure and HttpOnly
   - CSRF protection is enabled

4. **Rate Limiting:**
   - Configured to prevent brute force attacks
   - Applied based on IP and user role

## Production Deployment

1. Update all environment variables for production
2. Update OAuth callback URLs in provider settings
3. Use HTTPS (required for OAuth)
4. Set strong `BETTER_AUTH_SECRET`
5. Configure production database
6. Enable proper logging and monitoring

## Next Steps

1. ✅ Set up environment variables (see ENVIRONMENT_SETUP.md)
2. ✅ Configure GitHub OAuth settings with callback URL
3. ✅ (Optional) Set up Google OAuth credentials
4. ✅ Start backend and frontend services
5. ✅ Test OAuth flow (see TESTING_OAUTH.md)
6. ✅ Deploy to production

## Support

If you encounter issues:

1. Check the relevant documentation file
2. Review backend logs and frontend console errors
3. Verify environment variables are correctly set
4. Check OAuth provider settings match callback URLs
5. Clear cache and restart services if needed

## Additional Resources

- [better-auth Documentation](https://www.better-auth.com/)
- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Express.js Middleware Guide](https://expressjs.com/en/guide/using-middleware.html)
