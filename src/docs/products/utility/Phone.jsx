import DocsSection from "../../../components/docs/DocsSection";
import DocsTable from "../../../components/docs/DocsTable";
import DocsResponse from "../../../components/docs/DocsResponse";
import ApiMethodBadge from "../../../components/docs/ApiMethodBadge";
import Collapsible from "../../../components/docs/Collapsible";

const Phone = () => {
  return (
    <div style={{ padding: "0 16px" }}>
      {/* Heading + Method */}
      <h2>
        Phone Verification Lite <ApiMethodBadge method="POST" />
      </h2>

      <p>
        Phone Verification API checks phone number validity, ownership,
        operator details, and line status.
      </p>

      {/* Product Code */}
      <h4>Product Code</h4>
      <code>PHONE_VERIFY</code>

      {/* Features */}
      <h4 style={{ marginTop: 24 }}>Features</h4>
      <ul>
        <li>Number validity</li>
        <li>Operator information</li>
        <li>Line status</li>
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
  "phone": "9876543210"
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
    "phone": "9876543210",
    "is_valid": true,
    "operator": "Airtel",
    "line_type": "Mobile",
    "status": "Active"
  }
}`}
          />
        </Collapsible>

        <Collapsible title="400 Bad Request">
          <DocsResponse
            code="Error"
            response={`{
  "status": "error",
  "message": "Invalid phone number"
}`}
          />
        </Collapsible>

        <Collapsible title="500 Internal Server Error">
          <DocsResponse
            code="Server Error"
            response={`{
  "status": "error",
  "message": "Phone verification service unavailable"
}`}
          />
        </Collapsible>
      </DocsSection>
    </div>
  );
};

export default Phone;
