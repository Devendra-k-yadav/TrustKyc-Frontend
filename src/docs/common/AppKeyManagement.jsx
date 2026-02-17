const AppKeyManagement = () => {
  return (
    <>
      <h2 style={{ fontSize: 28, marginBottom: 12 }}>
        App Key Management
      </h2>

      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        Each application (App) is issued a unique API key used to authenticate
        API requests. API keys define the scope of access based on the products
        assigned to the App.
      </p>

      <h3 style={{ marginTop: 24 }}>API Key Lifecycle</h3>
      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        API keys can be managed directly from the Client Dashboard. The platform
        supports a complete key lifecycle to maintain security and operational
        control.
      </p>

      <h3 style={{ marginTop: 24 }}>Key Operations</h3>
      <ul style={{ paddingLeft: 20, lineHeight: "1.8", color: "#444" }}>
        <li>
          <strong>Generate API Key</strong> – Create a new key for an App
        </li>
        <li>
          <strong>Regenerate API Key</strong> – Rotate the existing key if it is
          compromised
        </li>
        <li>
          <strong>Disable / Enable Key</strong> – Temporarily suspend or restore
          API access
        </li>
        <li>
          <strong>Delete Key</strong> – Permanently revoke API access for the App
        </li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Security Best Practices</h3>
      <ul style={{ paddingLeft: 20, lineHeight: "1.8", color: "#444" }}>
        <li>🔐 Never share API keys with third parties</li>
        <li>🌱 Store keys securely using environment variables</li>
        <li>🔁 Rotate keys periodically or after personnel changes</li>
        <li>🚫 Disable keys immediately if suspicious activity is detected</li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Access Control Behavior</h3>
      <ul style={{ paddingLeft: 20, lineHeight: "1.8", color: "#444" }}>
        <li>Only enabled keys can be used to access APIs</li>
        <li>Disabled or deleted keys result in authorization errors</li>
        <li>Usage is tracked per App and API key</li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Important Notes</h3>
      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        API keys grant full access to the products assigned to an App. Treat them
        like passwords and ensure they are protected at all times.
      </p>
    </>
  );
};

export default AppKeyManagement;
