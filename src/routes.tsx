import { createBrowserRouter, Navigate } from "react-router";
import SignIn from "./routes/sign-in";
import SignUp from "./routes/sign-up";
import DashboardLayout from "./routes/dashboard";
import DashboardIndex from "./routes/dashboard/index";
import UsersPage from "./routes/dashboard/users";
import VehiclesPage from "./routes/dashboard/vehicles";
import TripsPage from "./routes/dashboard/trips";
import ReservationsPage from "./routes/dashboard/reservations";
import MessagesPage from "./routes/dashboard/messages";
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
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardIndex /> },
      { path: "users", element: <UsersPage /> },
      { path: "vehicles", element: <VehiclesPage /> },
      { path: "trips", element: <TripsPage /> },
      { path: "reservations", element: <ReservationsPage /> },
      { path: "messages", element: <MessagesPage /> },
    ],
  },
]);

export { router };
