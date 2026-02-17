import Introduction from "../../docs/common/Introduction";
import Authentication from "../../docs/common/Authentication";
import BaseUrl from "../../docs/common/BaseUrl";
import Response from "../../docs/common/ResponseStructure";
import Errors from "../../docs/common/Errors";
import Subscription from "../../docs/common/Subscription";
import AppKeys from "../../docs/common/AppKeyManagement";
import ProductToApp from "../../docs/common/ProductToApp";

// Products
import PanIdentity from "../../docs/products/identity/PanLite";
import GstAdvance from "../../docs/products/financial/GstAdvance";
import PanFinancial from "../../docs/products/financial/PanLite";
import Dl from "../../docs/products/utility/DlLite";
import Voter from "../../docs/products/utility/VoterLite";
import Ifsc from "../../docs/products/utility/Ifsc";
import Address from "../../docs/products/utility/Address";
import Email from "../../docs/products/utility/Email";
import Phone from "../../docs/products/utility/Phone";
import Ocr from "../../docs/products/utility/Ocr";

const DocsContent = ({ activeDoc }) => {
  const map = {
    introduction: <Introduction />,
    authentication: <Authentication />,
    baseUrl: <BaseUrl />,
    response: <Response />,
    errors: <Errors />,
    subscription: <Subscription />,
    appKeys: <AppKeys />,
    productToApp: <ProductToApp />,

    identity_pan_lite: <PanIdentity />,
    financial_gst_advance: <GstAdvance />,
    financial_pan_lite: <PanFinancial />,
    utility_dl: <Dl />,
    utility_voter: <Voter />,
    utility_ifsc: <Ifsc />,
    utility_address: <Address />,
    utility_email: <Email />,
    utility_phone: <Phone />,
    utility_ocr: <Ocr />
  };

  return (
    <div className="flex-grow-1  overflow-auto">
      {map[activeDoc]}
    </div>
  );
};

export default DocsContent;
