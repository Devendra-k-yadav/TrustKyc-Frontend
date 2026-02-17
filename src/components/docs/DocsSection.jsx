const DocsSection = ({ title, children }) => {
  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      {children}
    </div>
  );
};

export default DocsSection;
