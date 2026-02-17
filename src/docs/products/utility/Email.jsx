import DocsSection from "../../../components/docs/DocsSection";
import DocsTable from "../../../components/docs/DocsTable";
import DocsResponse from "../../../components/docs/DocsResponse";
import ApiMethodBadge from "../../../components/docs/ApiMethodBadge";
import Collapsible from "../../../components/docs/Collapsible";

const Email = () => {
  return (
    <div style={{ padding: "0 16px" }}>
      {/* Heading + Method */}
      <h2>
        Email Verification Lite <ApiMethodBadge method="POST" />
      </h2>

      <p>
        Email Verification API quickly checks the validity of an email address
        including domain and disposable email detection.
      </p>

      {/* Product Code */}
      <h4>Product Code</h4>
      <code>EMAIL_VERIFY</code>

      {/* Features */}
      <h4 style={{ marginTop: 24 }}>Features</h4>
      <ul>
        <li>Email format validation</li>
        <li>Domain check</li>
        <li>Disposable email detection</li>
      </ul>

      {/* Pre Approved */}
      <h4>Pre Approved</h4>
      <p>Yes</p>

      {/* Headers */}
      <DocsSection title="Headers">
        <DocsTable
          headers={["Header", "Example"]}
          rows={[
            { name: "api-key", example: "12345ABCDE" },
            { name: "app-id", example: "APP123456" },
            { name: "Content-Type", example: "application/json" },
          ]}
        />
      </DocsSection>

      {/* Request Body */}
      <DocsSection title="Request Body">
        <DocsTable
          headers={["Parameter", "Example"]}
          rows={[
            {
              name: "data",
              example: `{
  "email": "user@example.com"
}`,
            },
            { name: "mode", example: "test" },
            { name: "task-id", example: "TASK123456" },
          ]}
        />
      </DocsSection>

      {/* Responses */}
      <DocsSection title="Responses">
        <Collapsible title="200 OK">
          <DocsResponse
            code="Success"
            response={`{
  "status": "success",
  "data": {
    "email": "user@example.com",
    "is_valid": true,
    "domain": "example.com",
    "is_disposable": false
  }
}`}
          />
        </Collapsible>

        <Collapsible title="400 Bad Request">
          <DocsResponse
            code="Error"
            response={`{
  "status": "error",
  "message": "Invalid email format"
}`}
          />
        </Collapsible>

        <Collapsible title="500 Internal Server Error">
          <DocsResponse
            code="Server Error"
            response={`{
  "status": "error",
  "message": "Email verification service unavailable"
}`}
          />
        </Collapsible>
      </DocsSection>
    </div>
  );
};

export default Email;
