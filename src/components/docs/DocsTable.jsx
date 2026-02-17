const DocsTable = ({ headers, rows }) => {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
      <thead>
        <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
          {headers.map((h) => (
            <th key={h} style={{ padding: "8px" }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "8px" }}>{row.name}</td>
            <td style={{ padding: "8px" }}>
              <code>{row.example}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DocsTable;
