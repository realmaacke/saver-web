import {
    type RouteConfig,
    index,
    route,
    layout,
    prefix
} from "@react-router/dev/routes";

export default [
    route("auth", "routes/auth/AuthLayout.tsx", [
        route("login", "routes/auth/LoginPage.tsx"),
        route("register", "routes/auth/RegisterPage.tsx")
    ]),

    // Protected
    layout("routes/ProtectedRoute.tsx", [
        index("routes/HomeRoute.tsx"),

        ...prefix("project", [
            route(":username/:projectName/:chapter", "routes/project/ProjectRoute.tsx")
        ]),

        ...prefix("profile", [
            route(":username", "routes/profile/ProfileRoute.tsx")
        ])

    ]),
] satisfies RouteConfig;
