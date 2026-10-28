"use strict";
import React, { useState, useRef, useEffect } from "react";

import { 
Home, Telescope, Newspaper,
FolderGit2, UserPen, CogIcon, LogOut
} from "lucide-react";

import logo from "../../assets/logo.png";
import user from "../../assets/user_img.png";

import "./Navbar.css";
import { useNavigate } from "react-router";
export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const handleClick = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div className="navbar-wrapper">
            <div className="navbar-section">
                <div className="navbar-logo">
                    <a href="/">
                        <img src={logo} alt="logo" />
                    </a>
                </div>
            </div>


            { loggedIn ? (
            
            <div className="navbar-section">
                <button className="navbar-button">
                   <Home size={16}/>Home
                </button>
                <button className="navbar-button"> <Telescope size={16}/> Explore</button>
                <div className="navbar-search">
                    <form>
                        <input type="text" placeholder="Search..."/>
                    </form>
                </div>
                <button className="navbar-button"><Newspaper size={16} /> Feed</button>

                <button className="navbar-button"><FolderGit2 size={16}/> Projects</button>
            </div>
        
            ) : (

            <div className="navbar-section">
                <button className="navbar-button">
                   <Home size={16}/>Home
                </button>
                <div className="navbar-search">
                    <form>
                        <input type="text" placeholder="Search..."/>
                    </form>
                </div>
                <button className="navbar-button"> <Telescope size={16}/> Explore</button>
            </div>

            )}

            <div className="navbar-section">
                <div className="navbar-profile" ref={profileRef}>
                    { loggedIn ? (
                        <img src={user} alt="user" onClick={() => setOpen(!open)}/>
                    ) : (
                        <button className="navbar-button extra-big" onClick={() => navigate("/auth/login")}>Sign in</button>
                    )}

                    { open && (
                        <div className="navbar-dropdown">
                            <button className="navbar-dropdown-item"><UserPen size={16}/>Profile</button>
                            <button className="navbar-dropdown-item"><CogIcon size={16}/> Settings</button>
                            <button className="navbar-dropdown-item"><LogOut size={16}/> Sign out</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}