import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("ongoing"); // ongoing / done

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/admin");
        setOrders(res.data);
      } catch (err) {
        toast.error("Gagal memuat pesanan: " + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [refresh]);

  const confirmMarkDone = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleMarkDone = async () => {
    if (!selectedOrder) return;
    try {
      await API.put(`/orders/${selectedOrder.id}/done`);
      toast.success(`Pesanan #${selectedOrder.id} berhasil ditandai selesai!`, { position: "top-center", autoClose: 2000, theme:"colored"});
      setRefresh(!refresh);
    } catch (err) {
      toast.error("Gagal update status: " + (err.response?.data?.error || err.message));
    } finally {
      setModalOpen(false);
      setSelectedOrder(null);
    }
  };

  if (loading) return <div className="text-center py-10">Loading data pesanan...</div>;

  // filter berdasarkan status tab
  const filteredOrders =
    activeTab === "ongoing"
      ? orders.filter((o) => o.status !== "done")
      : orders.filter((o) => o.status === "done");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">📦 Daftar Pesanan Pengguna</h2>

      {/* ===== Tab ===== */}
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
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-lg p-5 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-semibold text-gray-800">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    User: <span className="font-medium">{order.username}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === "done"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status === "done" ? "Selesai" : "Sedang Diproses"}
                  </span>
                  {order.status !== "done" && (
                    <button
                      onClick={() => confirmMarkDone(order)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Tandai Selesai
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t pt-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center mb-2"
                  >
                    <div className="flex items-center gap-3">
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
            </div>
          ))}
        </div>
      )}

      {/* ===== Modal Konfirmasi ===== */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-[90%] max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Tandai pesanan #{selectedOrder.id} sebagai selesai?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleMarkDone}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Ya
              </button>
              <button
                onClick={() => setModalOpen(false)}
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

export default AdminOrdersPage;
