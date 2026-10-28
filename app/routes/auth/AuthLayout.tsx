"use strict";

import { Outlet } from "react-router";

export default function AuthLayout() {
    return (
        <>
            <h1>Auth layout</h1>
            <Outlet/>
        </>
    );
}