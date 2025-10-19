import React, { useState } from "react";
import Modal from "../../../utils/Modal";
import { LiaTimesSolid } from "react-icons/lia";
import { AiOutlineMail } from "react-icons/ai";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
 

const Auth = ({ modal, setModal }) => {
  const [createUser, setCreateUser] = useState(false);
  const [signReq, setSignReq] = useState("");
  

  return (
    <Modal modal={modal} setModal={setModal}>
      <section
        className={`z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[90%] max-w-[720px] bg-white rounded-2xl shadow-xl transition-transform duration-300
        ${modal ? "visible opacity-100 scale-100" : "invisible opacity-0 scale-95"}`}>
        <button
          onClick={() => setModal(false)}
          className="absolute top-8 right-8 text-2xl hover:opacity-50">
          <LiaTimesSolid />
        </button>
        <div className="flex flex-col justify-center items-center gap-6 p-8">
          {signReq === "" ? (
            <>
              <h2 className="text-3xl font-semibold pt-2">
                {createUser ? "Join Medium" : "Welcome Back"}
              </h2>
              <p className="text-center text-gray-600 max-w-[34rem]">
                Enter the email address associated with your account.
              </p>
              <div className="flex flex-col gap-3 w-full max-w-[22rem] mx-auto mt-2">
                <Button
                  click={() => setSignReq(createUser ? "sign-up" : "sign-in")}
                  icon={<AiOutlineMail className="text-xl" />}
                  text={`${createUser ? "Sign up" : "Sign in"} with email`}
                />
              </div>
              <p>
                {createUser ? "Already have an account" : "No Account"}
                <button
                  onClick={() => setCreateUser(!createUser)}
                  className="text-green-600 hover:text-green-700 font-bold ml-1">
                  {createUser ? "Sign In" : "Create one"}
                </button>
              </p>
            </>
          ) : signReq === "sign-in" ? (
            <SignIn setModal={setModal} setSignReq={setSignReq} />
          ) : signReq === "sign-up" ? (
            <SignUp setModal={setModal} setSignReq={setSignReq} />
          ) : null}
          <p className="md:w-[30rem] mx-auto text-center text-xs text-gray-500 pb-6">
            Click “Sign In” to agree to Medium’s Terms of Service and
            acknowledge that Medium’s Privacy Policy applies to you.
          </p>
        </div>
      </section>
    </Modal>
  );
};

export default Auth;

const Button = ({ icon, text, click }) => {
  return (
    <button
      onClick={click}
      className="flex items-center justify-center gap-2 w-full border border-gray-800
        px-4 py-2 rounded-full hover:bg-gray-900 hover:text-white transition-colors">
      {icon} <span className="font-medium">{text}</span>
    </button>
  );
};
