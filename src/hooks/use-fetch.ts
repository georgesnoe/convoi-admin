import { useEffect, useState } from "react";

/**
 * Fetch a resource from the API and track loading / error state.
 * `fetcher` must be a stable reference (e.g. a module-level function from
 * `src/lib/api.ts`) so the effect does not re-run on every render.
 */
export function useFetch<T>(fetcher: () => Promise<Response>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then(async (response) => {
        if (cancelled) return;
        if (!response.ok) {
          setError(`Request failed with status ${response.status}`);
          return;
        }
        setData((await response.json()) as T);
      })
      .catch(() => {
        if (!cancelled) setError("Network error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetcher]);

  return { data, loading, error };
}
