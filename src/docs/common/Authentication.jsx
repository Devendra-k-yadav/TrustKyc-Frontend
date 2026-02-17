const Authentication = () => {
  return (
    <>
      <h2 style={{ fontSize: 28, marginBottom: 12 }}>
        Authentication
      </h2>

      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        All API requests must be authenticated using an API key. Authentication
        ensures secure access to the platform and helps track usage and billing
        for each client.
      </p>

      <h3 style={{ marginTop: 24 }}>Authentication Method</h3>
      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        We use <strong>API Key–based authentication</strong>. Each request must
        include your API key in the <code>Authorization</code> header using the
        Bearer token scheme.
      </p>

      <div
        style={{
          background: "#f8f9fa",
          padding: 16,
          borderRadius: 6,
          fontFamily: "monospace",
          fontSize: 14,
          marginTop: 8,
        }}
      >
        Authorization: Bearer YOUR_API_KEY
      </div>

      <h3 style={{ marginTop: 24 }}>Generating an API Key</h3>
      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        API keys can be generated from the <strong>Client Dashboard</strong>.
        Navigate to <strong>API Management</strong>, create a new key, and use it
        to authenticate all API requests.
      </p>

      <h3 style={{ marginTop: 24 }}>Security Best Practices</h3>
      <ul style={{ paddingLeft: 20, lineHeight: "1.8", color: "#444" }}>
        <li>🔐 Never share your API key publicly or commit it to source control</li>
        <li>🌱 Store API keys in environment variables</li>
        <li>🔁 Rotate API keys periodically for enhanced security</li>
        <li>🚫 Immediately revoke compromised keys from the dashboard</li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Authentication Errors</h3>
      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        Requests without a valid API key or with an invalid key will be rejected
        with an authentication error response.
      </p>

      <div
        style={{
          background: "#f8f9fa",
          padding: 16,
          borderRadius: 6,
          fontFamily: "monospace",
          fontSize: 14,
        }}
      >
        {`{
  "success": false,
  "message": "Unauthorized request",
  "errorCode": "INVALID_API_KEY"
}`}
      </div>
    </>
  );
};

export default Authentication;
