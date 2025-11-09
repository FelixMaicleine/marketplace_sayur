import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%253D%253D&auto=format&fit=crop&w=1974&q=80",
    title: "Selamat Datang di Sayurans.id",
    subtitle: "Belanja sayur segar terbaik di Medan",
  },
  {
    image:
      "https://wallpaperaccess.com/full/4050690.jpg",
    title: "Sayur Segar Langsung dari Petani",
    subtitle: "Dapatkan kualitas premium setiap hari 🌱",
  },
  {
    image:
      "https://as2.ftcdn.net/v2/jpg/06/61/77/77/1000_F_661777716_efIJWaTuF9QDVElhSbcGyqYpmf7drBD0.jpg",
    title: "Belanja Mudah, Harga Bersahabat",
    subtitle: "Pesan kapan saja, antar langsung ke rumah 🛒",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      10000
    );
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative h-[615px] overflow-hidden -mt-16">
      <AnimatePresence>
        {slides.map(
          (slide, index) =>
            index === current && (
              <motion.div
                key={index}
                className="absolute inset-0 flex items-center justify-center text-center text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40" />
                <motion.div
                  className="relative z-10"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 1 }}
                >
                  <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl drop-shadow-md">
                    {slide.subtitle}
                  </p>
                </motion.div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Panah kiri */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 z-20"
      >
        <ChevronLeftIcon className="w-8 h-8" />
      </button>

      {/* Panah kanan */}
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 z-20"
      >
        <ChevronRightIcon className="w-8 h-8" />
      </button>

      {/* Dots navigasi */}
      <div className="absolute bottom-6 w-full flex justify-center space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === current ? "bg-green-500 scale-110" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Hero;
