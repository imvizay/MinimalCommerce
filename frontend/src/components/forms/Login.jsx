import '@assets/css/forms/login.css'

import { useState } from "react";

import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";


function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))

    if(name == "password" && value == ""){
      setShowPassword(false)
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // integrate API later
    console.log(formData);
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <h2 className="authTitle">Login</h2>

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

          {/* Password */}
          <div className="inputGroup">
            <Lock size={18} className="inputIcon" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
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
                  setShowPassword((prev)=>!prev)
                }
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button type="submit" className="authButton">
            Login
          </button>
        </form>

        <div className="authFooter">
          Don't have an account?
          <span onClick={() => navigate("/signup")}>Create</span>
        </div>
      </div>
    </div>
  );
}

export default Login;