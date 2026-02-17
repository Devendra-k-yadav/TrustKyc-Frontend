const ApiMethodBadge = ({ method }) => {
  const colors = {
    GET: "#e6f4ff",
    POST: "#e6fffa",
    PUT: "#fff7e6",
    DELETE: "#ffe6e6",
  };

  return (
    <span
      style={{
        background: colors[method],
        color: "#000",
        padding: "4px 10px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: "bold",
        marginLeft: 8,
      }}
    >
      {method}
    </span>
  );
};

export default ApiMethodBadge;
