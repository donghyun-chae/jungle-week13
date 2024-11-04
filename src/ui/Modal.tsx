import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = ({ children, open }) => {
  const dialog = useRef();

  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    }
  }, [open]);
  return createPortal(
    <dialog open={open}>{children}</dialog>,
    document.getElementById("modal")
  );
};

export default Modal;
