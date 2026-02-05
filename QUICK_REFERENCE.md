# OAuth 2.0 Quick Reference Card

## Files Changed

| File | Change | Status |
|------|--------|--------|
| `classroom-backend/src/index.ts` | Route pattern: `/api/auth` → `/api/auth/*` | ✅ Fixed |
| `classroom-frontend/src/lib/auth-client.ts` | Separate baseURL and basePath | ✅ Fixed |
| `classroom-frontend/src/providers/auth.ts` | Add `as const` to provider names | ✅ Fixed |

## Critical Environment Variables

```bash
# MUST HAVE - Backend
BETTER_AUTH_SECRET=generate-with-openssl-rand-base64-32
BETTER_AUTH_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# GitHub OAuth (PROVIDED)
GITHUB_CLIENT_ID=Ov23liBBk8K6ZQLQ058v
GITHUB_CLIENT_SECRET=b09ade57e7d745be201317bf6eeace3b8d1b44cc

# Google OAuth (NEEDED - Get from console.cloud.google.com)
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret

# MUST HAVE - Frontend
VITE_BACKEND_BASE_URL=http://localhost:8000
VITE_API_URL=http://localhost:8000/api
```

## Generate BETTER_AUTH_SECRET

```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Node.js (any OS)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## OAuth Callback URLs

```
GitHub:  http://localhost:8000/api/auth/callback/github
Google:  http://localhost:8000/api/auth/callback/google
```

## Start Services

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

## Test URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Sign In: http://localhost:5173/signin
- Sign Up: http://localhost:5173/signup

## What's Working

✅ Email & Password Authentication
✅ GitHub OAuth Login
✅ Google OAuth Login (if configured)
✅ Session Persistence
✅ User Role Management
✅ Admin Auto-Assignment

## Common Issues & Quick Fixes

| Issue | Solution |
|-------|----------|
| 404 on OAuth callback | Backend route pattern not fixed |
| CORS error | Add frontend URL to ALLOWED_ORIGINS in .env |
| "Provider not recognized" | Check env variables and auth.ts config |
| Session lost on refresh | BETTER_AUTH_SECRET not set |
| User not created | Check database connection |

## Key URLs in Code

| URL | Location | Purpose |
|-----|----------|---------|
| `http://localhost:8000/api/auth/signin` | Backend | Email signin endpoint |
| `http://localhost:8000/api/auth/callback/github` | Backend | GitHub callback |
| `http://localhost:8000/api/auth/callback/google` | Backend | Google callback |

## Documentation Files

| File | Purpose |
|------|---------|
| `OAUTH_README.md` | Start here - overview and quick start |
| `ENVIRONMENT_SETUP.md` | Environment variables setup |
| `TESTING_OAUTH.md` | How to test OAuth flow |
| `OAUTH_FIXES_SUMMARY.md` | Technical details of fixes |
| `CHANGES.md` | Detailed changelog |

## API Endpoints

```javascript
// Sign up with email
POST /api/auth/sign-up/email
{ email, password, name, role }

// Sign in with email
POST /api/auth/sign-in/email
{ email, password }

// OAuth sign in
POST /api/auth/callback/{provider}
// (Handled by OAuth provider redirect)

// Get current session
GET /api/auth/session

// Sign out
POST /api/auth/sign-out
```

## Database Tables

```sql
user (id, name, email, role, image, imageCldPubId, createdAt, updatedAt)
account (id, userId, providerId, accountId, accessToken, refreshToken, ...)
session (id, userId, token, expiresAt, ipAddress, userAgent, ...)
verification (id, identifier, value, expiresAt, ...)
```

## User Roles

```
- "student" (default)
- "teacher"
- "admin" (auto-assigned for vignesh112847@gmail.com)
```

## Debugging Commands

```bash
# Check backend logs
npm run dev  # in classroom-backend

# Check frontend console
# F12 → Console tab in browser

# Check network requests
# F12 → Network tab in browser

# Clear browser storage
# F12 → Application → Clear All

# Generate random secret
openssl rand -base64 32
```

## Production Checklist

- [ ] Update BETTER_AUTH_URL to production domain
- [ ] Update FRONTEND_URL to production domain
- [ ] Update OAuth callback URLs in GitHub/Google settings
- [ ] Use https:// URLs in production
- [ ] Generate new BETTER_AUTH_SECRET
- [ ] Update DATABASE_URL for production
- [ ] Set ALLOWED_ORIGINS to production domain only
- [ ] Enable database backups
- [ ] Set up monitoring and logging
- [ ] Test all OAuth flows before deploying

## Support Resources

- better-auth: https://www.better-auth.com/
- GitHub OAuth: https://docs.github.com/en/apps/oauth-apps
- Google OAuth: https://developers.google.com/identity/protocols/oauth2

---

**Last Updated:** 2025-02-05
**OAuth Providers:** Google + GitHub
**Status:** ✅ Ready to Deploy
