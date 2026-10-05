import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../store/auth";

export const Navbar = () => {

    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <>
            <header>
                <div className="container">

                    <div className="logo-brand">
                        <NavLink to="/">
                            HopeWell City Hospital
                        </NavLink>
                    </div>

                    <nav>
                        <ul>

                            <li>
                                <NavLink to="/">
                                    Home
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/about">
                                    About
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/contact">
                                    Contact
                                </NavLink>
                            </li>

                            {isLoggedIn ? (
                                <li>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="navbar-logout"
                                    >
                                        Logout
                                    </button>
                                </li>
                            ) : (
                                <>
                                    <li>
                                        <NavLink to="/register">
                                            Register
                                        </NavLink>
                                    </li>

                                    <li>
                                        <NavLink to="/login">
                                            Login
                                        </NavLink>
                                    </li>
                                </>
                            )}

                        </ul>
                    </nav>

                </div>
            </header>
        </>
    );
};