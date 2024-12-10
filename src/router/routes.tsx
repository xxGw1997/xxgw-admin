import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import LazyLoadComponent from "./lazy-load-component";
import RootLayout from "~/layout/root";
import Login from "~/pages/login";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    handle: {
      name: "Home",
      icon: <div>Home</div>,
    },
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
        handle: {
          name: "Home",
          icon: <div>Home</div>,
        },
      },
      {
        path: "/about",
        element: (
          <LazyLoadComponent Component={lazy(() => import("~/pages/about"))} />
        ),
        handle: {
          name: "About",
          icon: <div>Home</div>,
        },
      },
      {
        path: "/nest-1",
        element: <div>nest-1</div>,
        handle: {
          name: "Nest-1",
          icon: <div>Nest-1</div>,
        },
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    handle: {
      name: "Login",
    },
  },
];
