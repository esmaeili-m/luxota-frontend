# Authentication System - Laravel + Nuxt 3

This project implements a complete authentication system using Laravel Sanctum for the backend and Nuxt 3 for the frontend.

## Features

- ✅ Login with email/password
- ✅ CSRF token management
- ✅ Protected routes with middleware
- ✅ User state management with Pinia
- ✅ Responsive UI with Bootstrap-like styles
- ✅ Logout functionality
- ✅ Route guards for authenticated/guest users

## File Structure

```
frontend/
├── composables/
│   └── useAuth.js          # Authentication composable
├── stores/
│   └── auth.js             # Pinia auth store
├── middleware/
│   ├── auth.js             # Protect authenticated routes
│   └── guest.js            # Redirect authenticated users
├── layouts/
│   ├── default.vue         # Default layout
│   └── auth.vue            # Authentication layout
├── pages/
│   ├── login.vue           # Login page
│   ├── register.vue        # Registration page
│   ├── forgot-password.vue # Password reset page
│   ├── dashboard/
│   │   └── index.vue       # Dashboard (protected)
│   └── index.vue           # Welcome page
├── plugins/
│   └── auth.client.js      # Auth initialization plugin
└── assets/
    └── css/
        └── main.css        # Bootstrap-like styles
```

## Backend Configuration

The backend is configured with:

- Laravel Sanctum for API authentication
- CORS configured for frontend domains
- CSRF token support enabled
- User module with AuthController

## Usage

### 1. Start the Backend
```bash
cd backend
php artisan serve
```

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### 4. Login
- Go to http://localhost:3000/login
- Use valid credentials from your Laravel database
- After successful login, you'll be redirected to the dashboard

## API Endpoints

- `POST /api/login` - User login
- `POST /api/logout` - User logout (requires auth)
- `GET /api/profile` - Get current user (requires auth)
- `GET /sanctum/csrf-cookie` - Get CSRF token

## Authentication Flow

1. **Login Process:**
   - Get CSRF token from `/sanctum/csrf-cookie`
   - Send login request to `/api/login`
   - Store token in localStorage
   - Update user state in Pinia store
   - Redirect to dashboard

2. **Route Protection:**
   - `auth` middleware: Protects routes requiring authentication
   - `guest` middleware: Redirects authenticated users away from login/register

3. **Logout Process:**
   - Send logout request to backend
   - Clear localStorage
   - Reset Pinia store state
   - Redirect to login page

## Customization

### Adding New Protected Routes
```javascript
// In your page component
definePageMeta({
  middleware: 'auth'
})
```

### Adding Guest-Only Routes
```javascript
// In your page component
definePageMeta({
  middleware: 'guest'
})
```

### Custom Authentication Logic
Modify the `useAuth` composable in `composables/useAuth.js` to add custom authentication logic.

## Troubleshooting

### CORS Issues
- Ensure backend CORS configuration includes your frontend domain
- Check that `supports_credentials` is set to `true`

### CSRF Token Issues
- Verify Sanctum middleware is enabled in `app/Http/Kernel.php`
- Check that CSRF token endpoint is accessible

### Authentication State Issues
- Clear localStorage and refresh page
- Check browser console for errors
- Verify API endpoints are working

## Notes

- The registration and password reset functionality is not implemented yet
- Social login buttons are present but not functional
- The UI uses custom CSS that mimics Bootstrap classes
- All API calls use the native `fetch` API as requested 