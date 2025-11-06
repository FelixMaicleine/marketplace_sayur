import React, { useEffect, useState } from "react";
import API from "../api/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ongoing"); // ongoing / done

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await API.get(`/orders/user/${user.id}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Gagal ambil data order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  // filter orders berdasarkan tab
  const filteredOrders =
    activeTab === "ongoing"
      ? orders.filter((o) => o.status !== "done")
      : orders.filter((o) => o.status === "done");

  if (orders.length === 0)
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Belum ada pesanan.</p>
        <a
          href="/sayur"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Belanja Sekarang
        </a>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Pesanan Saya</h2>

      {/* ===== Tabs ===== */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === "ongoing"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("ongoing")}
        >
          Sedang Diproses
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === "done"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("done")}
        >
          Selesai
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-600 py-12">
          Tidak ada pesanan untuk tab ini.
        </div>
      ) : (
        filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md rounded-lg p-5 mb-6 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-800">
                Order #{order.id}
              </span>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  order.status === "done"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status === "done" ? "Selesai" : "Sedang Diproses"}
              </span>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {item.gambar && (
                      <img
                        src={item.gambar}
                        alt={item.nama}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <span>{item.nama}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {item.quantity} × Rp {item.price.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-3 flex justify-between font-semibold">
              <span>Total:</span>
              <span>Rp {order.total.toLocaleString("id-ID")}</span>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              {new Date(order.created_at).toLocaleString("id-ID")}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
