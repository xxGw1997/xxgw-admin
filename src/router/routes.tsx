import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { Edit, UploadCloud } from "lucide-react";
import RootLayout from "~/layout/root";
import Login from "~/pages/login";
import LazyLoadComponent from "./lazy-load-component";

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
        path: "/postList",
        element: (
          <LazyLoadComponent
            Component={lazy(() => import("~/pages/post/post-list"))}
          />
        ),
        handle: {
          name: "PostList",
          icon: <Edit />,
        },
      },
      {
        path: "/write",
        element: (
          <LazyLoadComponent
            Component={lazy(() => import("~/pages/post/write-post"))}
          />
        ),
        handle: {
          name: "Write",
          icon: <Edit />,
        },
      },
      {
        path: "/category",
        element: (
          <LazyLoadComponent
            Component={lazy(() => import("~/pages/category"))}
          />
        ),
        handle: {
          name: "Category",
          icon: <Edit />,
        },
      },
      {
        path: "/write/:postId",
        element: (
          <LazyLoadComponent
            Component={lazy(() => import("~/pages/post/write-post"))}
          />
        ),
        handle: {
          name: "Edit Write",
          icon: <Edit />,
        },
      },
      {
        path: "/upload",
        element: (
          <LazyLoadComponent Component={lazy(() => import("~/pages/upload"))} />
        ),
        handle: {
          name: "Upload",
          icon: <UploadCloud />,
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
