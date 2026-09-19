import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { RequireAuth } from "./components/require-auth";

// 1. Dynamically import route components
const SignIn = lazy(() => import("./routes/sign-in"));
const SignUp = lazy(() => import("./routes/sign-up"));
const DashboardLayout = lazy(() => import("./routes/dashboard"));
const DashboardIndex = lazy(() => import("./routes/dashboard/index"));
const UsersPage = lazy(() => import("./routes/dashboard/users"));
const VehiclesPage = lazy(() => import("./routes/dashboard/vehicles"));
const TripsPage = lazy(() => import("./routes/dashboard/trips"));
const ReservationsPage = lazy(() => import("./routes/dashboard/reservations"));
const MessagesPage = lazy(() => import("./routes/dashboard/messages"));

// 2. A simple fallback loader while the page bundle downloads
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center">
    <p>Loading...</p>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/sign-in",
    element: (
      <Suspense fallback={<PageLoader />}>
        <SignIn />
      </Suspense>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <Suspense fallback={<PageLoader />}>
        <SignUp />
      </Suspense>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <Suspense fallback={<PageLoader />}>
          <DashboardLayout />
        </Suspense>
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardIndex />
          </Suspense>
        ),
      },
      {
        path: "users",
        element: (
          <Suspense fallback={<PageLoader />}>
            <UsersPage />
          </Suspense>
        ),
      },
      {
        path: "vehicles",
        element: (
          <Suspense fallback={<PageLoader />}>
            <VehiclesPage />
          </Suspense>
        ),
      },
      {
        path: "trips",
        element: (
          <Suspense fallback={<PageLoader />}>
            <TripsPage />
          </Suspense>
        ),
      },
      {
        path: "reservations",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ReservationsPage />
          </Suspense>
        ),
      },
      {
        path: "messages",
        element: (
          <Suspense fallback={<PageLoader />}>
            <MessagesPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export { router };
