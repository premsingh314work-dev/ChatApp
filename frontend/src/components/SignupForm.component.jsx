import React, { useState } from "react";
import { SignUpAPI } from "../api/API.js";
import { useNavigate } from "react-router-dom";

const SignupFormcomponent = () => {
  const [Form, setForm] = useState({ FullName:"",email: "", password: "" });
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...Form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    setError("");
    try {
      const data = await SignUpAPI(Form);
      console.log("Success:", data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      console.log("error: ", err.response?.data?.message);
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm block mb-1">Full Name</label>
          <input
            type="text"
            name="FullName"
            value={Form.FullName}
            onChange={handleChange}
            required
            placeholder="johndoe"
            className="w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label className="text-sm block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={Form.email}
            onChange={handleChange}
            required
            placeholder="johndoe@gmail.com"
            className="w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={Form.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            className="w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 rounded-md font-semibold transition"
        >
          {loading ? "Logging in.." : "Login"}
        </button>
      </form>
    </>
  );
};
export default SignupFormcomponent;
