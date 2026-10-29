"use strict";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar/Navbar";

export default function HomeRoute() {
    const navigate = useNavigate();

    return (
        <>
            <Navbar/>

            <button onClick={
                () => navigate("/project/marcus/saver-cli/dev")}
            >Project</button>
            <button onClick={() => navigate("/profile")}>Profile</button>
        </>
    )
}