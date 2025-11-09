import React, { useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

const SayurForm = ({ onSuccess }) => {
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const [gambar, setGambar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setGambar(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("harga", harga);
      formData.append("stok", stok);
      if (gambar) formData.append("gambar", gambar);

      await API.post("/sayur", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNama("");
      setHarga("");
      setStok("");
      setGambar(null);
      setPreview(null);
      toast.success("✅ Sayur berhasil ditambahkan!", {
  position: "top-center",
  autoClose: 2000,
  theme: "colored",
});

setTimeout(() => {
  if (onSuccess) onSuccess();
}, 1800);
    } catch (err) {
      console.error(err);
      toast.error("❌ Gagal menambahkan sayur!", {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md mx-auto my-6 w-[90%] md:w-[80%] flex flex-col md:flex-row items-center justify-between gap-4"
    >
      <h2 className="text-xl font-bold whitespace-nowrap text-green-800">
        Tambah Sayur
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-4 w-full">
        <input
          className="border p-2 rounded w-full md:w-1/4"
          placeholder="Nama Sayur"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />
        <input
          type="number"
          className="border p-2 rounded w-full md:w-1/5"
          placeholder="Harga"
          value={harga}
          onChange={(e) => setHarga(e.target.value)}
          required
        />
        <input
          type="number"
          className="border p-2 rounded w-full md:w-1/5"
          placeholder="Stok"
          value={stok}
          onChange={(e) => setStok(e.target.value)}
          required
        />

        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 rounded w-full md:w-auto"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 object-cover mt-2 rounded border"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Menambah..." : "Tambah"}
        </button>
      </div>
    </form>
  );
};

export default SayurForm;
