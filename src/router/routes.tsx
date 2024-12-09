import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import LazyLoadComponent from "./lazy-load-component";

const routes: RouteObject[] = [
  {
    path: "/",
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "/home",
        element: (
          <LazyLoadComponent Component={lazy(() => import("~/pages/home"))} />
        ),
      },
      {
        path: "/about",
        element: (
          <LazyLoadComponent Component={lazy(() => import("~/pages/about"))} />
        ),
      },
    ],
  },
];

export default routes;
