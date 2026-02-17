import { useState } from "react";

const Collapsible = ({ title, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ marginTop: 16 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
        }}
      >
        <span>{title}</span>
        <span>{open ? "−" : "+"}</span>
      </div>

      {open && <div style={{ marginTop: 8 }}>{children}</div>}
    </div>
  );
};

export default Collapsible;
