import React, { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    fetchCartFromDB(user.id);
  }, []);

  // 🔹 Ambil cart dari database
  const fetchCartFromDB = async (userId) => {
    try {
      const res = await API.get(`/cart/${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error("Gagal ambil data cart:", err);
      toast.error("Gagal ambil data cart!", { position: "top-center" });
    }
  };

  // 🔹 Checkout
  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.warning("Silakan login terlebih dahulu!", { position: "top-center" });
      return;
    }

    try {
      await API.post("/cart/checkout", { user_id: user.id });
      toast.success("Checkout berhasil!", { position: "top-center", autoClose: 2000, theme:"colored"});
      setCartItems([]); // kosongkan tampilan cart
      navigate("/orders"); // arahkan ke halaman pesanan
    } catch (err) {
      toast.error(
        "Gagal checkout: " + (err.response?.data?.error || err.message),
        { position: "top-center", autoClose: 3000 }
      );
    }
  };

  // 🔹 Total harga
  const total = cartItems.reduce((acc, i) => acc + i.harga * i.quantity, 0);

  return (
    <div className="p-6 flex items-start justify-center">
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Keranjang Belanja</h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Keranjang kosong</p>
            <button
              onClick={() => navigate("/sayur")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Belanja Sekarang
            </button>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200"
              >
                <div className="flex items-center gap-3">
                  {item.gambar && (
                    <img
                      src={item.gambar}
                      alt={item.nama}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <div>
                    <span className="font-semibold">{item.nama}</span>
                    <span className="text-gray-500 ml-2">× {item.quantity}</span>
                  </div>
                </div>
                <span className="font-semibold text-green-700">
                  Rp {(item.harga * item.quantity).toLocaleString("id-ID")}
                </span>
              </div>
            ))}

            <div className="mt-6 pt-4 border-t-2 border-gray-300">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-green-700">
                  Rp {total.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg w-full font-semibold hover:bg-green-700 transition"
            >
              💳 Bayar Sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
