"use strict";

import { Outlet, redirect } from "react-router";
import type { Route } from "../+types/root";

export async function loader({request}: Route.LoaderArgs ) {
    const isAuthenticated = true;

    if (!isAuthenticated) {
        throw redirect("/auth/login");
    }
    return null;
}

export default function ProtectedRoute() {
    return <Outlet/>;
}