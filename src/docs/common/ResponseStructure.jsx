const ResponseStructure = () => {
  return (
    <>
      <h2 style={{ fontSize: 28, marginBottom: 12 }}>
        Response Structure
      </h2>

      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        All API endpoints return responses in a consistent JSON format. This
        standardized structure allows developers to reliably handle successful
        responses and errors across the platform.
      </p>

      {/* SUCCESS RESPONSE */}
      <h3 style={{ marginTop: 24 }}>Success Response</h3>
      <p style={{ fontSize: 15, color: "#555", lineHeight: "1.6" }}>
        A successful API request returns <code>success: true</code> along with
        the requested data payload.
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
        {`{
  "success": true,
  "message": "Request successful",
  "data": {}
}`}
      </div>

      {/* ERROR RESPONSE */}
      <h3 style={{ marginTop: 24 }}>Error Response</h3>
      <p style={{ fontSize: 15, color: "#555", lineHeight: "1.6" }}>
        If a request fails, the API returns <code>success: false</code> along with
        an error message and a machine-readable error code.
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
        {`{
  "success": false,
  "message": "Error message",
  "errorCode": "ERROR_CODE"
}`}
      </div>

      {/* FIELD DEFINITIONS */}
      <h3 style={{ marginTop: 24 }}>Response Fields</h3>
      <ul style={{ paddingLeft: 20, lineHeight: "1.8", color: "#444" }}>
        <li>
          <strong>success</strong> – Boolean flag indicating request status
        </li>
        <li>
          <strong>message</strong> – Human-readable description of the response
        </li>
        <li>
          <strong>data</strong> – Response payload returned on success
        </li>
        <li>
          <strong>errorCode</strong> – Unique identifier for error handling
        </li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Important Notes</h3>
      <ul style={{ paddingLeft: 20, lineHeight: "1.8", color: "#444" }}>
        <li>Always check the <code>success</code> flag before processing data</li>
        <li>Error responses may include additional details for debugging</li>
        <li>HTTP status codes should be used alongside the response body</li>
      </ul>
    </>
  );
};

export default ResponseStructure;
