import React, { useEffect, useState } from "react";
import API from "../api/api";
import AOS from "aos";
import "aos/dist/aos.css";

const FeaturedSayur = () => {
  const [sayur, setSayur] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      offset: 120,
    });
    fetchSayur();
  }, []);

  const fetchSayur = async () => {
    try {
      const res = await API.get("/sayur");
      setSayur(res.data.slice(0, 3));
    } catch (err) {
      console.error(err);
    }
  };

  if (sayur.length === 0) {
    return (
      <div className="text-center my-10">
        <p className="animate-pulse text-gray-500">Memuat produk unggulan...</p>  
      </div>
    );
  }

  return (
    <div className="container mx-auto my-10 px-4">
      <h2
        className="text-3xl font-bold mb-6 text-green-700 text-center"
        data-aos="fade-up"
      >
        🥕 Produk Unggulan
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sayur.map((s, index) => (
          <div
            key={s.id}
            data-aos="fade-right"
            className="relative bg-white shadow-lg rounded-xl p-4 transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              -10%
            </div>

            <img
              src={
                  s.gambar
                    ? s.gambar 
                    : "https://via.placeholder.com/150?text=No+Image" 
                }
              alt={s.nama}
              className="rounded-lg h-48 w-full object-cover shadow-sm"
            />

            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-800">{s.nama}</h3>
              <p className="text-green-600 font-bold mt-1">
                Rp {s.harga?.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSayur;
