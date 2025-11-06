import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  let user = null;
  try {
    const saved = localStorage.getItem("user");
    if (saved && saved !== "undefined") user = JSON.parse(saved);
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("✅ Logout berhasil!", { position: "top-center", autoClose: 2000, theme:"colored"});
    setTimeout(() => {
      window.location.href = "/login";
    }, 1800); // kasih delay supaya toast sempat muncul
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-green-950 text-white px-6 py-3 flex justify-between items-center shadow-md">
      {/* === LEFT SIDE === */}
      <div className="flex items-center space-x-6">
        <h1 className="text-2xl font-bold">
          <Link to="/">Sayurans.id</Link>
        </h1>
        <div className="flex space-x-4">
          {user ? (
            <span className="font-semibold">Hi, {user.username}</span>
          ) : (
            <span className="font-semibold">Welcome</span>
          )}
        </div>
      </div>

      {/* === RIGHT SIDE === */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/sayur" className="hover:underline">Menu</Link>

        {user && (
          <Link
            to={user.role === "admin" ? "/admin/orders" : "/orders"}
            className="hover:underline"
          >
            Orders
          </Link>
        )}

        {user ? (
          <button
            onClick={handleLogout}
            className="bg-orange-600 hover:bg-orange-900 px-3 py-1 rounded text-sm transition"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
