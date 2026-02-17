import { toast } from "react-toastify";

export const confirmToast = (msg, onConfirm) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p className="mb-2">{msg}</p>

        <button
          className="btn btn-sm btn-success me-2"
          onClick={() => {
            onConfirm();
            closeToast();
          }}
        >
          Yes
        </button>

        <button
          className="btn btn-sm btn-danger"
          onClick={closeToast}
        >
          No
        </button>
      </div>
    ),
    { autoClose: false }
  );
};