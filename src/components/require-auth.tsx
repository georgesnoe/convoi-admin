import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getMe } from "../lib/api";

/**
 * Route guard: verifies that the user is authenticated by calling
 * GET /api/users/me. If the response is not 200, redirects to /sign-in.
 *
 * Children are rendered immediately (never unmounted during the request)
 * to avoid losing page state during a network round-trip.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    getMe()
      .then((response) => {
        if (!cancelled && !response.ok) {
          navigate("/sign-in", { replace: true });
        }
      })
      .catch(() => {
        if (!cancelled) {
          navigate("/sign-in", { replace: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return children;
}
