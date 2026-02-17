const Errors = () => {
  return (
    <>
      <h2>Error Handling</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Status Code</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>400</td>
            <td>Bad Request</td>
          </tr>
          <tr>
            <td>401</td>
            <td>Authentication Failed</td>
          </tr>
          <tr>
            <td>403</td>
            <td>Access Denied</td>
          </tr>
          <tr>
            <td>500</td>
            <td>Internal Server Error</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Errors;
