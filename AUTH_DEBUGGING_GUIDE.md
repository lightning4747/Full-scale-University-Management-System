# Authentication Setup & Debugging Guide

Authentication with Google and GitHub requires specific configuration in both your deployment platform (Vercel/Railway) and the OAuth providers themselves.

## 1. Environment Variables

### Backend (Railway)
Ensure the following variables are set in your Railway project settings:

| Variable | Value | Notes |
| :--- | :--- | :--- |
| `FRONTEND_URL` | `https://classroom-frontend-ecru.vercel.app` | The URL of your frontend application. No trailing slash. |
| `BETTER_AUTH_URL` | `https://proactive-exploration-production-1402.up.railway.app` | The URL of your backend application. No trailing slash. |
| `ALLOWED_ORIGINS` | `https://classroom-frontend-ecru.vercel.app` | Comma-separated list of allowed origins for CORS. |
| `BETTER_AUTH_SECRET` | `(your_secret)` | A long random string (e.g., generated with `openssl rand -hex 32`). |
| `GOOGLE_CLIENT_ID` | `(your_google_client_id)` | From Google Cloud Console. |
| `GOOGLE_CLIENT_SECRET` | `(your_google_client_secret)` | From Google Cloud Console. |
| `GITHUB_CLIENT_ID` | `(your_github_client_id)` | From GitHub Developer Settings. |
| `GITHUB_CLIENT_SECRET` | `(your_github_client_secret)` | From GitHub Developer Settings. |
| `NODE_ENV` | `production` | Ensure this is set to `production` for secure cookies. |

### Frontend (Vercel)
Ensure the following variables are set in your Vercel project settings:

| Variable | Value | Notes |
| :--- | :--- | :--- |
| `VITE_BACKEND_BASE_URL` | `https://proactive-exploration-production-1402.up.railway.app` | The URL of your backend application. No trailing slash. |

## 2. OAuth Provider Configuration

You must configure the **Authorized redirect URIs** in your OAuth provider settings to match your production backend URL.

### Google Cloud Console (APIs & Services > Credentials)
1.  Select your OAuth 2.0 Client ID.
2.  Add the following **Authorized JavaScript origins**:
    *   `https://classroom-frontend-ecru.vercel.app`
    *   `https://proactive-exploration-production-1402.up.railway.app`
3.  Add the following **Authorized redirect URIs**:
    *   `https://proactive-exploration-production-1402.up.railway.app/api/auth/callback/google`

### GitHub (Developer Settings > OAuth Apps)
1.  Select your OAuth App.
2.  Set **Homepage URL** to: `https://classroom-frontend-ecru.vercel.app`
3.  Set **Authorization callback URL** to: `https://proactive-exploration-production-1402.up.railway.app/api/auth/callback/github`

## 3. Important Note on Cookies

Since your frontend (`vercel.app`) and backend (`railway.app`) are on different domains, authentication relies on **Third-Party Cookies**.

*   We have updated the code to set `SameSite=None; Secure` for cookies in production. This allows cross-site requests.
*   **Warning**: Some browsers (like Safari or stricter Chrome settings) may block third-party cookies by default.
    *   If users experience issues on Safari, the best solution is to use a **Custom Domain** so both frontend and backend share the same root domain (e.g., `app.mydomain.com` and `api.mydomain.com`).

## 4. Troubleshooting

If you still face issues:
1.  Check the `Network` tab in your browser's developer tools. Look for the `/api/auth/signin/google` request and the redirect response.
2.  Check the `Console` for any CORS errors.
3.  Verify that the `set-cookie` header is present in the response from the backend and that the `SameSite=None; Secure` attributes are set.
