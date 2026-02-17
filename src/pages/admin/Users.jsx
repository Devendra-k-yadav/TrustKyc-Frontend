import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../features/users/usersSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ITEMS_PER_PAGE = 5;

const Users = () => {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state) => state.users);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENT",
    isActive: true,
  });

  const [editId, setEditId] = useState(null);

  const [assignForm, setAssignForm] = useState({
    clientId: "",
    managerId: "",
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChange = (e) => {
    const value =
      e.target.name === "isActive"
        ? e.target.value === "true"
        : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const submit = async () => {
    if (!form.name || !form.email || (!editId && !form.password)) {
      toast.error("All fields required");
      return;
    }

    try {
      if (editId) {
        await dispatch(updateUser({ id: editId, payload: form })).unwrap();
        toast.success("User updated");
      } else {
        await dispatch(addUser(form)).unwrap();
        toast.success("User added");
      }

      setEditId(null);
      setForm({
        name: "",
        email: "",
        password: "",
        role: "CLIENT",
        isActive: true,
      });
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  const assignManager = async () => {
    if (!assignForm.clientId || !assignForm.managerId) {
      toast.error("Select client & manager");
      return;
    }

    try {
      await dispatch(
        updateUser({ id: assignForm.clientId, payload: { managerId: assignForm.managerId } })
      ).unwrap();
      toast.success("Manager assigned successfully");

      setAssignForm({
        clientId: "",
        managerId: "",
      });
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  const managers = users.filter((u) => u.role === "MANAGER");
  const clients = users.filter((u) => u.role === "CLIENT");

  const filteredUsers = useMemo(() => {
    return users
      .filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
      .filter((u) => (roleFilter === "ALL" ? true : u.role === roleFilter))
      .filter((u) =>
        statusFilter === "ALL"
          ? true
          : statusFilter === "ACTIVE"
          ? u.isActive
          : !u.isActive
      );
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="container py-4" style={{ marginTop: "40px" }}>
      <h3 className="mb-3">User & Manager Management</h3>

      {/* ================= CREATE / UPDATE USER FORM ================= */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-semibold">
          {editId ? "Update User" : "Add New User"}
        </div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {!editId && (
              <div className="col-md-6">
                <label className="form-label">Password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="col-md-3">
              <label className="form-label">Role</label>
              <select
                name="role"
                className="form-select"
                value={form.role}
                onChange={handleChange}
              >
                <option value="MANAGER">Manager</option>
                <option value="CLIENT">Client</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select
                name="isActive"
                className="form-select"
                value={form.isActive}
                onChange={handleChange}
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card-footer text-end">
          {editId && (
            <button
              className="btn btn-secondary me-2"
              onClick={() => {
                setEditId(null);
                setForm({
                  name: "",
                  email: "",
                  password: "",
                  role: "CLIENT",
                  isActive: true,
                });
              }}
            >
              Cancel
            </button>
          )}

          <button className="btn btn-primary" onClick={submit}>
            {editId ? "Update" : "Create"}
          </button>
        </div>
      </div>

      {/* ================= ASSIGN MANAGER FORM ================= */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-semibold">Assign Manager to Client</div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Select Client</label>
              <select
                className="form-select"
                value={assignForm.clientId}
                onChange={(e) =>
                  setAssignForm({ ...assignForm, clientId: e.target.value })
                }
              >
                <option value="">-- Select Client --</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Select Manager</label>
              <select
                className="form-select"
                value={assignForm.managerId}
                onChange={(e) =>
                  setAssignForm({ ...assignForm, managerId: e.target.value })
                }
              >
                <option value="">-- Select Manager --</option>
                {managers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card-footer text-end">
          <button className="btn btn-success" onClick={assignManager}>
            Assign Manager
          </button>
        </div>
      </div>

      {/* ================= SEARCH + FILTER ================= */}
      <div className="row mb-3 g-2">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="MANAGER">Manager</option>
            <option value="CLIENT">Client</option>
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* ================= USERS TABLE ================= */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error.message || "Error loading users"}</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Manager</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u, i) => (
              <tr key={u._id}>
                <td>{(page - 1) * ITEMS_PER_PAGE + i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <span
                    className={`badge ${
                      u.isActive ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>{users.find((m) => m._id === u.managerId)?.name || "-"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => {
                      setEditId(u._id);
                      setForm(u);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={async () => {
                      if (window.confirm(`Delete ${u.name}?`)) {
                        try {
                          await dispatch(deleteUser(u._id)).unwrap();
                          toast.warn("User deleted");
                        } catch (err) {
                          toast.error(err?.message || "Delete failed");
                        }
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= PAGINATION ================= */}
      <div className="d-flex justify-content-center gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`btn btn-sm ${
              page === i + 1 ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Users;
