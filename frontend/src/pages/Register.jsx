import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();


    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            whatsappNumber: whatsapp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Registration successful 🎉");

      navigate("/login");
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
            <img src={logo} alt="Rentzo" className="auth-logo" />

            <h2>
              Your Things.
              <br />
              Someone's Need.
            </h2>

            <p>
              List your unused items on Rentzo and
              turn them into extra income.
            </p>

            <div className="auth-features">
              <span>✓ List your items</span>
              <span>✓ Find nearby renters</span>
              <span>✓ Start earning</span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="auth-form-wrapper">
          <form
            className="auth-form"
            onSubmit={handleRegister}
          >

            <h1>Create Account</h1>

            <p className="auth-subtitle">
              Join India’s rental marketplace
            </p>

            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>WhatsApp Number</label>
            <input
              type="tel"
              placeholder="Enter your WhatsApp number"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              pattern="[0-9]{10}"
              maxLength={10}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />

            <button type="submit">
              Create Account
            </button>

            <p className="auth-bottom-text">
              Already have an account?{" "}
              <Link to="/login">
                Login
              </Link>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Register;