import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "@assets/css/forms/signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    contact: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if(name == password && value == ""){
      setShowPassword(false)
    }
    if(name == confirmPassword && value == ""){
      setShowPassword(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // integrate API later
    console.log(formData);
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <h2 className="authTitle">Sign Up</h2>

        <form onSubmit={handleSubmit} className="authForm">
          {/* Email */}
          <div className="inputGroup">
            <Mail size={18} className="inputIcon" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contact */}
          <div className="inputGroup">
            <Phone size={18} className="inputIcon" />
            <input
              type="text"
              name="contact"
              placeholder="Enter your contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>

          {/* Address */}
          <div className="inputGroup">
            <MapPin size={18} className="inputIcon" />
            <input
              type="text"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="inputGroup">
            <Lock size={18} className="inputIcon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggleIcon"
              style={{
                opacity: formData.password ? 1 : 0.4,
                cursor: formData.password ? "pointer" : "not-allowed",
              }}
              onClick={() => {
                if(formData.password){
                  setShowPassword( prev => !prev )
                }
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="inputGroup">
            <Lock size={18} className="inputIcon" />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <span
              className="toggleIcon"
              style={{
                opacity: formData.password ? 1 : 0.4,
                cursor: formData.password ? "pointer" : "not-allowed",
              }}

              onClick={() => {
                if(formData.password){
                  setShowPassword( prev => !prev )
                }
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button type="submit" className="authButton">
            Sign Up
          </button>
        </form>

        <div className="authFooter">
          Already have an account?
          <span onClick={() => navigate("/login")}>Login</span>
        </div>
      </div>
    </div>
  );
}

export default Signup;