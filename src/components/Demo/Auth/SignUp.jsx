import React, { useState } from "react";
import Input from "../../../utils/Input";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { toast } from "react-toastify";
 
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SignUp = ({ setSignReq, setModal }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form[("username", "email", "password", "rePassword")] === "") {
      toast.error("All fields are required");
    } else if (form["password"] !== form["rePassword"]) {
      toast.error("Your passwords are not matching!!");
      return;
    } else {
      setLoading(true);
      const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${base}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Registration failed");
      localStorage.setItem("token", json.token);
      localStorage.setItem("user", JSON.stringify(json.user));
      toast.success("Account created successfully");
      // redirect to profile after signup
      const user = json.user;
      if (user?.id) {
        navigate(`/profile/${user.id}`);
      } else {
        navigate("/");
      }
      setModal(false);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[520px] mx-auto mt-10 text-center">
      <h2 className="text-3xl font-semibold">Sign up with email</h2>
      <p className="w-full sm:w-[25rem] mx-auto py-6 text-gray-600">
        Enter the email address associated with your account, and we’ll send a
        magic link to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        <Input form={form} setForm={setForm} type="text" title="username" />
        <Input form={form} setForm={setForm} type="email" title="email" />
        <Input form={form} setForm={setForm} type="password" title="password" />
        <Input
          form={form}
          setForm={setForm}
          type="password"
          title="rePassword"
        />
        <div className="flex justify-center">
          <button
            className={`px-5 py-2 text-sm rounded-full bg-green-700
          hover:bg-green-800 text-white inline-flex items-center justify-center
          ${loading ? "opacity-50 pointer-events-none" : ""}`}>
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </div>
      </form>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setSignReq("")}
          className="text-sm text-green-600 hover:text-green-700 flex items-center">
          <MdKeyboardArrowLeft />
          <span className="ml-1">All sign up options</span>
        </button>
      </div>
    </div>
  );
};

export default SignUp;
