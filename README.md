# Full Stack Authentication & Authorization with React and Axios Interceptor

This project demonstrates **best practices** for integrating **authentication** and **authorization** using **React**, **Axios interceptors**, and **protected routes**. It is designed as an example for small to medium-scale applications, showcasing how to handle user authentication through **JWT tokens** and manage **access token refresh** without user intervention. The backend is built as a simple example that handles login, token generation, and token refreshing.

## Key Features

1. **Login Page**:

   - A simple login page where a user enters their credentials.
   - Upon login, the backend responds with an **access token** (JWT) and an **HttpOnly refresh token**.
   - The **refresh token** is securely stored in an **HttpOnly cookie** that is not accessible to JavaScript.

2. **Protected Routes**:

   - The application contains **protected routes** that require a valid `access_token` to access.
   - These routes are protected using **React Router** and the **`RequireAuth`** component.

3. **Access Token Validation**:

   - Before accessing a protected route, the app checks whether the **`access_token`** is present and valid.
   - If valid, the user is granted access to the protected resources.

4. **Token Refreshing via Axios Interceptors**:

   - If the `access_token` is expired or invalid, but the **`refresh_token`** is still valid (stored in HttpOnly cookies), Axios automatically sends a request to the backend to **refresh the `access_token`**.
   - The user is **unaware** of this background token refresh, and the original request continues as if nothing happened.
   - If refreshing the token succeeds, the original request is **retried** with the new `access_token`.
   - If both the `access_token` and `refresh_token` are invalid or expired, the user is redirected to the **login page**.

5. **Backend Example**:
   - A lightweight backend built to demonstrate login, JWT generation, and token refreshing.
   - The backend validates user credentials, issues JWT tokens, and handles the refresh token mechanism.

## Project Structure

Here's a diagram-style explanation of the project structure to visualize the file organization more clearly:

```
/backend
│
├── /middlewares
│   └── corsMiddleware.ts   # CORS handling for backend
│
├── /routes
│   └── authRoutes.ts       # Defines backend authentication routes (login, refresh token)
│
├── /utils
│   └── tokenUtils.ts       # JWT handling utilities
│
└── app.ts                  # Express server setup, applies middleware, starts backend

/reactAuth (Frontend)
│
├── /api
│   ├── apiClient.ts        # Axios instance, interceptors for refreshing tokens
│   ├── authRequests.ts     # Requests related to authentication (login, refresh token)
│   └── url.ts              # Base API URL configuration
│
├── /auth
│   ├── AuthContext.tsx     # React context for managing authentication state
│   └── RequireAuth.tsx     # Protects routes, checks/refreshes tokens
│
├── /pages
│   ├── Dashboard.tsx       # Main protected dashboard page
│   └── LoginPage.tsx       # Login page for authentication
│
├── /utils
│   └── cookieHelpers.ts    # Utility functions for getting/setting cookies
│
├── App.tsx                 # Main React app component, routing setup
├── main.tsx
└── index.html
```

### Explanation:

- **Backend**: Organized into middleware (`corsMiddleware.ts`), routes (`authRoutes.ts`), and utilities (`tokenUtils.ts`). The `app.ts` ties everything together.
- **Frontend**: The frontend React app is modularized into:
  - **api**: Contains all API-related logic and Axios setup.
  - **auth**: Handles authentication state and route protection.
  - **pages**: Separate components for different app views.
  - **utils**: Shared utility functions like cookie management.

This structure keeps the authentication logic, API interaction, and route protection well-organized, making it easier to manage and scale.

### Frontend

The frontend is built with **React** and handles the following:

- **Login**: A default login page where a user inputs their credentials.
- **Protected Routes**: Uses **React Router** to implement protected routes with the help of the `RequireAuth` component.
- **Axios Interceptor**: Manages token expiration and refreshing seamlessly. If a request fails with a **401 Unauthorized** status, the interceptor automatically tries to refresh the token and retries the original request.

### Backend

The backend is a minimal **Express** server that:

- **Validates Login**: The user submits credentials, and the server responds with an `access_token` and an `HttpOnly refresh_token`.
- **Refresh Token**: On receiving a request to `/refresh-token`, the server checks the validity of the refresh token and issues a new `access_token` if valid.
- **Token-Based Protection**: Ensures the client has a valid JWT before responding to any protected resource requests.

## How It Works

1. **User Logs In**:
   - The user enters their credentials on the login page.
   - Upon successful login, the server responds with an `access_token` (stored in memory) and an `HttpOnly refresh_token` (stored in cookies).
2. **Accessing Protected Routes**:
   - When the user navigates to a protected route, the `RequireAuth` component checks if the `access_token` is valid.
   - If valid, the user is allowed to proceed to the protected route.
3. **Expired `access_token`**:
   - If the `access_token` is expired, Axios interceptors automatically catch the **401 Unauthorized** error.
   - Axios then sends a request to the backend to refresh the `access_token` using the **HttpOnly refresh_token**.
   - If the refresh succeeds, Axios retries the original request with the new `access_token`.
4. **Expired `refresh_token`**:
   - If both the `access_token` and `refresh_token` are expired, the user is redirected to the **login page** to authenticate again.

## Tech Stack

### Frontend:

- **React**: For building the UI and managing routing with **React Router**.
- **Axios**: To handle API requests and manage token refreshes via interceptors.
- **React Router Dom**: For route protection and navigation.

### Backend:

- **Node.js & Express**: For handling authentication, JWT generation, and token refreshing.
- **JWT (JSON Web Tokens)**: For creating and validating access tokens.
- **HttpOnly Cookies**: To securely store refresh tokens on the client side.

## Code Overview

### Axios Interceptor for Token Refresh

Axios interceptors are used to intercept every request and check if the `access_token` is valid. If the token is expired, the interceptor automatically sends a request to refresh the token and retries the original request:

```js
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refresh_token = getCookie("refresh_token");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refresh_token
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          processQueue(null, newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } else {
          processQueue(new Error("Failed to refresh token"), null);
          window.location.href = "/login";
        }
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

### Protected Routes

The `RequireAuth` component checks for a valid `access_token` before allowing access to a route:

```js
const RequireAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const accessToken = getCookie("access_token");
      if (!accessToken) {
        const newToken = await refreshAccessToken();
        setIsAuthenticated(!!newToken);
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkToken();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
```

## Usage

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the backend**:

   ```bash
   npm run dev
   ```

4. **Run the frontend**:
   ```bash
   npm start
   ```

## Conclusion

This project provides a robust example of how to integrate **authentication**, **authorization**, and **protected routes** in a React application using **JWT tokens** and **Axios interceptors**. It demonstrates best practices for managing access and refresh tokens while ensuring that the user experience is seamless, even when tokens need to be refreshed in the background.

This approach is scalable and can be adapted for small to medium-sized applications.
