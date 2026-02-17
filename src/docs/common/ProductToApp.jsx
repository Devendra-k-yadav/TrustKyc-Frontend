const ProductToApp = () => {
  return (
    <>
      <h2 style={{ fontSize: 28, marginBottom: 12 }}>
        Products to App Mapping
      </h2>

      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        Products are assigned to applications (Apps) to control and secure API
        access. Each App represents a logical integration, and only the products
        mapped to an App can be accessed using that App’s API key.
      </p>

      <h3 style={{ marginTop: 24 }}>How Mapping Works</h3>
      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        An App can have one or more products assigned to it. When an API request
        is made, the system validates whether the requested product is mapped to
        the App associated with the API key.
      </p>

      <h3 style={{ marginTop: 24 }}>Why Product-to-App Mapping Is Required</h3>
      <ul style={{ paddingLeft: 20, lineHeight: "1.8", color: "#444" }}>
        <li>🔐 Enforces access control at the product level</li>
        <li>📊 Enables accurate usage tracking and billing</li>
        <li>🧩 Supports multiple integrations under a single account</li>
        <li>🚫 Prevents unauthorized access to unassigned APIs</li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Example Mapping</h3>
      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        In the example below, a single App is authorized to access multiple
        verification products.
      </p>

      <div
        style={{
          background: "#f8f9fa",
          padding: 16,
          borderRadius: 6,
          fontFamily: "monospace",
          fontSize: 14,
          whiteSpace: "pre-wrap",
        }}
      >
        {`App Name: KYC_APP
App Key: sk_live_xxxxx

Assigned Products:
- PAN Verification Lite
- Voter ID Lite
- OCR Lite`}
      </div>

      <h3 style={{ marginTop: 24 }}>Access Control Behavior</h3>
      <ul style={{ paddingLeft: 20, lineHeight: "1.8", color: "#444" }}>
        <li>
          Requests for assigned products are processed normally
        </li>
        <li>
          Requests for unassigned products are rejected with an authorization
          error
        </li>
        <li>
          Usage is tracked separately per App and product
        </li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Best Practices</h3>
      <ul style={{ paddingLeft: 20, lineHeight: "1.8", color: "#444" }}>
        <li>Create separate Apps for different environments (dev, staging, prod)</li>
        <li>Assign only the required products to each App</li>
        <li>Rotate API keys if an App’s access scope changes</li>
        <li>Review product mappings periodically</li>
      </ul>
    </>
  );
};

export default ProductToApp;
