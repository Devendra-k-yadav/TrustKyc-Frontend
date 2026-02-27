import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setFilter,
  clearAll,
  runReport,
  fetchMetaData,
  fetchAppProducts,
  setPage,
} from "../../features/clientReports/clientReportsSlice";

const ClientReports = () => {

  const dispatch = useDispatch();

  const {
    filters = {},
    reports = [],
    products = [],
    apps = [],
    statusList = [],
    durations = [],
    pagination = {},
    loading = false,
    stats = {
      success: 0,
      failed: 0,
      total: 0,
    },
  } = useSelector((state) => state.clientReports || {});



  // Load metadata only
  useEffect(() => {
    dispatch(fetchMetaData());
  }, [dispatch]);



  // Run report manually only
  const run = () => {

    if (!filters.appId || !filters.product) {
      alert("Please select App and Product first");
      return;
    }

    dispatch(setPage(1));
    dispatch(runReport());

  };



  const handlePageChange = (page) => {

    dispatch(setPage(page));

    dispatch(runReport());

  };



  const formatDate = (date) => {

    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  };



  return (

    <div className="container-fluid p-3 p-md-4">

      {/* HEADER */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">

        <h4 className="fw-semibold mb-2 mb-md-0">
          Reports
        </h4>

        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => dispatch(clearAll())}
        >
          Clear All
        </button>

      </div>



      {/* FILTER CARD */}

      <div className="card shadow-sm mb-3">

        <div className="card-body">

          <div className="row g-3">

            {/* APP */}

            <div className="col-12 col-sm-6 col-md-4 col-lg-2">

              <label className="form-label">
                App
              </label>

              <select
                className="form-select"
                value={filters.appId || ""}
                onChange={(e) => {

                  const appId = e.target.value;

                  dispatch(setFilter({
                    name: "appId",
                    value: appId,
                  }));

                  dispatch(setFilter({
                    name: "product",
                    value: "",
                  }));

                  if (appId)
                    dispatch(fetchAppProducts(appId));

                }}
              >

                <option value="">
                  Select App
                </option>

                {apps.map((a) => (

                  <option
                    key={a._id}
                    value={a._id}
                  >
                    {a.name}
                  </option>

                ))}

              </select>

            </div>



            {/* PRODUCT */}

            <div className="col-12 col-sm-6 col-md-4 col-lg-2">

              <label className="form-label">
                Product
              </label>

              <select
                className="form-select"
                value={filters.product || ""}
                disabled={!filters.appId}
                onChange={(e) =>
                  dispatch(setFilter({
                    name: "product",
                    value: e.target.value,
                  }))
                }
              >

                <option value="">
                  Select Product
                </option>

                {products.map((p) => (

                  <option
                    key={p._id}
                    value={p._id}
                  >
                    {p.name}
                  </option>

                ))}

              </select>

            </div>



            {/* STATUS */}

            <div className="col-12 col-sm-6 col-md-4 col-lg-2">

              <label className="form-label">
                Status
              </label>

              <select
                className="form-select"
                value={filters.status || ""}
                onChange={(e) =>
                  dispatch(setFilter({
                    name: "status",
                    value: e.target.value,
                  }))
                }
              >

                <option value="">
                  All
                </option>

                {statusList.map((s) => (

                  <option key={s}>
                    {s}
                  </option>

                ))}

              </select>

            </div>



            {/* ENVIRONMENT */}

            <div className="col-12 col-sm-6 col-md-4 col-lg-2">

              <label className="form-label">
                Environment
              </label>

              <select
                className="form-select"
                value={filters.environment || ""}
                onChange={(e) =>
                  dispatch(setFilter({
                    name: "environment",
                    value: e.target.value,
                  }))
                }
              >

                <option value="">
                  All
                </option>

                <option>
                  Live
                </option>

                <option>
                  Test
                </option>

              </select>

            </div>



            {/* CHARGE TYPE */}

            <div className="col-12 col-sm-6 col-md-4 col-lg-2">

              <label className="form-label">
                Charge Type
              </label>

              <select
                className="form-select"
                value={filters.chargeType || ""}
                onChange={(e) =>
                  dispatch(setFilter({
                    name: "chargeType",
                    value: e.target.value,
                  }))
                }
              >

                <option value="">
                  All
                </option>

                <option>
                  Billable
                </option>

                <option>
                  Non-Billable
                </option>

              </select>

            </div>



            {/* DURATION */}

            <div className="col-12 col-sm-6 col-md-4 col-lg-2">

              <label className="form-label">
                Duration
              </label>

              <select
                className="form-select"
                value={filters.duration || ""}
                onChange={(e) =>
                  dispatch(setFilter({
                    name: "duration",
                    value: e.target.value,
                  }))
                }
              >

                <option value="">
                  Select
                </option>

                {durations.map((d) => (

                  <option key={d}>
                    {d}
                  </option>

                ))}

              </select>

            </div>

          </div>



          {/* RUN BUTTON */}

          <div className="text-end mt-3">

            <button
              className="btn btn-primary px-4"
              onClick={run}
              disabled={
                loading ||
                !filters.appId ||
                !filters.product
              }
            >

              {loading
                ? "Running..."
                : "Run Report"}

            </button>

          </div>

        </div>

      </div>



      {/* STATS */}

      <div className="row mb-3 g-3">

        <div className="col-md-4">

          <div className="card text-center shadow-sm">

            <div className="card-body">

              <h6>Total</h6>

              <h4>
                {stats.total || 0}
              </h4>

            </div>

          </div>

        </div>



        <div className="col-md-4">

          <div className="card text-center shadow-sm">

            <div className="card-body text-success">

              <h6>Success</h6>

              <h4>
                {stats.success || 0}
              </h4>

            </div>

          </div>

        </div>



        <div className="col-md-4">

          <div className="card text-center shadow-sm">

            <div className="card-body text-danger">

              <h6>Failed</h6>

              <h4>
                {stats.failed || 0}
              </h4>

            </div>

          </div>

        </div>

      </div>



      {/* TABLE */}

      <div className="card shadow-sm">

        <div className="table-responsive">

          <table className="table table-hover mb-0">

            <thead className="table-light">

              <tr>

                <th>Product</th>

                <th>Status</th>

                <th>Environment</th>

                <th>Charge Type</th>

                <th>Date</th>

              </tr>

            </thead>

            <tbody>

              {!filters.appId || !filters.product ? (

                <tr>

                  <td colSpan="5" className="text-center py-4 text-muted">

                    Select App and Product to view report

                  </td>

                </tr>

              ) : reports.length === 0 ? (

                <tr>

                  <td colSpan="5" className="text-center py-4">

                    No Data Found

                  </td>

                </tr>

              ) : (

                reports.map((r) => (

                  <tr key={r._id}>

                    <td>
                      {r.productId?.name || "-"}
                    </td>

                    <td>
                      {r.status}
                    </td>

                    <td>
                      {r.environment}
                    </td>

                    <td>
                      {r.chargeType}
                    </td>

                    <td>
                      {formatDate(r.createdAt)}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>



      {/* PAGINATION */}

      {pagination?.pages > 1 && (

        <div className="d-flex justify-content-center mt-3">

          <nav>

            <ul className="pagination">

              {[...Array(pagination.pages)].map((_, i) => (

                <li
                  key={i}
                  className={`page-item ${
                    pagination.page === i + 1
                      ? "active"
                      : ""
                  }`}
                >

                  <button
                    className="page-link"
                    onClick={() =>
                      handlePageChange(i + 1)
                    }
                  >

                    {i + 1}

                  </button>

                </li>

              ))}

            </ul>

          </nav>

        </div>

      )}

    </div>

  );

};

export default ClientReports;
