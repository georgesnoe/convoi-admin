import { createBrowserRouter, Navigate } from "react-router";
import SignIn from "./routes/sign-in";
import SignUp from "./routes/sign-up";
import Dashboard from "./routes/dashboard";
import { RequireAuth } from "./components/require-auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
  },
]);

export { router };
