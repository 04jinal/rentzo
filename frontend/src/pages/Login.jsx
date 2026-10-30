import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Login successful 🎉");

            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Server se connect nahi ho pa raha.");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">

                {/* Left Side */}
                <div className="auth-brand">
                    <div className="auth-brand-content">
                        <img
                            src={logo}
                            alt="Rentzo"
                            className="auth-logo"
                        />

                        <h2>
                            Rent What You Need.
                            <br />
                            Earn From What You Own.
                        </h2>

                        <p>
                            India’s rental marketplace where people
                            can rent useful products or earn money
                            from things they already own.
                        </p>

                        <div className="auth-features">
                            <span>✓ Easy to rent</span>
                            <span>✓ Earn from your items</span>
                            <span>✓ Built for India</span>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="auth-form-wrapper">
                    <form className="auth-form" onSubmit={handleLogin}>


                        <h1>Welcome Back</h1>

                        <p className="auth-subtitle">
                            Login to your Rentzo account
                        </p>

                        <label>Email Address</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button type="submit">
                            Login
                        </button>

                        <p className="auth-bottom-text">
                            Don't have an account?{" "}
                            <Link to="/register">
                                Create Account
                            </Link>
                        </p>

                    </form>
                </div>

            </div>
        </div>
    );
}

export default Login;