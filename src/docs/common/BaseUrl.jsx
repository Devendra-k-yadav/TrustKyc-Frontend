const BaseUrl = () => {
  return (
    <>
      <h2 style={{ fontSize: 28, marginBottom: 12 }}>
        API Base URL
      </h2>

      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        All API requests must be made using the base URL provided below. This
        base URL represents the root endpoint for all available APIs and ensures
        proper routing and version control.
      </p>

      <div
        style={{
          background: "#f8f9fa",
          padding: 16,
          borderRadius: 6,
          fontFamily: "monospace",
          fontSize: 14,
          marginTop: 12,
        }}
      >
        https://api.yourdomain.com/v1
      </div>

      <h3 style={{ marginTop: 24 }}>How to Use the Base URL</h3>
      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        All API endpoints should be appended to the base URL. For example, to
        access a verification endpoint, combine the base URL with the specific
        endpoint path.
      </p>

      <div
        style={{
          background: "#111",
          color: "#0f0",
          padding: 16,
          borderRadius: 6,
          fontFamily: "monospace",
          fontSize: 14,
          overflowX: "auto",
        }}
      >
        {`POST https://api.yourdomain.com/v1/verify`}
      </div>

      <h3 style={{ marginTop: 24 }}>API Versioning</h3>
      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        The <code>/v1</code> segment represents the current API version. Versioned
        endpoints allow us to introduce improvements and new features without
        breaking existing integrations.
      </p>

      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        When new versions are released, existing versions will continue to be
        supported for a defined deprecation period.
      </p>
    </>
  );
};

export default BaseUrl;
