import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import type { AuthFormData } from "../types/auth.js";

const LoginFormcomponent = () => {
  const { isLoggingIn, login } = useAuthStore();
  const navigate = useNavigate();

  const [Form, setForm] = useState<AuthFormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...Form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const success = await login(Form);

    if (success) {
      navigate("/");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
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
        disabled={isLoggingIn}
        className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 rounded-md font-semibold transition disabled:opacity-50"
      >
        {isLoggingIn ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginFormcomponent;
