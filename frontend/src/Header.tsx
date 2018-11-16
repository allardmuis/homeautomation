import * as React from 'react';
import { Link, NavLink } from "react-router-dom";
import logo from './logo.svg';

export const Header = () => (
    <nav className="navbar navbar-expand navbar-dark bg-dark static-top">
        <Link className="navbar-brand" to="#">
            <img src={logo} className="App-logo" alt="logo" />
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <NavLink className="nav-link" to="/devices">Devices</NavLink>
                </li>
            </ul>
        </div>
    </nav>
)