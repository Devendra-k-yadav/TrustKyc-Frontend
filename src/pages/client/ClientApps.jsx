import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  openCreateModal,
  closeCreateModal,
  createApp,
  setSelectedApp,
  fetchApps,
  fetchSingleApp, 
  removeApp,
  fetchClientAppProducts,
} from "../../features/client/clientAppsSlice";
import { selectApps, selectCreateModal } from "../../features/client/selectors";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ClientApps = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apps = useSelector(selectApps);
  const showForm = useSelector(selectCreateModal);
  const [appName, setAppName] = useState("");
const clientAppProductsByClient = useSelector(
  (state) => state.clientApps.clientAppProductsByClient
);

const authUser = useSelector((state) => state.auth.user); // client
const clientId = authUser?._id;

  // ===== FETCH ALL APPS =====
  useEffect(() => {
    dispatch(fetchApps());
  }, [dispatch]);

  // ✅ FETCH SINGLE APP FOR SERVICE COUNT
 
useEffect(() => {
  if (!apps.length || !clientId) return;

  apps.forEach((app) => {
    const appId = app._id || app.id;
    dispatch(fetchClientAppProducts({ appId, clientId }));
  });
}, [apps, clientId, dispatch]);


  const handleAddApp = async () => {
    if (!appName.trim()) return;
    try {
      await dispatch(createApp(appName)).unwrap();
      setAppName("");
      dispatch(closeCreateModal());
      toast.success("App created successfully");
    } catch (err) {
      toast.error(err);
    }
  };

  const handleDeleteApp = async (appId) => {
    if (!window.confirm("Are you sure you want to delete this app?")) return;
    try {
      await dispatch(removeApp(appId)).unwrap();
      toast.success("App deleted successfully");
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <div style={{ filter: showForm ? "blur(6px)" : "none" }}>
        <div
          className="d-flex justify-content-between align-items-center mb-4"
          style={{ marginTop: "45px" }}
        >
          <h4>Apps</h4>
          {/* <Button variant="dark" onClick={() => dispatch(openCreateModal())}>
            Create App
          </Button> */}
        </div>

        <Row>
          {apps.map((app) => {
            const appId = app._id || app.id;

            // ✅ FINAL SERVICE COUNT LOGIC

// const serviceCount =
//   app.servicesCount ??
//   app.services?.length ??
//   0;
            const clientServices =
  clientAppProductsByClient?.[clientId?.toString()]?.[appId?.toString()] || [];

const serviceCount = clientServices.length;



            return (
              <Col md={4} lg={3} key={appId} className="mb-4">
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">
                        {app.createdAt
                          ? new Date(app.createdAt).toDateString()
                          : ""}
                      </small>

                      <Badge
                        bg={
                          (app.environment || app.status) === "Live"
                            ? "success"
                            : "warning"
                        }
                      >
                        {app.environment || "Test"}
                      </Badge>
                    </div>

                    <h5 className="mt-4 text-center">{app.name}</h5>

                    <div className="d-flex justify-content-between mt-3">
                      <div>
                        <small className="text-muted">KEYS</small>
                        <h6>{app.keys ?? app.keysList?.length ?? 0}</h6>
                      </div>

                      <div>
                        <small className="text-muted">SERVICES</small>
                        <h6>{serviceCount}</h6> {/* ✅ FIXED */}
                      </div>
                    </div>

                    <Button
                      variant="outline-secondary"
                      className="w-100 mt-3"
                      onClick={() => {
                        if (!appId) {
                          toast.error("App ID not found");
                          return;
                        }
                        dispatch(setSelectedApp({ ...app, id: appId }));
                        navigate(`/client/apps/${appId}`);
                      }}
                    >
                      View App
                    </Button>

                    {/* <Button
                      variant="outline-danger"
                      className="w-100 mt-2"
                      size="sm"
                      onClick={() => handleDeleteApp(appId)}
                    >
                      Delete App
                    </Button> */}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>

      {showForm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(4px)",
            zIndex: 1050,
          }}
        >
          <Card style={{ width: 420 }}>
            <Card.Body>
              <h5 className="text-center mb-3">Create App</h5>
              <input
                className="form-control form-control-sm mb-3"
                placeholder="Enter app name"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
              />
              <div className="d-flex justify-content-end gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => dispatch(closeCreateModal())}
                >
                  Cancel
                </Button>
                <Button size="sm" variant="dark" onClick={handleAddApp}>
                  Add
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </>
  );
};

export default ClientApps;
