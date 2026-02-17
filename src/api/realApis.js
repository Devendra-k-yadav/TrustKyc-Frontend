// ================= IFSC VERIFICATION =================
export const verifyIFSC = async (ifsc) => {
  const res = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
  if (!res.ok) throw new Error("Invalid IFSC");
  return res.json();
};

// ================= EMAIL VERIFICATION =================
export const verifyEmail = async (email) => {
  const domain = email.split("@")[1];
  return {
    email,
    validFormat: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    domain,
    disposable: ["tempmail.com", "10minutemail.com", "mailinator.com"].includes(domain),
    mx: null,
    status: "valid",
  };
};

// ================= PHONE VERIFICATION =================
export const verifyPhone = async (phone) => {
  const isValid = /^[6-9]\d{9}$/.test(phone);
  if (!isValid) throw new Error("Invalid phone number");
  return {
    phone,
    valid: isValid,
    country: "India",
    type: "Mobile",
  };
};

// ================= ADDRESS VERIFICATION =================
export const verifyAddress = async (address) => {
  if (!address) throw new Error("Address is required");
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`
  );
  if (!res.ok) throw new Error("Address verification failed");
  return res.json();
};

// ================= OCR (PARTIALLY REAL FREE) =================
export const ocrExtract = async (file) => {
  if (!file) throw new Error("File is required for OCR");
  const formData = new FormData();
  formData.append("apikey", "helloworld"); // Public demo key
  formData.append("file", file);

  const res = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("OCR extraction failed");
  return res.json();
};

// // ================= PAN VERIFICATION (DEMO) =================
// export const verifyPAN = async (pan) => {
//   return {
//     pan,
//     name: "RAJ DEVENDRA YADAV",
//     dob: "1990-01-01",
//     status: /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan) ? "valid" : "invalid"
//   };
// };

// // ================= GST VERIFICATION (PARTIALLY REAL FREE) =================
// export const verifyGST = async (gst) => {
//   try {
//     // Using free API from gst.gov.in demo (simulated here with dummy fetch)
//     const res = await fetch(`https://api.gst.gov.in/v1/returns/gst/${gst}`);
//     if (!res.ok) throw new Error("GST verification failed");
//     const data = await res.json();
//     return {
//       gst,
//       company: data.legalName || "Demo Pvt Ltd",
//       state: data.state || "Maharashtra",
//       status: data.status || "active",
//     };
//   } catch {
//     // fallback mock if API unavailable
//     return {
//       gst,
//       company: "Demo Pvt Ltd",
//       state: "Maharashtra",
//       status: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst) ? "active" : "inactive"
//     };
//   }
// };

// // ================= AADHAAR VERIFICATION (DEMO) =================
// export const verifyAadhaar = async (aadhaar) => {
//   return {
//     aadhaar,
//     name: "RAJ DEVENDRA YADAV",
//     dob: "1990-01-01",
//     status: /^\d{12}$/.test(aadhaar) ? "valid" : "invalid"
//   };
// };

// // ================= VOTER ID VERIFICATION (DEMO) =================
// export const verifyVoter = async (voterId) => {
//   return {
//     voterId,
//     name: "RAJ DEVENDRA YADAV",
//     constituency: "Mumbai North",
//     status: /^[A-Z]{3}[0-9]{7}$/.test(voterId) ? "valid" : "invalid"
//   };
// };

// // ================= DRIVING LICENCE VERIFICATION (DEMO) =================
// export const verifyDL = async (dl) => {
//   return {
//     dl,
//     name: "RAJ DEVENDRA YADAV",
//     state: "Maharashtra",
//     expiry: "2030-01-01",
//     status: /^[A-Z]{2}[0-9]{13}$/.test(dl) ? "valid" : "invalid"
//   };
// };
