import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedSayur from "./components/FeaturedSayur";
import Footer from "./components/Footer";
import SayurList from "./components/SayurList";
import SayurForm from "./components/SayurForm";
import Login from "./components/Login";
import Register from "./components/Register";
import DiscountBanner from "./components/DiscountBanner";
import CartPage from "./components/CartPage";
import OrdersPage from "./components/OrdersPage";
import AdminOrdersPage from "./components/AdminOrdersPage";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import DiscountBanner1 from "./components/DiscountBanner1";
import AboutUs from "./components/AboutUs";


function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col pt-14 bg-[#fffaf3]">
        <Navbar user={user} />

        <main className="flex-1">
          <Routes>
            {/* Halaman utama */}
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  
                  <DiscountBanner />
                  <AboutUs />
                  <FeaturedSayur />
                </>
              }
            />

            {/* Halaman daftar sayur */}
            <Route
              path="/sayur"
              element={
                <div className="container mx-auto my-6">
                  {role === "admin" && (
                    <SayurForm onSuccess={() => window.location.reload()} />
                  )}
                  <DiscountBanner1 />
                  <SayurList user={user} />
                </div>
              }
            />

            {/* Halaman login & register */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Halaman keranjang untuk user */}
            <Route
              path="/cart"
              element={
                user && role === "user" ? (
                  <CartPage user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/orders"
              element={<OrdersPage />}
            />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            
          </Routes>
          <ToastContainer position="top-center" autoClose={2500} theme="colored" />
          
        </main>

        <Footer />
      </div>
    </BrowserRouter>
    
  );
}

export default App;
