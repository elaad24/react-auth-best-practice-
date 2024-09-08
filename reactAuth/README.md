Project Structure:
This structure follows a well-organized layout auth and authorization and protected routes in react ,
ideal for small to medium-sized apps. Here's how the project is structured

src/
├── api/
│ └── apiClient.ts // Axios instance with interceptor
├── auth/
│ ├── AuthContext.tsx // Auth provider and context
│ ├── RequireAuth.tsx // Component to protect routes
│ └── authHelpers.ts // Helper functions (getAccessToken, redirectToLogin)
├── utils/
│ └── cookieHelpers.ts // Helper functions for cookies
├── pages/
│ ├── LoginPage.tsx // Login page
│ └── Dashboard.tsx // Protected Dashboard page
├── App.tsx // Main App component, routes are defined here
└── index.tsx // Main entry point

the backend is setting the access_token and the refresh_token
