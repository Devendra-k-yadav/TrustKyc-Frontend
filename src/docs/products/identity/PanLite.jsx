import DocsSection from "../../../components/docs/DocsSection";
import DocsTable from "../../../components/docs/DocsTable";
import DocsResponse from "../../../components/docs/DocsResponse";
import ApiMethodBadge from "../../../components/docs/ApiMethodBadge";
import Collapsible from "../../../components/docs/Collapsible";

const PanLite = () => {
  return (
    <div style={{ padding: "0 16px" }}>
      <h2>
        PAN Verification Lite <ApiMethodBadge method="POST" />
      </h2>

      <p>Basic PAN card verification API.</p>

      <h4>Product Code</h4>
      <code>PAN_LITE</code>

      <h4>Features</h4>
      <ul>
        <li>PAN validation</li>
        <li>Name verification</li>
      </ul>

      <h4>Pre Approved</h4>
      <p>Yes</p>

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

      <DocsSection title="Request Body">
        <DocsTable
          headers={["Parameter", "Example"]}
          rows={[
            { name: "data", example: '{ "pan": "ABCDE1234F" }' },
            { name: "mode", example: "test" },
            { name: "task-id", example: "TASK123456" },
          ]}
        />
      </DocsSection>

      <DocsSection title="Responses">
        <Collapsible title="200 OK">
          <DocsResponse
            code="Success"
            response={`{
  "status": "success",
  "data": {
    "pan": "ABCDE1234F",
    "name": "Amit Kumar",
    "valid": true
  }
}`}
          />
        </Collapsible>
      </DocsSection>
    </div>
  );
};

export default PanLite;
