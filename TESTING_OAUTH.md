# Testing OAuth Implementation

## Pre-Testing Checklist

- [ ] All environment variables are set in `.env` files
- [ ] Backend and frontend dependencies are installed
- [ ] Database is running and migrations are applied
- [ ] GitHub OAuth app is created with correct callback URL
- [ ] Google OAuth credentials are configured (optional for initial testing)

## Step-by-Step Testing Guide

### 1. Setup and Start Services

**Backend Setup:**
```bash
cd classroom-backend
npm install
# Create .env file with all required variables
npm run dev
```

**Frontend Setup (in a new terminal):**
```bash
cd classroom-frontend
npm install
# Create .env.local file with all required variables
npm run dev
```

### 2. Test Email Authentication (Email/Password)

1. Open http://localhost:5173 in your browser
2. Navigate to the Sign Up page
3. Fill in the form with:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPassword123!
   - Role: Student
4. Click "Sign Up"
5. You should be redirected to the dashboard
6. Verify you're logged in (check user menu or dashboard)

### 3. Test GitHub OAuth

**First-time OAuth Test:**

1. On the Sign In page, click "Sign in with GitHub"
2. You'll be redirected to GitHub login
3. Enter your GitHub credentials
4. Authorize the application
5. You should be redirected back to the dashboard
6. Verify:
   - You're logged in
   - Your GitHub profile picture is displayed (if available)
   - Your name is correctly displayed

**Second-time OAuth Test (Linking to Existing Account):**

1. Sign out (if logged in)
2. Click "Sign in with GitHub" again
3. Use the same GitHub account
4. You should be logged in immediately (no new account created)

### 4. Test Google OAuth (if credentials are configured)

1. On the Sign In page, click "Sign in with Google"
2. You'll be redirected to Google login
3. Enter your Google credentials
4. Accept the permissions request
5. You should be redirected back to the dashboard
6. Verify you're logged in

### 5. Test Session Persistence

1. Log in with any method (email, GitHub, or Google)
2. Refresh the page
3. You should still be logged in
4. Verify your data is preserved

### 6. Test Logout

1. Click the user menu (top right)
2. Click "Logout"
3. You should be redirected to the login page
4. Try to access a protected route - you should be redirected to login

### 7. Test Admin Role Assignment

1. Create an account with the admin email: `vignesh112847@gmail.com`
2. Use OAuth or email signup
3. In the database, verify the role is set to "admin"
4. Admin should have access to admin features

## Debugging Common Issues

### Issue: "Redirect URI mismatch" in OAuth

**Solution:**
1. Check GitHub/Google OAuth settings
2. Verify the callback URL matches exactly:
   - For GitHub: `http://localhost:8000/api/auth/callback/github`
   - For Google: `http://localhost:8000/api/auth/callback/google`
3. Ensure no trailing slashes or protocol mismatches

### Issue: CORS errors when signing in

**Solution:**
1. Check browser console for specific error
2. Verify `ALLOWED_ORIGINS` includes `http://localhost:5173`
3. Ensure `FRONTEND_URL` environment variable is set correctly
4. Make sure CORS middleware is properly configured

### Issue: User not being created after OAuth

**Solution:**
1. Check backend logs for errors
2. Verify database connection is working
3. Check that the user table has the correct schema
4. Ensure the provider configuration is correct

### Issue: OAuth token not persisting

**Solution:**
1. Clear browser cookies and localStorage
2. Verify `BETTER_AUTH_SECRET` is set
3. Check database for session records
4. Ensure session expiration is set to a reasonable value

### Issue: "Provider not recognized" error

**Solution:**
1. Verify provider name is lowercase: "google" or "github"
2. Check that environment variables are set for the provider
3. Ensure the provider configuration exists in auth.ts

## Performance Testing

### Test with Multiple Users

1. Create multiple accounts with different methods:
   - Email/password
   - GitHub
   - Google (if configured)
2. Verify each user has their own session
3. Log out one user and verify others remain logged in

### Test Session Limits

1. Log in with user A
2. In another browser/incognito, log in with user B
3. Verify both sessions exist independently
4. Log out user A - user B should still be logged in

## Security Testing

### Test Password Requirements

1. Try creating an account with weak password (e.g., "123")
2. Should reject and show error message
3. Try creating with strong password
4. Should succeed

### Test Email Verification

1. Sign up with email
2. Check if email verification is required
3. If required, verify the verification email functionality

### Test CORS Security

1. From a different domain, try making requests to the API
2. Should be blocked unless domain is in `ALLOWED_ORIGINS`
3. Verify credentials are required for requests

### Test Session Security

1. Copy session cookie value
2. Try using it from a different IP/user agent
3. Verify session security checks work correctly

## Production Testing Checklist

Before deploying to production:

- [ ] All environment variables are securely stored
- [ ] OAuth callback URLs are updated for production domain
- [ ] SSL/HTTPS is enabled
- [ ] CORS is restricted to production domain only
- [ ] Rate limiting is configured
- [ ] Session timeout is appropriate
- [ ] Logging is configured for debugging
- [ ] Error handling returns generic messages (not stack traces)
- [ ] Database backups are configured
- [ ] Monitoring and alerts are set up

## Automated Testing

For automated testing, consider creating tests for:

```typescript
// Example test structure
describe('OAuth Authentication', () => {
  test('Should redirect to Google OAuth on "Sign in with Google" click', () => {
    // Test implementation
  });

  test('Should create user on first GitHub OAuth', () => {
    // Test implementation
  });

  test('Should log in existing user on subsequent OAuth', () => {
    // Test implementation
  });

  test('Should persist session after page refresh', () => {
    // Test implementation
  });

  test('Should clear session on logout', () => {
    // Test implementation
  });
});
```

## Support

If you encounter issues not covered here:

1. Check backend logs: `npm run dev` output in classroom-backend terminal
2. Check frontend console: F12 → Console tab
3. Check browser network tab: F12 → Network tab for failed requests
4. Verify all environment variables are correctly set
5. Clear browser cache and cookies
6. Restart both backend and frontend services
