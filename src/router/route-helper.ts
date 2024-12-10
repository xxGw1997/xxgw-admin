import { RouteObject } from "react-router-dom";
import { posix } from "path-browserify";
import { LucideProps, SquareTerminal } from "lucide-react";

export interface FlatRoute {
  path?: string;
  children?: FlatRoute[];
  index?: boolean;
  handle?: any;
}

export interface FormatRoute {
  title?: string;
  url: string;
  isActive?: boolean;
  children?: FormatRoute[];
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

// 扁平化路由
export function flattenRoutes(routes: FlatRoute[], basePath = ""): FlatRoute[] {
  let flatRoutes: FlatRoute[] = [];

  routes.forEach((route) => {
    const fullPath = basePath
      ? `${basePath}${route.path || ""}`.replace("//", "/")
      : route.path || "";

    // 复制当前路由对象，并更新其路径
    const newRoute: FlatRoute = { path: fullPath, handle: route.handle };

    // 将当前路由添加到结果数组中
    flatRoutes.push(newRoute);

    // 如果存在子路由，则递归调用 flattenRoutes
    if (route.children && route.children.length > 0) {
      const childRoutes = flattenRoutes(route.children, fullPath);
      flatRoutes = flatRoutes.concat(childRoutes);
    }
  });

  return flatRoutes;
}

export function formatRoutes(
  routes: RouteObject[],
  basePath: string = ""
): FormatRoute[] {
  let newRoutes: FormatRoute[] = [];
  routes.forEach((route) => {
    if (!route.path) return;
    const fullPath = basePath
      ? posix.join(basePath, route.path ?? "")
      : route.path ?? "";

    const curRoute: FormatRoute = {
      url: fullPath,
      title: route.handle?.name ?? "",
      isActive: false,
      icon: SquareTerminal,
    };

    newRoutes.push(curRoute);

    if (route.children && route.children.length > 0) {
      curRoute.children = formatRoutes(route.children, fullPath);
    }
  });

  return newRoutes;
}
