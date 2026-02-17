export const docsSidebar = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction", key: "introduction" },
      { label: "Authentication", key: "authentication" },
      { label: "API Base URL", key: "baseUrl" },
      { label: "Response Structure", key: "response" },
      { label: "Errors", key: "errors" }
    ]
  },
  {
    title: "Management",
    items: [
      { label: "Product Subscription", key: "subscription" },
      { label: "Products to App", key: "productToApp" },
      { label: "App Key Management", key: "appKeys" }
    ]
  },
  {
    title: "Products",
    items: [
      {
        label: "Identity",
        children: [
          { label: "PAN Verification Lite", key: "identity_pan_lite" }
        ]
      },
      {
        label: "Financial",
        children: [
          { label: "GST Advance", key: "financial_gst_advance" },
          { label: "PAN Lite", key: "financial_pan_lite" }
        ]
      },
      {
        label: "Utility",
        children: [
          { label: "DL Lite", key: "utility_dl" },
          { label: "Voter ID Lite", key: "utility_voter" },
          { label: "IFSC Verification", key: "utility_ifsc" },
          { label: "Address Verification", key: "utility_address" },
          { label: "Email Verification", key: "utility_email" },
          { label: "Phone Verification", key: "utility_phone" },
          { label: "OCR Lite", key: "utility_ocr" }
        ]
      }
    ]
  }
];
