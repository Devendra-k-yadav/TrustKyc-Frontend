import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, Button, Row, Col, Form, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchTrialProducts,
  runRestrictedTrial,
  runPublicTrial,
} from "../../features/trialCenter/trialCenterSlice";

const TrialCenter = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.trialCenter);

  const [selected, setSelected] = useState(null);
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [agreed, setAgreed] = useState(false);

  // ✅ NEW STATES (ADDED ONLY)
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [cardType, setCardType] = useState("");
  const [panName, setPanName] = useState("");
  // ✅ PAN DEMOGRAPHIC STATES (ADD ONLY)
const [panDob, setPanDob] = useState("");
const [panDemoName, setPanDemoName] = useState("");
const [voterName, setVoterName] = useState("");
// ✅ DRIVING LICENSE STATES
const [dlNumber, setDlNumber] = useState("");
const [dlName, setDlName] = useState("");
const [dlDob, setDlDob] = useState("");

const [accountNumber, setAccountNumber] = useState("");
const [ifscCode, setIfscCode] = useState("");
const [accountHolderName, setAccountHolderName] = useState("");
const [gstin, setGstin] = useState("");
// ✅ GST ADVANCE STATES
const [gstAdvGstin, setGstAdvGstin] = useState("");
const [gstAdvYear, setGstAdvYear] = useState("");
const [gstAdvContact, setGstAdvContact] = useState(true);
const [gstPan, setGstPan] = useState("");
// ✅ UDYOG AADHAAR STATE
const [udyogAadhaar, setUdyogAadhaar] = useState("");
// ✅ VEHICLE RC STATE (ADD ONLY)
const [vehicleRcNumber, setVehicleRcNumber] = useState("");

  useEffect(() => {
    dispatch(fetchTrialProducts());
  }, [dispatch]);

  const navigate = useNavigate();


  // ================= SUBMIT =================
  const submit = async () => {
    if (!selected) return;

    // ================= OCR CASE =================
    if (selected.code === "OCR_EXTRACT") {
      if (!frontImage) {
        toast.error("Front image is required");
        return;
      }

      if (!cardType) {
        toast.error("Please select card type");
        return;
      }

      const needsBack = ["AADHAAR", "PASSPORT", "VOTER_ID"].includes(cardType);
      if (needsBack && !backImage) {
        toast.error("Back image is mandatory for selected card type");
        return;
      }

      const formData = new FormData();
      formData.append("trialId", selected._id);
      formData.append("document_type", cardType);
      formData.append("front", frontImage);
      if (backImage) formData.append("back", backImage);

      try {
        setLoading(true);
        const res = await dispatch(runPublicTrial(formData)).unwrap();
        setResult(res.result || res);
        toast.success("OCR completed successfully");
        dispatch(fetchTrialProducts());
      } catch (e) {
        console.error(e);
        toast.error(e.message || "OCR failed");
      } finally {
        setLoading(false);
      }
      return;
    }

    // ================= NORMAL API CASE =================
    if (
  !agreed &&
  selected.code !== "VOTER_ADVANCE"
) {
  toast.error("Please confirm and agree before running verification");
  return;
}

    try {
      setLoading(true);

      let payload = {};
      switch (selected.code) {
        case "IFSC_VERIFY":
          payload = { ifsc: value };
          break;
        case "PAN_LITE":
    if (!value || !panName) {
      toast.error("PAN number and name are required");
      return;
    }

    payload = {
      pan: value,
      name: panName,
    };
    break;

    case "PAN_DEMOGRAPHIC":
  if (!value || !panDemoName || !panDob) {
    toast.error("PAN, Name and DOB are required");
    return;
  }

  payload = {
    pan: value,
    name: panDemoName,
    dob: panDob, // DD-MM-YYYY
  };
  break;
  case "PAN_ADVANCE":
  if (!value || !panName) {
    toast.error("PAN number and name are required");
    return;
  }

  payload = {
    pan: value,
    name: panName,
  };
  break;

  case "VOTER_ADVANCE":
  if (!value || !voterName) {
    toast.error("EPIC number and voter name are required");
    return;
  }

  payload = {
    epic: value.toUpperCase(),
    name: voterName.toUpperCase(), // ✅ REQUIRED BY API
  };
  break;

  case "DRIVING_LICENSE_ADVANCE":
  if (!dlNumber || !dlName || !dlDob) {
    toast.error("DL number, name and DOB are required");
    return;
  }

  payload = {
    dl_number: dlNumber.toUpperCase(),
    name: dlName.toUpperCase(),
    dob: dlDob, // DD-MM-YYYY
  };
  break;

  case "BANK_ACCOUNT_LITE":
  if (!accountNumber || !ifscCode) {
    toast.error("Account number and IFSC are required");
    return;
  }

  payload = {
    account_number: accountNumber,
    ifsc: ifscCode,
  };
  break;
  case "BANK_ACCOUNT_ADVANCE":
  if (!accountNumber || !ifscCode || !accountHolderName) {
    toast.error("Account number, IFSC and account holder name are required");
    return;
  }

  payload = {
    account_number: accountNumber,
    ifsc: ifscCode,
    name: accountHolderName, // 🔥 REQUIRED BY ADVANCE API
  };
  break;
  case "FSSAI_VERIFY":
  if (!value) {
    toast.error("FSSAI number is required");
    return;
  }

  payload = {
    fssai_number: value,
  };
  break;
  case "GST_VERIFY":
  if (!value) {
    toast.error("GSTIN is required");
    return;
  }

  payload = {
    gstin: value.toUpperCase(),
  };
  break;
  case "GST_ADVANCE":
  if (!gstAdvGstin || !gstAdvYear) {
    toast.error("GSTIN and financial year are required");
    return;
  }

  payload = {
    gstin: gstAdvGstin.toUpperCase(),
    financial_year: gstAdvYear,
    contact_info: gstAdvContact,
  };
  break;
  case "GSTPAN_LITE":
  if (!gstPan || gstPan.length !== 10) {
    toast.error("Valid Business PAN is required");
    return;
  }

  payload = {
    business_pan: gstPan.toUpperCase(), // ✅ EXACT backend key
  };
  break;

  case "UDYOG_AADHAAR_LITE":
  if (!udyogAadhaar) {
    toast.error("Udyog / Udyam number is required");
    return;
  }

  payload = {
    udyog_aadhaar: udyogAadhaar.toUpperCase(),
  };
  break;
  case "VEHICLE_RC_LITE":
  if (!vehicleRcNumber) {
    toast.error("Vehicle registration number is required");
    return;
  }

  payload = {
    vehicle_registration_number: vehicleRcNumber
      .replace(/\s+/g, "")
      .toUpperCase(),
  };
  break;

        case "EMAIL_VERIFY":
          payload = { email: value };
          break;
        case "PHONE_VERIFY":
          payload = { phone: value };
          break;
        case "ADDRESS_VERIFY":
          payload = { address: value };
          break;
        default:
          payload = { value };
      }

      const action =
        selected.type === "public"
          ? runPublicTrial
          : runRestrictedTrial;

      const res = await dispatch(
        action({ trialId: selected._id, payload })
      ).unwrap();

      setResult(res.result || res);
      toast.success("Verification successful");
      dispatch(fetchTrialProducts());
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const closeForm = () => {
    setSelected(null);
    setValue("");
    setPanName("");
    setPanDob("");
    setPanDemoName("");
    setVoterName("");
    setDlNumber("");
    setDlName("");
    setDlDob("");
    setAccountNumber("");
    setIfscCode("");
    setAccountHolderName("");
    setGstin("");
    setGstAdvGstin("");
    setGstAdvYear("2023-24");
    setGstAdvContact(true);
    setUdyogAadhaar("");
    setVehicleRcNumber("");
    setResult(null);
    setAgreed(false);
    setFrontImage(null);
    setBackImage(null);
    setCardType("");
  };

  // ================= RESULT RENDER =================
  const renderPublicResult = () => {
    if (!result) return null;

    switch (selected.code) {

case "IFSC_VERIFY": {
  const data = result?.result?.result;

  if (!data) return <p>No IFSC data found</p>;

  return (
    <div>
      <h5 className="mb-2">{data.bank}</h5>

      {Object.entries(data).map(([key, value]) => (
        <p key={key} style={{ marginBottom: "4px" }}>
          <strong>
            {key.replace(/_/g, " ").toUpperCase()}:
          </strong>{" "}
          {typeof value === "boolean" ? (value ? "Yes" : "No") : value || "N/A"}
        </p>
      ))}
    </div>
  );
}

case "PAN_LITE": {
  const data = result?.result?.result;

  if (!data) return <p>No PAN data found</p>;

  return (
    <div>
      <p><strong>PAN Number:</strong> {data.pan_number}</p>
      <p><strong>Status:</strong> {data.pan_status}</p>
      <p><strong>Name:</strong> {data.user_full_name}</p>
      <p><strong>Name Match Score:</strong> {data.name_match_score}%</p>
      <p><strong>PAN Type:</strong> {data.pan_type}</p>
    </div>
  );
}
case "PAN_DEMOGRAPHIC": {
  const panData = result?.result?.result;

  if (!panData) return <p>No PAN demographic data found</p>;

  // Helper for badge rendering
  const renderMatchBadge = (value) => {
    if (value === true) {
      return (
        <span className="badge bg-success ms-2">
          Matched
        </span>
      );
    }

    if (value === false) {
      return (
        <span className="badge bg-danger ms-2">
          Not Matched
        </span>
      );
    }

    return null; // hide if undefined / null
  };

  return (
    <div className="result-box">
      <p>
        <strong>PAN Number:</strong> {panData.pan_number}
      </p>

      {/* <p><strong>Full Name:</strong> N/A</p>
      <p><strong>First Name:</strong> N/A</p>
      <p><strong>Middle Name:</strong> N/A</p>
      <p><strong>Last Name:</strong> N/A</p>
      <p><strong>Date of Birth:</strong> N/A</p>
      <p><strong>Gender:</strong> N/A</p> */}

      {/* ✅ Show only if API sends is_dob_match */}
      {typeof panData.is_dob_match === "boolean" && (
        <p>
          <strong>DOB Match:</strong>
          {renderMatchBadge(panData.is_dob_match)}
        </p>
      )}

      {/* ✅ Show only if API sends is_name_match */}
      {typeof panData.is_name_match === "boolean" && (
        <p>
          <strong>Name Match:</strong>
          {renderMatchBadge(panData.is_name_match)}
        </p>
      )}

      <p>
        <strong>PAN Status:</strong>{" "}
        <span className="badge bg-primary ms-2">
          {panData.pan_status}
        </span>
      </p>

      <p>
        <strong>Aadhaar Seeding Status:</strong>{" "}
        <span className="badge bg-info text-dark ms-2">
          {panData.aadhaarSeedingStatus}
        </span>
      </p>
    </div>
  );
}

case "PAN_ADVANCE": {
  const data = result?.result?.result;

  if (!data) return <p>No PAN Advance data found</p>;

  const score = Number(data.name_match_score || 0);

  return (
    <div className="result-box">
      <p>
        <strong>PAN Number:</strong>{" "}
        <span className="text-monospace">{data.pan_number}</span>
      </p>

      <p>
        <strong>Name on PAN:</strong>{" "}
        <span className="fw-semibold">{data.name_on_card}</span>
      </p>

      <p>
        <strong>First Name:</strong> {data.user_first_name || "N/A"}
      </p>
      <p>
        <strong>Middle Name:</strong> {data.user_middle_name || "N/A"}
      </p>
      <p>
        <strong>Last Name:</strong> {data.user_last_name || "N/A"}
      </p>

      <p>
        <strong>PAN Status:</strong>{" "}
        <span className="badge bg-success ms-2">
          {data.pan_status}
        </span>
      </p>

      <p>
        <strong>Aadhaar Seeding:</strong>{" "}
        <span className="badge bg-info text-dark ms-2">
          {data.aadhaar_seeding_status}
        </span>
      </p>

      <p>
        <strong>Name Match Score:</strong>{" "}
        <span
          className={`badge ms-2 ${
            score >= 90 ? "bg-success" : "bg-warning text-dark"
          }`}
        >
          {score}%
        </span>
      </p>

      <p>
        <strong>PAN Type:</strong>{" "}
        <span className="badge bg-secondary ms-2">
          {data.pan_type}
        </span>
      </p>
    </div>
  );
}

case "VOTER_ADVANCE": {
  const apiResult = result?.result?.result;

  // ❌ No record found case
  if (!apiResult) {
    return (
      <div className="result-box">
        <p>
          <strong>Status:</strong>{" "}
          <span className="badge bg-danger ms-2">
            Not Verified
          </span>
        </p>

        <p className="text-muted mt-2">
          No voter record found for the provided EPIC number.
        </p>

        <p className="text-muted">
          Please check the EPIC number and try again.
        </p>
      </div>
    );
  }

  // ✅ If record exists (future-safe)
  return (
    <div className="result-box">
      {Object.entries(apiResult).map(([key, val]) => (
        <p key={key}>
          <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
          {val || "N/A"}
        </p>
      ))}
    </div>
  );
}

case "DRIVING_LICENSE_ADVANCE": {
  const apiResult = result?.result;

  // ❌ No record found
  if (!apiResult || apiResult?.success === false) {
    return (
      <div className="result-box">
        <p>
          <strong>Status:</strong>
          <span className="badge bg-danger ms-2">
            Not Verified
          </span>
        </p>

        <p className="text-muted mt-2">
          No driving licence record found for the provided details.
        </p>

        <p className="text-muted">
          Please check DL number, name and DOB.
        </p>
      </div>
    );
  }

  // ✅ Verified
  return (
    <div className="result-box">
      <p>
        <strong>Status:</strong>
        <span className="badge bg-success ms-2">
          Verified
        </span>
      </p>

      {Object.entries(apiResult).map(([key, val]) => (
        <p key={key}>
          <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
          {val || "N/A"}
        </p>
      ))}
    </div>
  );
}

case "BANK_ACCOUNT_LITE": {
  const apiResult = result?.result?.result;

  if (!apiResult) {
    return <p>No bank verification data found</p>;
  }

  return (
    <div className="result-box">
      <p>
        <strong>Status:</strong>{" "}
        <span
          className={`badge ms-2 ${
            apiResult.verification_status === "VERIFIED"
              ? "bg-success"
              : "bg-danger"
          }`}
        >
          {apiResult.verification_status}
        </span>
      </p>

      <p>
        <strong>Beneficiary Name:</strong>{" "}
        {apiResult.beneficiary_name || "N/A"}
      </p>

      <p>
        <strong>Bank Reference No:</strong>{" "}
        {apiResult.bank_ref_no || "N/A"}
      </p>

      <p>
        <strong>Transaction Remark:</strong>{" "}
        {apiResult.transaction_remark}
      </p>
    </div>
  );
}
case "BANK_ACCOUNT_ADVANCE": {
  const apiResult = result?.result;

  if (!apiResult) return <p>No bank verification data found</p>;

  return (
    <div className="result-box">
      <p>
        <strong>Status:</strong>
        <span
          className={`badge ms-2 ${
            result.verified ? "bg-success" : "bg-danger"
          }`}
        >
          {result.verified ? "VERIFIED" : "NOT VERIFIED"}
        </span>
      </p>

      {!result.verified && (
        <p className="text-muted">
          <strong>Reason:</strong>{" "}
          {apiResult?.metadata?.reason_message ||
            apiResult?.response_message}
        </p>
      )}

      {apiResult?.request_id && (
        <p>
          <strong>Request ID:</strong> {apiResult.request_id}
        </p>
      )}
    </div>
  );
}
case "FSSAI_VERIFY": {
  const api = result?.result;
  const details = api?.result;

  if (!details) {
    return <p>No FSSAI data found</p>;
  }

  const isActive = details.license_active_flag === true;

  return (
    <div className="result-box">
      <p>
        <strong>Status:</strong>
        <span
          className={`badge ms-2 ${
            isActive
              ? "bg-success"
              : "bg-warning text-dark"
          }`}
        >
          {isActive ? "ACTIVE" : "INACTIVE"}
        </span>
      </p>

      <p>
        <strong>Company Name:</strong>{" "}
        {details.company_name}
      </p>

      <p>
        <strong>FSSAI Number:</strong>{" "}
        {details.fssai_number}
      </p>

      <p>
        <strong>License Status:</strong>{" "}
        {details.status_description}
      </p>

      <p>
        <strong>State:</strong>{" "}
        {details.state_name}
      </p>

      <p>
        <strong>Address:</strong>{" "}
        {details.premise_address}
      </p>
    </div>
  );
}
case "GST_VERIFY": {
  const api = result?.result;

  const success = api?.success === true;
  const details = api?.result;

  if (!success || !details) {
    return (
      <div className="result-box">
        <p>
          <strong>Status:</strong>
          <span className="badge bg-danger ms-2">
            Not Verified
          </span>
        </p>
        <p className="text-muted">
          {api?.response_message || "No GST record found"}
        </p>
      </div>
    );
  }

  return (
    <div className="result-box">
      <p>
        <strong>Status:</strong>
        <span className="badge bg-success ms-2">
          Verified
        </span>
      </p>

      <p><strong>GSTIN:</strong> {details.gstin}</p>
      <p><strong>Legal Name:</strong> {details.legal_name}</p>
      <p><strong>Trade Name:</strong> {details.trade_name}</p>
      <p><strong>Registration Status:</strong> {details.current_registration_status}</p>
      <p><strong>Taxpayer Type:</strong> {details.tax_payer_type}</p>
    </div>
  );
}
case "GST_ADVANCE": {
  const api = result?.result;

  // ❌ Failure / No record
  if (!api || api?.success === false) {
    return (
      <div className="result-box">
        <p>
          <strong>Status:</strong>
          <span className="badge bg-danger ms-2">
            Not Verified
          </span>
        </p>

        <p className="text-muted">
          {api?.response_message || "No GST record found"}
        </p>
      </div>
    );
  }

  const details = api?.result;

  return (
    <div className="result-box">
      <p>
        <strong>Status:</strong>
        <span className="badge bg-success ms-2">
          Verified
        </span>
      </p>

      <p><strong>GSTIN:</strong> {details.gstin}</p>
      <p><strong>Legal Name:</strong> {details.legal_name}</p>
      <p><strong>Trade Name:</strong> {details.trade_name}</p>

      <p>
        <strong>Registration Status:</strong>{" "}
        <span className="badge bg-info text-dark ms-2">
          {details.current_registration_status}
        </span>
      </p>

      <p><strong>Taxpayer Type:</strong> {details.tax_payer_type}</p>

      {details.primary_business_address && (
        <p>
          <strong>Primary Address:</strong>{" "}
          {details.primary_business_address?.address || "N/A"}
        </p>
      )}
    </div>
  );
}

case "GSTPAN_LITE": {
  const api = result?.result;

  // ❌ No record found (your current real response)
  if (!api || api?.success === false || !api?.result) {
    return (
      <div className="result-box">
        <p>
          <strong>Status:</strong>
          <span className="badge bg-warning text-dark ms-2">
            No GST Linked
          </span>
        </p>

        <p className="text-muted mt-2">
          No GSTIN is linked with the provided Business PAN.
        </p>

        <p className="text-muted">
          This PAN may not be registered under GST.
        </p>
      </div>
    );
  }

  const gstins = api.result?.gstins || [];

  // ❌ Safety check
  if (!gstins.length) {
    return (
      <div className="result-box">
        <p>
          <strong>Status:</strong>
          <span className="badge bg-warning text-dark ms-2">
            No GST Linked
          </span>
        </p>
      </div>
    );
  }

  // ✅ Success case (future-proof)
  return (
    <div className="result-box">
      <p>
        <strong>Status:</strong>
        <span className="badge bg-success ms-2">
          GST Found
        </span>
      </p>

      <h6 className="fw-semibold mt-3">Linked GSTINs</h6>

      <ul className="list-group">
        {gstins.map((gst, index) => (
          <li key={index} className="list-group-item">
            <p className="mb-1">
              <strong>GSTIN:</strong> {gst.gstin}
            </p>
            <p className="mb-1">
              <strong>Legal Name:</strong> {gst.legal_name || "N/A"}
            </p>
            <p className="mb-1">
              <strong>State:</strong> {gst.state || "N/A"}
            </p>
            <p className="mb-1">
              <strong>Status:</strong>{" "}
              <span
                className={`badge ${
                  gst.status === "Active"
                    ? "bg-success"
                    : "bg-secondary"
                }`}
              >
                {gst.status || "Unknown"}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
case "UDYOG_AADHAAR_LITE": {
  const api = result?.result;

  // ❌ No record found (your real Postman response)
  if (!api || api?.success === false || api?.response_code === "101") {
    return (
      <div className="result-box">
        <p>
          <strong>Status:</strong>
          <span className="badge bg-warning text-dark ms-2">
            No Record Found
          </span>
        </p>

        <p className="text-muted mt-2">
          No MSME record found for the provided Udyog / Udyam number.
        </p>

        <p className="text-muted">
          Please verify the number and try again.
        </p>
      </div>
    );
  }

  // ✅ Verified / Data received
  return (
    <div className="result-box">
      <p>
        <strong>Status:</strong>
        <span className="badge bg-success ms-2">
          Verified
        </span>
      </p>

      <p>
        <strong>Request ID:</strong> {api.request_id}
      </p>

      <p>
        <strong>Task ID:</strong> {api.task_id}
      </p>

      <p>
        <strong>Billable:</strong>{" "}
        {api.metadata?.billable === "Y" ? "Yes" : "No"}
      </p>
    </div>
  );
}
case "VEHICLE_RC_LITE": {
  const api = result?.result;

  // ❌ No record / failure (Zoop test env common case)
  if (!api || api?.success === false || !api?.result) {
    return (
      <div className="result-box">
        <p>
          <strong>Status:</strong>
          <span className="badge bg-warning text-dark ms-2">
            No Record Found
          </span>
        </p>

        <p className="text-muted mt-2">
          No RC details found for the provided vehicle number.
        </p>

        <p className="text-muted">
          This is common in test environment.
        </p>
      </div>
    );
  }

  const details = api.result;

  return (
    <div className="result-box">
      <p>
        <strong>Status:</strong>
        <span className="badge bg-success ms-2">
          Verified
        </span>
      </p>

      {Object.entries(details).map(([key, value]) => (
        <p key={key}>
          <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
          {value || "N/A"}
        </p>
      ))}
    </div>
  );
}
      case "EMAIL_VERIFY":
        return (
          <p>
            <strong>Email:</strong> {result.email}<br />
            <strong>Valid:</strong> {result.validFormat ? "Yes" : "No"}<br />
            <strong>Disposable:</strong> {result.disposable ? "Yes" : "No"}
          </p>
        );

      case "PHONE_VERIFY":
        return (
          <p>
            <strong>Phone:</strong> {result.phone}<br />
            <strong>Valid:</strong> {result.valid ? "Yes" : "No"}<br />
            <strong>Country:</strong> {result.country}
          </p>
        );

      case "ADDRESS_VERIFY":
        return Array.isArray(result) && result.length ? (
          <ul>
            {result.map((r, i) => (
              <li key={i}>{r.display_name}</li>
            ))}
          </ul>
        ) : (
          <p>No results found</p>
        );

      case "OCR_EXTRACT": {
  const extractedData =
    result.extracted &&
    result.extracted.documentType &&
    result.extracted.documentType !== "UNKNOWN"
      ? result.extracted
      : result?.zoopRaw?.result?.card_info
      ? {
          documentType:
            result.zoopRaw.result.card_info.card_type?.toUpperCase(),
          ...result.zoopRaw.result.card_info,
        }
      : null;

  if (!extractedData) return <p>No text extracted</p>;

  return (
    <div>
      {Object.entries(extractedData).map(([key, val]) => (
        <p key={key}>
          <strong>{key}:</strong> {val || "N/A"}
        </p>
      ))}
    </div>
  );
}

      default:
        return <pre>{JSON.stringify(result, null, 2)}</pre>;
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Available Products for Trial</h3>

      <Row style={{ filter: selected ? "blur(5px)" : "none" }}>
        <Col lg={9}>
          <Row>
            {products.map((p) => (
              <Col md={6} key={p._id} className="mb-3">
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <h5>{p.name}</h5>
                    <p className="text-muted flex-grow-1">{p.description}</p>
                    <div className="d-flex justify-content-between">
                      <strong>Credits: {p.creditsLeft ?? 0}</strong>

                      <Button onClick={() => setSelected(p)}>
                        Run Trial
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      {/* ================= BROWSE PRODUCTS BOX ================= */}
<Row className="mt-4">
  <Col lg={5} md={6}>
    <Card
      onClick={() => navigate("/products")}
      style={{
        cursor: "pointer",
        height: "180px",
        textAlign: "center",
        border: "2px dashed transparent",
        background:
          "linear-gradient(#fff, #fff) padding-box, linear-gradient(90deg, #0d6efd, #20c997) border-box",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow =
          "0 12px 30px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <Card.Body
        className="d-flex flex-column justify-content-center align-items-center h-100"
      >
        {/* 🔹 ICON */}
        <div
          style={{
            fontSize: "34px",
            lineHeight: 1,
            marginBottom: "8px",
          }}
        >
          🧩
        </div>

        {/* 🔹 GRADIENT DASHED HEADING */}
        <h4
          style={{
            fontWeight: 600,
            background: "linear-gradient(90deg, #0d6efd, #20c997)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            borderBottom: "2px dashed #0d6efd",
            paddingBottom: "6px",
            marginBottom: "6px",
            display: "inline-block",
          }}
        >
          Browse Products
        </h4>

        <p
          style={{
            color: "#6c757d",
            marginBottom: 0,
            fontSize: "14px",
          }}
        >
          Explore all available products
        </p>
      </Card.Body>
    </Card>
  </Col>
</Row>


      {selected && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <Card style={{ width: 520 }}>
            <Card.Body style={{ maxHeight: "90vh", overflowY: "auto" }}>
              <Button className="float-end" onClick={closeForm}>✕</Button>
              <h4>{selected.name}</h4>

              <Form>
  {selected.code === "PAN_DEMOGRAPHIC" ? (
  <>
    {/* PAN Number */}
    <Form.Group className="mb-3" controlId="panNumber">
      <Form.Label className="fw-semibold">
        PAN Number <span className="text-danger">*</span>
      </Form.Label>
      <Form.Control
        type="text"
        placeholder="ABCDE1234F"
        maxLength={10}
        value={value || ""}
        className="text-uppercase"
        onChange={(e) =>
          setValue(
            e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
          )
        }
      />
      <Form.Text className="text-muted">
        Enter 10-character PAN (e.g., ABCDE1234F)
      </Form.Text>
    </Form.Group>

    {/* Full Name */}
    <Form.Group className="mb-3" controlId="panFullName">
      <Form.Label className="fw-semibold">
        Full Name (as per PAN) <span className="text-danger">*</span>
      </Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter full name"
        value={panDemoName}
        className="text-uppercase"
        onChange={(e) =>
          setPanDemoName(
            e.target.value.toUpperCase().replace(/[^A-Z\s]/g, "")
          )
        }
      />
      <Form.Text className="text-muted">
        Must match exactly with PAN records
      </Form.Text>
    </Form.Group>

    {/* DOB */}
    <Form.Group className="mb-3">
      <Form.Label>Date of Birth<span className="text-danger">*</span></Form.Label>
      <Form.Control
        placeholder="DD-MM-YYYY"
        value={panDob}
        onChange={(e) => setPanDob(e.target.value)}
      />
      <small className="text-muted">
        Format: DD-MM-YYYY
      </small>
    </Form.Group>
  </>
) : selected.code === "PAN_LITE" ? (
    <>
      <Form.Group className="mb-3">
        <Form.Label>PAN Number <span className="text-danger">*</span></Form.Label>
        <Form.Control
          placeholder="ABCDE1234F"
          value={value || ""}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>PAN Holder Name<span className="text-danger">*</span></Form.Label>
        <Form.Control
          placeholder="Enter full name"
          value={panName}
          onChange={(e) => setPanName(e.target.value)}
        />
      </Form.Group>
    </>
    ) : selected.code === "PAN_ADVANCE" ? (
  <>
    <Form.Group className="mb-3">
      <Form.Label>PAN Number<span className="text-danger">*</span></Form.Label>
      <Form.Control
        placeholder="ABCDE1234F"
        value={value || ""}
        onChange={(e) => setValue(e.target.value.toUpperCase())}
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Name as per PAN<span className="text-danger">*</span></Form.Label>
      <Form.Control
        placeholder="Enter full name"
        value={panName}
        onChange={(e) => setPanName(e.target.value.toUpperCase())}
      />
    </Form.Group>
  </>
  ) : selected.code === "VOTER_ADVANCE" ? (
  <>
    <Form.Group className="mb-3">
      <Form.Label>EPIC Number<span className="text-danger">*</span></Form.Label>
      <Form.Control
        placeholder="ABC1234567"
        value={value || ""}
        onChange={(e) => setValue(e.target.value.toUpperCase())}
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Voter Name (as per EPIC)<span className="text-danger">*</span></Form.Label>
      <Form.Control
        placeholder="Enter name as per voter ID"
        value={voterName}
        onChange={(e) => setVoterName(e.target.value.toUpperCase())}
      />
    </Form.Group>
  </>

) : selected.code === "DRIVING_LICENSE_ADVANCE" ? (
  <>
    <Form.Group className="mb-3">
      <Form.Label>Driving License Number<span className="text-danger">*</span></Form.Label>
      <Form.Control
        placeholder="WB2320150212345"
        value={dlNumber}
        onChange={(e) => setDlNumber(e.target.value.toUpperCase())}
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Name (as per DL)<span className="text-danger">*</span></Form.Label>
      <Form.Control
        placeholder="Enter full name"
        value={dlName}
        onChange={(e) => setDlName(e.target.value.toUpperCase())}
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Date of Birth<span className="text-danger">*</span></Form.Label>
      <Form.Control
        placeholder="DD-MM-YYYY"
        value={dlDob}
        onChange={(e) => setDlDob(e.target.value)}
      />
      <small className="text-muted">Format: DD-MM-YYYY</small>
    </Form.Group>
  </>
  ) : selected.code === "BANK_ACCOUNT_LITE" ? (
  <>
    <Form.Group className="mb-3">
      <Form.Label>Bank Account Number<span className="text-danger">*</span></Form.Label>
      <Form.Control
        placeholder="Enter account number"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>IFSC Code<span className="text-danger">*</span></Form.Label>
      <Form.Control
        placeholder="ICIC0001234"
        value={ifscCode}
        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
      />
    </Form.Group>
  </>
  ) : selected.code === "BANK_ACCOUNT_ADVANCE" ? (
  <>
    <Form.Group className="mb-3">
      <Form.Label>Bank Account Number<span className="text-danger">*</span></Form.Label>
      <Form.Control
        placeholder="Enter account number"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>IFSC Code<span className="text-danger">*</span></Form.Label>
      <Form.Control
        placeholder="ICIC0001234"
        value={ifscCode}
        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Account Holder Name<span className="text-danger">*</span></Form.Label>
      <Form.Control
        placeholder="Name as per bank records"
        value={accountHolderName}
        onChange={(e) =>
          setAccountHolderName(e.target.value.toUpperCase())
        }
      />
    </Form.Group>
  </>
  ) : selected.code === "FSSAI_VERIFY" ? (
  <>
    <Form.Group className="mb-3">
      <Form.Label>FSSAI License Number<span className="text-danger">*</span></Form.Label>
      <Form.Control
        placeholder="Enter FSSAI number"
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
      />
      <small className="text-muted">
        14-digit FSSAI license number
      </small>
    </Form.Group>
  </>
  ) : selected.code === "GST_VERIFY" ? (
  <>
    <Form.Group className="mb-3">
      <Form.Label>GSTIN<span className="text-danger">*</span></Form.Label>
      <Form.Control
        placeholder="27AAACT1234A1Z5"
        value={value || ""}
        onChange={(e) =>
          setValue(e.target.value.toUpperCase())
        }
      />
      <small className="text-muted">
        15-character GST Identification Number
      </small>
    </Form.Group>
  </>
  ) : selected.code === "GST_ADVANCE" ? (
  <>
    <Form.Group className="mb-3" controlId="gstAdvGstin">
      <Form.Label className="fw-semibold">
        GSTIN <span className="text-danger">*</span>
      </Form.Label>
      <Form.Control
        type="text"
        placeholder="27ABCDE1234F1Z5"
        value={gstAdvGstin}
        maxLength={15}
        className="text-uppercase"
        onChange={(e) =>
          setGstAdvGstin(
            e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
          )
        }
      />
      <Form.Text className="text-muted">
        Enter 15-character GSTIN (e.g., 27ABCDE1234F1Z5)
      </Form.Text>
    </Form.Group>

    <Form.Group className="mb-3" controlId="gstAdvYear">
      <Form.Label className="fw-semibold">
        Financial Year <span className="text-danger">*</span>
      </Form.Label>
      <Form.Select
        value={gstAdvYear}
        onChange={(e) => setGstAdvYear(e.target.value)}
      >
        <option value="">Select Financial Year</option>
        <option value="2026-27">2026–27</option>
        <option value="2025-26">2025–26</option>
        <option value="2024-25">2024–25</option>
        <option value="2023-24">2023–24</option>
        <option value="2022-23">2022–23</option>
        <option value="2021-22">2021–22</option>
        <option value="2020-21">2020–21</option>
        <option value="2019-20">2019–20</option>
      </Form.Select>
      <Form.Text className="text-muted">
        Select the financial year for GST return data
      </Form.Text>
    </Form.Group>

    <Form.Group className="mb-2" controlId="gstAdvContact">
      <Form.Check
        type="switch"
        label="Fetch Contact Information"
        checked={gstAdvContact}
        onChange={(e) => setGstAdvContact(e.target.checked)}
      />
      <Form.Text className="text-muted d-block">
        Includes registered email and mobile linked with GSTIN
      </Form.Text>
    </Form.Group>
  </>
  
  ) : selected.code === "GSTPAN_LITE" ? (
  <>
    <Form.Group className="mb-3" controlId="gstPan">
      <Form.Label className="fw-semibold">
        Business PAN <span className="text-danger">*</span>
      </Form.Label>
      <Form.Control
        type="text"
        placeholder="AQEPY5307K"
        value={gstPan}
        maxLength={10}
        className="text-uppercase"
        onChange={(e) =>
          setGstPan(
            e.target.value
              .toUpperCase()
              .replace(/[^A-Z0-9]/g, "")
          )
        }
      />
      <Form.Text className="text-muted">
        Enter 10-character Business PAN
      </Form.Text>
    </Form.Group>
  </>
  ) : selected?.code === "UDYOG_AADHAAR_LITE" ? (
    <>
  <Form.Group className="mb-3">
    <Form.Label>Udyog / Udyam Aadhaar Number<span className="text-danger">*</span></Form.Label>
    <Form.Control
      type="text"
      placeholder="UDYAM-TS-02-0000001"
      value={udyogAadhaar}
      onChange={(e) => setUdyogAadhaar(e.target.value)}
    />
    <Form.Text className="text-muted">
      Accepted formats: <br />
      • UDYAM-TS-02-0000001 <br />
      
    </Form.Text>
  </Form.Group>
  </>
  ) : selected.code === "VEHICLE_RC_LITE" ? (
  <>
    <Form.Group className="mb-3">
      <Form.Label className="fw-semibold">
        Vehicle Registration Number <span className="text-danger">*</span>
      </Form.Label>

      <Form.Control
        type="text"
        placeholder="UP16AT5432"
        value={vehicleRcNumber}
        onChange={(e) =>
          setVehicleRcNumber(
            e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
          )
        }
      />

      <Form.Text className="text-muted">
       formats:
        • UP16AT5432
       
      </Form.Text>
    </Form.Group>
  </>
  ) : selected.code === "OCR_EXTRACT" ? (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Front side<span className="text-danger">*</span></Form.Label>
        <Form.Control
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setFrontImage(e.target.files[0])}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Back side</Form.Label>
        <Form.Control
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setBackImage(e.target.files[0])}
        />
        <small className="text-danger">
          ** Only for passport, Aadhaar & Voter ID
        </small>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Card Type<span className="text-danger">*</span></Form.Label>
        <Form.Select
          value={cardType}
          onChange={(e) => setCardType(e.target.value)}
        >
          <option value="">Select Card Type</option>
          <option value="PAN">PAN</option>
          <option value="AADHAAR">Aadhaar</option>
          <option value="PASSPORT">Passport</option>
          <option value="VOTER_ID">Voter ID</option>
        </Form.Select>
      </Form.Group>
    </>
  ) : (
    <Form.Group className="mb-3">
      <Form.Control
        placeholder="Enter value"
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
      />
    </Form.Group>
  )}

  <Form.Check
    label="I confirm and agree"
    checked={agreed}
    onChange={(e) => setAgreed(e.target.checked)}
  />

  <Button className="mt-3 w-100" onClick={submit} disabled={loading}>
    {loading ? <Spinner size="sm" /> : "Run Verification"}
  </Button>
</Form>

  {result && (
  <div
    className="mt-3 p-3 bg-light border rounded"
    style={{
      maxHeight: "300px",      // max height of result box
      overflowY: "auto",       // vertical scroll if content overflows
      whiteSpace: "pre-wrap",  // preserves line breaks for JSON/text
    }}
  >
    {renderPublicResult()}
  </div>
)}
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TrialCenter;
