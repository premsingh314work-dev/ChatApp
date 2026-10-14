import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import type { SignupFormData } from "../types/auth.js";

const SignupFormcomponent = () => {
  const [Form, setForm] = useState<SignupFormData>({
    fullName: "",
    email: "",
    password: "",
  });

  const { isSigningUp, signup } = useAuthStore();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...Form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signup(Form);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm block mb-1">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={Form.fullName}
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
        disabled={isSigningUp}
        className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 rounded-md font-semibold transition disabled:opacity-50"
      >
        {isSigningUp ? "Signing up..." : "Signup"}
      </button>
    </form>
  );
};

export default SignupFormcomponent;
