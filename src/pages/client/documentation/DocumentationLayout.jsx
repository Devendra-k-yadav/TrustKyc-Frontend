import { useState } from "react";
import DocsSidebar from "../../../components/documentation/DocsSidebar";
import DocsContent from "../../../components/documentation/DocsContent";

const DocumentationLayout = () => {
  const [activeDoc, setActiveDoc] = useState("introduction");

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      {/* 🔹 FIXED SIDEBAR */}
      <div
        style={{
          width: 280,
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          borderRight: "1px solid #e5e7eb",
          background: "#fff",
          zIndex: 10,
        }}
      >
        <DocsSidebar
          activeDoc={activeDoc}
          setActiveDoc={setActiveDoc}
        />
      </div>

      {/* 🔹 CONTENT AREA */}
      <div
        style={{
          marginLeft: 280,        // 👈 space for fixed sidebar
          flex: 1,
          height: "100vh",
          overflowY: "auto",
          padding: "24px 32px",   // 👈 controlled padding
        }}
      >
        <DocsContent activeDoc={activeDoc} />
      </div>
    </div>
  );
};

export default DocumentationLayout;
