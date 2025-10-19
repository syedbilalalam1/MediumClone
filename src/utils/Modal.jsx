import React from "react";

const Modal = ({ children, modal, setModal }) => {
  return (
    <>
      <div
        onClick={() => setModal(false)}
        className={`backdrop-blur-sm bg-black/40 fixed inset-0 z-50 
      ${
        modal ? "visible opacity-100" : "invisible opacity-0"
      } transition-opacity duration-300`}
      />
      {children}
    </>
  );
};

export default Modal;
