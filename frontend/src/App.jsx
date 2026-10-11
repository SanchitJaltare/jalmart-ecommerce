
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "../pages/Homepage.jsx";
import ProductList from "../pages/ProductList.jsx";
import ProductDetail from "../pages/ProductDetail.jsx";
import ContactPage from "../pages/ContactPage.jsx";
import PrivacyPage from "../pages/PrivacyPolicyPage.jsx";
import CustomerSignIn from "../pages/CustomerSignIn.jsx";

import Cart from "./Cart.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />
        <Route path="/login" element={<CustomerSignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
