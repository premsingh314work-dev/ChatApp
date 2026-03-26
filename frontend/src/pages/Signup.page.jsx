import React from "react";
import { MessageCircle } from "lucide-react";
import SignupFormcomponent from "../components/SignupForm.component";
import { Link } from "react-router-dom";
const SignupPage = () => {
  return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800">
        <div className="w-225 h-125 bg-slate-900 rounded-xl overflow-hidden shadow-lg flex ">
          {/* LEFT SIDE */}
          <div className="w-1/2 p-10 flex flex-col justify-center text-white border-slate-800 border-r">
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-2xl font-semibold mb-2 flex flex-col justify-center items-center gap-2">
                <span>
                  <MessageCircle size={40} />
                </span>
                Create Account
              </h2>
              <p className="text-slate-400 mb-6">
                Sign up for a new account
              </p>
            </div>

            <SignupFormcomponent />

            <p className="text-sm text-slate-400 mt-4">
              Already have an account?{" "}
              <span className="text-cyan-400 cursor-pointer">
                <Link to={"/login"}>Login</Link>
              </span>
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-1/2 flex flex-col items-center justify-center text-white p-6">
            {/* 👉 IMAGE PLACEHOLDER */}
            <img src="signup.png" alt="illustration" className="w-72 mb-6" />

            <h3 className="text-lg font-semibold mb-2 text-[#04b6d2]">
              Connect Anytime, Anywhere
            </h3>
            <div className="flex gap-2">
              <span className="bg-cyan-500 text-xs px-3 py-1 rounded-full">
                Secure
              </span>
              <span className="bg-cyan-500 text-xs px-3 py-1 rounded-full">
                Fast
              </span>
              <span className="bg-cyan-500 text-xs px-3 py-1 rounded-full">
                Easy
              </span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SignupPage;
