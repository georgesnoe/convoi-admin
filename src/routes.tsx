import { createBrowserRouter } from "react-router";
import Login from "./routes/login";

const router = createBrowserRouter([
  {
    path: "login",
    element: <Login />,
  },
]);

export { router };
