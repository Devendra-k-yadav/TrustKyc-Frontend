import { useState } from "react";

const DocsResponse = ({ code, response }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ marginTop: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4 style={{ margin: 0 }}>{code}</h4>

        <button
          onClick={copyToClipboard}
          style={{
            fontSize: 12,
            padding: "4px 8px",
            cursor: "pointer",
            border: "1px solid #ccc",
            borderRadius: 4,
            background: "#fff",
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre style={{ background: "#f4f4f4", padding: 12, marginTop: 8 }}>
        {response}
      </pre>
    </div>
  );
};

export default DocsResponse;
