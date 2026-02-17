import DocsSection from "../../../components/docs/DocsSection";
import DocsTable from "../../../components/docs/DocsTable";
import DocsResponse from "../../../components/docs/DocsResponse";
import ApiMethodBadge from "../../../components/docs/ApiMethodBadge";
import Collapsible from "../../../components/docs/Collapsible";

const Ifsc = () => {
  return (
    <div style={{ padding: "0 16px" }}>
      {/* Heading + Method */}
      <h2>
        IFSC Verification Lite <ApiMethodBadge method="POST" />
      </h2>

      <p>
        The IFSC Verification API is used to verify bank and branch details.
      </p>

      {/* Product Code */}
      <h4>Product Code</h4>
      <code>IFSC_VERIFY</code>

      {/* Features */}
      <h4 style={{ marginTop: 24 }}>Features</h4>
      <ul>
        <li>Bank name</li>
        <li>Branch details</li>
        <li>MICR code</li>
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
              example: '{ "ifsc": "SBIN0001234" }',
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
    "bank_name": "State Bank of India",
    "branch": "MG Road",
    "micr_code": "123456789",
    "ifsc": "SBIN0001234"
  }
}`}
          />
        </Collapsible>

        <Collapsible title="300 Multiple Choices">
          <DocsResponse
            code="Warning"
            response={`{
  "status": "warning",
  "message": "Multiple branches found for the IFSC code",
  "data": [...]
}`}
          />
        </Collapsible>

        <Collapsible title="400 Bad Request">
          <DocsResponse
            code="Error"
            response={`{
  "status": "error",
  "message": "Invalid IFSC code format"
}`}
          />
        </Collapsible>

        <Collapsible title="500 Internal Server Error">
          <DocsResponse
            code="Server Error"
            response={`{
  "status": "error",
  "message": "Something went wrong on the server"
}`}
          />
        </Collapsible>
      </DocsSection>
    </div>
  );
};

export default Ifsc;
