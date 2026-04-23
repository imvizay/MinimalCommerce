import React from "react";
import "@/assets/css/information/login_prompt.css";
import { useNavigate } from "react-router-dom";

function LoginPromptModal({ onClose, onLogin }) {
  const navigate = useNavigate()
  return (
    <div className="overlay">

      <div className="modalBox">
        <h2>Login Required</h2>
        <p>You need to login to proceed with payment.</p>

        <div className="modalActions">
          <button className="cancelBtn" onClick={()=>onClose(prev=>!prev)}>
            Cancel
          </button>

          <button className="loginBtn" onClick={()=>navigate('/login')}>
            Login Now
          </button>
        </div>
      </div>

    </div>
  );
}

export default LoginPromptModal;