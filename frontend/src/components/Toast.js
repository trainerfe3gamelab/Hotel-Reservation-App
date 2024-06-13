import React, { useEffect } from "react";
import { Toast as BootstrapToast, ToastContainer } from "react-bootstrap";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const bgClass = type === "SUCCESS" ? "bg-success" : "bg-danger";

  return (
    <ToastContainer
      position="top-end"
      className="p-3"
      style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999 }}
    >
      <BootstrapToast
        onClose={onClose}
        delay={5000}
        autohide
        className={`text-white ${bgClass}`}
      >
        <BootstrapToast.Body>{message}</BootstrapToast.Body>
      </BootstrapToast>
    </ToastContainer>
  );
};

export default Toast;
