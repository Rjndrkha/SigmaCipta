import { createBrowserRouter, Outlet } from "react-router-dom";
import Login from "../page/login/login";
import IndexNotFound from "../page/NotFound";
import { DashboardRoute, PrivateRoute } from "./privateroute";

import Layout from "../component/layout/layout";

import { MenuSPJItems } from "../page/movies/menuItems";
import IndexMovies from "../page/movies";
import IndexCRUDMovies from "../page/movies/CRUD";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PrivateRoute>
        <Login />
      </PrivateRoute>
    ),
    index: true,
  },

  {
    path: "/",
    element: (
      <DashboardRoute>
        <Layout menuItems={MenuSPJItems} />
      </DashboardRoute>
    ),

    children: [
      {
        path: "",
        element: <IndexMovies />,
      },
      {
        path: "/movies",
        element: <IndexCRUDMovies />,
      },
    ],
  },

  {
    path: "*",
    element: <IndexNotFound />,
  },
]);

export default router;
