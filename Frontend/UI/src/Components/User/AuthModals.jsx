// src/components/User/AuthModals.jsx
import { useState } from "react";
import LoginModal from "./LoginModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import OTPVerificationModal from "./OTPVerificationModal";
import ResetPasswordModal from "./ResetPasswordModal";

let openLoginModalFn; // global function holder

// ✅ exported function for other components
export function openLoginModal() {
  if (openLoginModalFn) openLoginModalFn();
}

export default function AuthModals() {
  const [showLogin, setShowLogin] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const [resetUserId, setResetUserId] = useState(null);

    // assign the global trigger
  openLoginModalFn = () => setShowLogin(true);

  return (
    <>
      {/* Example trigger to open login (you can replace with Navbar button later) */}
      <button
        onClick={() => setShowLogin(true)}
        className="px-4 py-2 bg-[#FBB01A] text-black rounded-lg font-semibold"
      >
        Open Login
      </button>

      {/* 🔹 Login Modal */}
      {showLogin && (
        <LoginModal
          open={showLogin}
          onClose={() => setShowLogin(false)}
          onForgotPassword={() => {
            console.log("AuthModals: opening ForgotPasswordModal");
            setShowLogin(false);  // close login
            setShowForgot(true); // open forgot
          }}
        />
      )}

      {/* 🔹 Forgot Password Modal */}
      {showForgot && (
        <ForgotPasswordModal
          onClose={() => setShowForgot(false)}
          onOtpSent={() => {
            setShowForgot(false);
            setShowOtp(true);   // after sending OTP → open OTP modal
          }}
        />
      )}

      {/* 🔹 OTP Verification Modal */}
      {showOtp && (
        <OTPVerificationModal
          onVerified={(userId) => {
            setResetUserId(userId);
            setShowOtp(false);
            setShowReset(true); // after OTP verified → open reset password
          }}
          onClose={() => setShowOtp(false)}
        />
      )}

      {/* 🔹 Reset Password Modal */}
      {showReset && (
        <ResetPasswordModal
          email={resetUserId}   // 🔹 Pass as email
          onClose={() => setShowReset(false)}
        />
      )}
    </>
  );
}
