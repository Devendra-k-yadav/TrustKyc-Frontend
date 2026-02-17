import DocsSection from "../../../components/docs/DocsSection";
import DocsTable from "../../../components/docs/DocsTable";
import DocsResponse from "../../../components/docs/DocsResponse";
import ApiMethodBadge from "../../../components/docs/ApiMethodBadge";
import Collapsible from "../../../components/docs/Collapsible";

const Ocr = () => {
  return (
    <div style={{ padding: "0 16px" }}>
      {/* Heading + Method */}
      <h2>
        OCR Lite <ApiMethodBadge method="POST" />
      </h2>

      <p>
        The OCR Lite API is used to extract text from images and PDF documents.
      </p>

      {/* Product Code */}
      <h4>Product Code</h4>
      <code>OCR_EXTRACT</code>

      {/* Features */}
      <h4 style={{ marginTop: 24 }}>Features</h4>
      <ul>
        <li>Text extraction</li>
        <li>Image & PDF support</li>
        <li>Fast processing</li>
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
  "file_url": "https://example.com/sample.pdf"
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
    "text": "Extracted text from document",
    "confidence": 0.98
  }
}`}
          />
        </Collapsible>

        <Collapsible title="400 Bad Request">
          <DocsResponse
            code="Error"
            response={`{
  "status": "error",
  "message": "Invalid file format or URL"
}`}
          />
        </Collapsible>

        <Collapsible title="500 Internal Server Error">
          <DocsResponse
            code="Server Error"
            response={`{
  "status": "error",
  "message": "OCR processing failed"
}`}
          />
        </Collapsible>
      </DocsSection>
    </div>
  );
};

export default Ocr;
