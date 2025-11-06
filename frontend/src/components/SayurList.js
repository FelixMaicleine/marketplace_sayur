import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast } from "react-toastify";


const SayurList = ({ user }) => {
  const [sayur, setSayur] = useState([]);
  const [cart, setCart] = useState({});
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);


  const role = user?.role || "user";

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 120 });
    fetchSayur();
    if (role === "user" && user?.id) fetchCart();
  }, []);

  // 🔹 Ambil daftar sayur
  const fetchSayur = async () => {
    try {
      const res = await API.get("/sayur");
      setSayur(res.data);
      setEditData({});
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Ambil data cart dari backend
  const fetchCart = async () => {
    try {
      const res = await API.get(`/cart/${user.id}`);
      const cartData = {};
      res.data.forEach((item) => {
        cartData[item.sayur_id] = item.quantity;
      });
      setCart(cartData);
    } catch (err) {
      console.error("Gagal ambil cart:", err);
    }
  };

  // 🔹 Tambahkan ke cart (backend)
  const handleAdd = async (sayur_id) => {
    try {
      await API.post("/cart/add", {
        user_id: user.id,
        sayur_id,
        quantity: 1,
      });
      setCart((prev) => ({ ...prev, [sayur_id]: (prev[sayur_id] || 0) + 1 }));
    } catch (err) {
      console.error("Gagal menambah ke cart:", err);
    }
  };

  // 🔹 Kurangi dari cart (frontend + optional backend hapus kalau quantity 0)
  const handleRemove = async (sayur_id) => {
  try {
    await API.post("/cart/add", {
      user_id: user.id,
      sayur_id,
      quantity: -1,
    });

    // Update frontend sesuai backend: kalau quantity sekarang = 1, hapus; kalau >1, kurangi
    setCart((prev) => {
      const currentQty = prev[sayur_id] || 0;
      const newQty = currentQty - 1;
      if (newQty <= 0) {
        const newCart = { ...prev };
        delete newCart[sayur_id];
        return newCart;
      } else {
        return { ...prev, [sayur_id]: newQty };
      }
    });
  } catch (err) {
    console.error("Gagal menghapus dari cart:", err);
  }
};


  // 🔹 Menuju halaman cart
  const goToCart = () => {
    navigate("/cart");
  };

  // 🔹 Input admin (edit)
  const handleInputChange = (id, field, value) => {
    setEditData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // 🔹 Simpan update sayur (admin)
  const handleSave = async (item) => {
    try {
      const changes = editData[item.id];
      if (!changes) {
        toast.warning("⚠️ Tidak ada perubahan untuk disimpan!", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      const dataToUpdate = {
        nama: changes.nama ?? item.nama,
        harga: changes.harga ?? item.harga,
        stok: changes.stok ?? item.stok,
      };

      await API.put(`/sayur/${item.id}`, dataToUpdate);
      await fetchSayur();

      toast.success("✅ Data berhasil disimpan!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    } catch (err) {
      console.error(err);
      toast.error("❌ Gagal menyimpan data!", {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
      });
    }
  };


  // 🔹 Batal edit admin
  const handleCancel = (id) => {
    setEditData((prev) => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });
  };

  // 🔹 Hapus sayur (admin)
  const handleDelete = (id) => {
    setDeleteId(id); // buka modal konfirmasi
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/sayur/${deleteId}`);
      setSayur((prev) => prev.filter((item) => item.id !== deleteId));
      toast.success("🗑️ Sayur berhasil dihapus!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    } catch (err) {
      console.error(err);
      toast.error("❌ Gagal menghapus sayur!", {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
      });
    } finally {
      setDeleteId(null); // tutup modal
    }
  };



  // 🔹 Helper ambil input admin
  const getInputValue = (item, field) => {
    return editData[item.id]?.[field] ?? item[field];
  };

  // 🔹 UI
  return (
    <div className="container mx-auto px-4 py-8">
      <h2
        className="text-3xl font-bold mb-8 text-center text-green-900"
        data-aos="fade-down"
      >
        {role === "admin" ? "Kelola Sayur (Admin)" : "🌿 Daftar Sayur Segar"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sayur.map((item, index) => (
          <div
            key={item.id}
            data-aos="fade-right"
            data-aos-delay={index * 100}
            className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative h-52 bg-white flex justify-center items-center">
              <img
                src={
                  item.gambar
                    ? item.gambar
                    : "https://via.placeholder.com/150?text=No+Image"
                }
                alt={item.nama}
                className="h-full w-full object-contain p-3"
              />
            </div>

            <div className="p-5">
              {role === "admin" ? (
                <>
                  {/* Admin Mode */}
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Nama Sayur:
                  </label>
                  <input
                    type="text"
                    value={getInputValue(item, "nama")}
                    onChange={(e) =>
                      handleInputChange(item.id, "nama", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded w-full mb-3 focus:border-green-600 focus:outline-none"
                  />
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Harga (Rp):
                  </label>
                  <input
                    type="number"
                    value={getInputValue(item, "harga")}
                    onChange={(e) =>
                      handleInputChange(item.id, "harga", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded w-full mb-3 focus:border-green-600 focus:outline-none"
                  />
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Stok:
                  </label>
                  <input
                    type="number"
                    value={getInputValue(item, "stok")}
                    onChange={(e) =>
                      handleInputChange(item.id, "stok", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded w-full mb-3 focus:border-green-600 focus:outline-none"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleSave(item)}
                      className="flex-1 bg-green-800 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                      Simpan
                    </button>
                    {editData[item.id] && (
                      <button
                        onClick={() => handleCancel(item.id)}
                        className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
                      >
                        Batal
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 bg-red-700 text-white py-2 rounded hover:bg-red-600 transition"
                    >
                      Hapus
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* User Mode */}
                  <h3 className="font-bold text-xl text-gray-800 mb-1">
                    {item.nama}
                  </h3>
                  <p className="text-green-700 font-semibold mb-1">
                    Rp {item.harga.toLocaleString("id-ID")}
                  </p>
                  <p className="text-gray-600 mb-4">Stok: {item.stok}</p>

                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="bg-red-700 text-white px-4 py-1.5 rounded-full hover:bg-red-600 transition"
                    >
                      −
                    </button>
                    <span className="font-semibold text-lg">
                      {cart[item.id] || 0}
                    </span>
                    <button
                      onClick={() => handleAdd(item.id)}
                      className="bg-green-800 text-white px-4 py-1.5 rounded-full hover:bg-green-700 transition"
                    >
                      +
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tombol cart muncul jika user punya isi keranjang */}
      {role === "user" && Object.keys(cart).length > 0 && (
        <button
          onClick={goToCart}
          className="fixed bottom-8 right-8 bg-green-800 text-white text-3xl p-4 rounded-full shadow-xl hover:bg-green-700 transition-all duration-300 flex items-center justify-center"
        >
          🛒
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {Object.values(cart).reduce((a, b) => a + b, 0)}
          </span>
        </button>
      )}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-[90%] max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Yakin ingin menghapus sayur ini?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Hapus
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );


};

export default SayurList;
