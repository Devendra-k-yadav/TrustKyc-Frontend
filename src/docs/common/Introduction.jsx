const Introduction = () => {
  return (
    <>
      <h2 style={{ fontSize: 28, marginBottom: 12 }}>
        API Platform Documentation
      </h2>

      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        Welcome to our API Platform — a secure, scalable, and developer-first
        solution designed to power modern applications with reliable
        verification and utility services.
      </p>

      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        Our APIs are built with performance, security, and ease of integration
        in mind, enabling businesses and developers to integrate critical
        functionalities in minutes instead of weeks.
      </p>

      <h3 style={{ marginTop: 24 }}>What this platform offers</h3>

      <ul style={{ paddingLeft: 20, lineHeight: "1.8", color: "#444" }}>
        <li>🔐 Secure authentication and authorization APIs</li>
        <li>📄 Identity, KYC, and verification services</li>
        <li>📊 Real-time usage tracking and analytics</li>
        <li>💳 Wallet, balance, and billing management</li>
        <li>⚡ High-performance, scalable API infrastructure</li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Who should use this?</h3>

      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        This platform is ideal for startups, enterprises, and developers who
        want to integrate verification, automation, and utility APIs without
        managing complex backend systems.
      </p>

      <h3 style={{ marginTop: 24 }}>Getting started</h3>

      <p style={{ fontSize: 16, color: "#555", lineHeight: "1.7" }}>
        Navigate through the documentation using the sidebar to explore
        authentication, API integration steps, request/response formats, and
        best practices. Each section is designed to help you go from setup to
        production smoothly.
      </p>
    </>
  );
};

export default Introduction;
