import DocsSection from "../../../components/docs/DocsSection";
import DocsTable from "../../../components/docs/DocsTable";
import DocsResponse from "../../../components/docs/DocsResponse";
import ApiMethodBadge from "../../../components/docs/ApiMethodBadge";
import Collapsible from "../../../components/docs/Collapsible";


const DlLite = () => {
  return (
    <div style={{ padding: "0 16px" }}>
      <h2>
        DL Lite <ApiMethodBadge method="POST" />
      </h2>

      <p>
        The Driving License Lite API is used for basic driving license verification.
      </p>

      <h4>Product Code</h4>
      <code>DL_LITE</code>

      <h4 style={{ marginTop: 24 }}>Features</h4>
      <ul>
        <li>DL number validation</li>
        <li>Name match</li>
      </ul>

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
              example: '{ "dl_number": "DL1234567890" }',
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
    "dl_number": "DL1234567890",
    "name": "John Doe",
    "valid": true
  }
}`}
          />
        </Collapsible>

        <Collapsible title="400 Bad Request">
          <DocsResponse
            code="Error"
            response={`{
  "status": "error",
  "message": "Invalid DL number format"
}`}
          />
        </Collapsible>

        <Collapsible title="500 Internal Server Error">
          <DocsResponse
            code="Server Error"
            response={`{
  "status": "error",
  "message": "Something went wrong"
}`}
          />
        </Collapsible>
      </DocsSection>
    </div>
  );
};

export default DlLite;
