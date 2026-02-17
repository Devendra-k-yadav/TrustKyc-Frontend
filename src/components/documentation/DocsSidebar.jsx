import { useState } from "react";
import { docsSidebar } from "../../data/documentation/sidebarConfig";

const DocsSidebar = ({ activeDoc, setActiveDoc }) => {
  const [search, setSearch] = useState("");

  const matchesSearch = (label) =>
    label.toLowerCase().includes(search.toLowerCase());

  return (
    <div
      className="border-end"
      style={{
        width: 280,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      {/* 🔹 FIXED HEADER (LOGO) */}
      <div
        style={{
  padding: 0,
  margin: 0,
  borderBottom: "1px solid #eee",
  fontWeight: "bold",
  fontSize: 18,
  lineHeight: "20px",   // reduced from 48px
  textAlign: "center",
}}

      >
        <img src="/assets/image4.png" alt="Logo" className="sidebar-logo" />
      </div>

      {/* 🔹 FIXED SEARCH */}
      <div
        style={{
          padding: "12px",
          borderBottom: "1px solid #eee",
        }}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Search docs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🔹 SCROLLABLE MENU */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px",
        }}
      >
        {docsSidebar.map((section) => {
          const filteredItems = section.items
            .map((item) => {
              if (item.children) {
                const children = item.children.filter((c) =>
                  matchesSearch(c.label)
                );
                return children.length ? { ...item, children } : null;
              }
              return matchesSearch(item.label) ? item : null;
            })
            .filter(Boolean);

          if (!filteredItems.length) return null;

          return (
            <div key={section.title} className="mb-3">
              {section.title !== "Getting Started" && (
                <div className="text-muted mb-1">{section.title}</div>
              )}

              {filteredItems.map((item) =>
                item.children ? (
                  <div key={item.label} className="mb-2">
                    <strong>{item.label}</strong>
                    <ul className="list-unstyled ms-3">
                      {item.children.map((child) => (
                        <li
                          key={child.key}
                          onClick={() => setActiveDoc(child.key)}
                          className={`py-1 ${
                            activeDoc === child.key
                              ? "text-primary fw-bold"
                              : ""
                          }`}
                          style={{ cursor: "pointer" }}
                        >
                          {child.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div
                    key={item.key}
                    onClick={() => setActiveDoc(item.key)}
                    className={`py-1 ${
                      activeDoc === item.key
                        ? "text-primary fw-bold"
                        : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    {item.label}
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocsSidebar;
