import DocsSection from "../../../components/docs/DocsSection";
import DocsTable from "../../../components/docs/DocsTable";
import DocsResponse from "../../../components/docs/DocsResponse";
import ApiMethodBadge from "../../../components/docs/ApiMethodBadge";
import Collapsible from "../../../components/docs/Collapsible";

const Address = () => {
  return (
    <div style={{ padding: "0 16px" }}>
      {/* Heading + Method */}
      <h2>
        Address Verification <ApiMethodBadge method="POST" />
      </h2>

      <p>
        The Address Verification API is used to validate address details
        against government and postal records.
      </p>

      {/* Product Code */}
      <h4>Product Code</h4>
      <code>ADDRESS_VERIFY</code>

      {/* Features */}
      <h4 style={{ marginTop: 24 }}>Features</h4>
      <ul>
        <li>Address validation</li>
        <li>Pincode verification</li>
        <li>State & city verification</li>
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
  "address": "221B Baker Street",
  "pincode": "110001",
  "city": "New Delhi",
  "state": "Delhi"
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
    "address_valid": true,
    "pincode": "110001",
    "city": "New Delhi",
    "state": "Delhi"
  }
}`}
          />
        </Collapsible>

        <Collapsible title="400 Bad Request">
          <DocsResponse
            code="Error"
            response={`{
  "status": "error",
  "message": "Invalid address details"
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

export default Address;
