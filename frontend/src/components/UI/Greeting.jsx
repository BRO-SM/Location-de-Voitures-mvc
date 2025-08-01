//src/UI/switalert/Greeting.jsx
import Swal from "sweetalert2";

const Switgreeting = ({ title }) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "success",
    title: title,
  });
  return null;
};

export default Switgreeting ;

