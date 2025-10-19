import React, { useState } from "react";
import Input from "../../../utils/Input";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { toast } from "react-toastify";
 
import { useNavigate } from "react-router-dom";

const SignIn = ({ setSignReq, setModal }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form[("email", "password")] === "") {
      toast.error("All fields are required!!!");
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Login failed");
      localStorage.setItem("token", json.token);
      localStorage.setItem("user", JSON.stringify(json.user));
      navigate("/");
      toast.success("Signed in successfully");
      if (setModal) setModal(false);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-[520px] mx-auto mt-10 text-center">
      <h2 className="text-3xl font-semibold">Sign in with email</h2>
      <p className="w-full sm:w-[25rem] mx-auto py-6 text-gray-600">
        Enter the email address associated with your account, and we’ll send a
        magic link to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        <Input form={form} setForm={setForm} type="email" title="email" />
        <Input form={form} setForm={setForm} type="password" title="password" />
        <div className="flex justify-center">
          <button
            className={`px-5 py-2 text-sm rounded-full bg-green-700
          hover:bg-green-800 text-white inline-flex items-center justify-center
          ${loading ? "opacity-50 pointer-events-none" : ""}`}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setSignReq("")}
          className="text-sm text-green-600 hover:text-green-700 flex items-center">
          <MdKeyboardArrowLeft />
          <span className="ml-1">All sign in options</span>
        </button>
      </div>
    </div>
  );
};

export default SignIn;
