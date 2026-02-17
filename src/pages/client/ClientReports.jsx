import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilter,
  clearAll,
  runReport,
  fetchMetaData,
  fetchAppProducts,
} from "../../features/clientReports/clientReportsSlice";

const ClientReports = () => {
  const dispatch = useDispatch();

  const {
    filters,
    filteredReports,
    products,
    apps,
    statusList,
    durations,
    loading,
  } = useSelector((state) => state.clientReports);

  useEffect(() => {
    dispatch(fetchMetaData());
  }, [dispatch]);

  return (
    <div className="container-fluid bg-light min-vh-100 p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-semibold mb-0">Client Reports</h4>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by Client ID..."
          value={filters.clientId}
          onChange={(e) =>
            dispatch(setFilter({ name: "clientId", value: e.target.value }))
          }
        />
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h6 className="fw-semibold mb-0">Filter By</h6>
            <button
              className="btn btn-link text-success p-0"
              onClick={() => dispatch(clearAll())}
            >
              Clear all
            </button>
          </div>

          <div className="row g-4">
            {/* App */}
            <div className="col-md-4">
              <label className="form-label fw-medium">App Name</label>
              <select
                className="form-select"
                value={filters.appId}
                onChange={(e) => {
                  const appId = e.target.value;
                  dispatch(setFilter({ name: "appId", value: appId }));
                  dispatch(setFilter({ name: "product", value: "" }));
                  if (appId) dispatch(fetchAppProducts(appId));
                }}
              >
                <option value="">Select Option</option>
                {apps.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Products */}
            <div className="col-md-4">
              <label className="form-label fw-medium">Products</label>
              <select
                className="form-select"
                value={filters.product}
                onChange={(e) =>
                  dispatch(
                    setFilter({ name: "product", value: e.target.value })
                  )
                }
                disabled={!filters.appId}
              >
                <option value="">Select Option</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="col-md-4">
              <label className="form-label fw-medium">Status</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) =>
                  dispatch(setFilter({ name: "status", value: e.target.value }))
                }
              >
                <option value="">Select Option</option>
                {statusList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className="col-md-4">
              <label className="form-label fw-medium">
                Duration <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={filters.duration}
                onChange={(e) =>
                  dispatch(
                    setFilter({ name: "duration", value: e.target.value })
                  )
                }
              >
                <option value="">Select Duration</option>
                {durations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Charge Type */}
            <div className="col-md-4">
              <label className="form-label fw-medium">Charge type</label>
              <div className="d-flex gap-4 mt-2">
                {["Billable", "Non-Billable"].map((type) => (
                  <div className="form-check" key={type}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="chargeType"
                      checked={filters.chargeType === type}
                      onChange={() =>
                        dispatch(
                          setFilter({ name: "chargeType", value: type })
                        )
                      }
                    />
                    <label className="form-check-label">{type}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Environment */}
            <div className="col-md-4">
              <label className="form-label fw-medium">Environment</label>
              <div className="d-flex gap-4 mt-2">
                {["Test", "Live"].map((env) => (
                  <div className="form-check" key={env}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="environment"
                      checked={filters.environment === env}
                      onChange={() =>
                        dispatch(
                          setFilter({ name: "environment", value: env })
                        )
                      }
                    />
                    <label className="form-check-label">{env}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-end mt-4">
            <button
              className="btn btn-secondary px-4"
              onClick={() => dispatch(runReport())}
              disabled={loading || !filters.duration}
            >
              {loading ? "Loading..." : "Run Report"}
            </button>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Result Set</h6>

          {filteredReports.length === 0 ? (
            <div className="border border-dashed rounded py-5 text-center text-muted">
              No reports found for selected filters.
            </div>
          ) : (
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Client ID</th>
                  <th>Product</th>
                  <th>App</th>
                  <th>Status</th>
                  <th>Env</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((r) => (
                  <tr key={r._id}>
                    <td>{r.clientId}</td>
                    <td>{r.productId?.name}</td>
                    <td>{r.appId?.name}</td>
                    <td>{r.status}</td>
                    <td>{r.environment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientReports;
