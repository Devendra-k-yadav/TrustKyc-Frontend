const Subscription = () => {
  return (
    <>
      <h2 style={{ fontSize: 28, marginBottom: 12 }}>
        Product Subscription
      </h2>

      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        Product subscription is mandatory before accessing any API. Only
        subscribed products can be mapped to an App and invoked using an API
        key.
      </p>

      <h3 style={{ marginTop: 24 }}>Subscription Workflow</h3>
      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        Subscriptions follow a controlled approval workflow to ensure compliance
        and proper usage of APIs.
      </p>

      <ol style={{ paddingLeft: 20, lineHeight: "1.8", color: "#444" }}>
        <li>Select the product you want to subscribe to</li>
        <li>Select the App for which access is required</li>
        <li>Submit the subscription request</li>
        <li>Approval by the platform (if required)</li>
      </ol>

      <h3 style={{ marginTop: 24 }}>Approval Types</h3>
      <ul style={{ paddingLeft: 20, lineHeight: "1.8", color: "#444" }}>
        <li>
          <strong>Pre-approved products</strong> – Activated immediately after
          request
        </li>
        <li>
          <strong>Manual approval products</strong> – Require platform review
          before activation
        </li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Post-Subscription Behavior</h3>
      <ul style={{ paddingLeft: 20, lineHeight: "1.8", color: "#444" }}>
        <li>Subscribed products become available for App mapping</li>
        <li>API calls are permitted only after successful activation</li>
        <li>Usage and billing start after the subscription is active</li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Important Notes</h3>
      <ul style={{ paddingLeft: 20, lineHeight: "1.8", color: "#444" }}>
        <li>Unsubscribed products cannot be accessed via any App</li>
        <li>Rejected or pending subscriptions will block API access</li>
        <li>Subscription status can be monitored from the dashboard</li>
      </ul>
    </>
  );
};

export default Subscription;
