import DocsSection from "../../../components/docs/DocsSection";
import DocsTable from "../../../components/docs/DocsTable";
import DocsResponse from "../../../components/docs/DocsResponse";
import ApiMethodBadge from "../../../components/docs/ApiMethodBadge";
import Collapsible from "../../../components/docs/Collapsible";

const GstAdvance = () => {
  return (
    <div style={{ padding: "0 16px" }}>
      {/* Heading + Method */}
      <h2>
        GST Advance <ApiMethodBadge method="POST" />
      </h2>

      <p>
        The GST Advance API provides advanced verification and validation
        of GST numbers with detailed business information.
      </p>

      {/* Product Code */}
      <h4>Product Code</h4>
      <code>GST_ADVANCE</code>

      {/* Features */}
      <h4 style={{ marginTop: 24 }}>Features</h4>
      <ul>
        <li>GST number validation</li>
        <li>Business details fetch</li>
        <li>Filing status check</li>
      </ul>

      {/* Trial Limit */}
      <h4>Trial Limit</h4>
      <p>40 requests</p>

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
  "gst_number": "27AAPFU0939F1ZV"
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
    "gst_number": "27AAPFU0939F1ZV",
    "business_name": "ABC Traders",
    "status": "Active",
    "filing_status": "Filed"
  }
}`}
          />
        </Collapsible>

        <Collapsible title="400 Bad Request">
          <DocsResponse
            code="Error"
            response={`{
  "status": "error",
  "message": "Invalid GST number"
}`}
          />
        </Collapsible>

        <Collapsible title="500 Internal Server Error">
          <DocsResponse
            code="Server Error"
            response={`{
  "status": "error",
  "message": "GST service unavailable"
}`}
          />
        </Collapsible>
      </DocsSection>
    </div>
  );
};

export default GstAdvance;
