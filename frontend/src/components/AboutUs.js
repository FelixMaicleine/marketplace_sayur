import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutUs = () => {
  useEffect(() => {
    AOS.init({
      duration: 800, 
      easing: "ease-out", 
      once: true, 
    });
  }, []);

  return (
    <section className="relative bg-green-950 py-16 px-6 md:px-20 mt-5">
      <div className="max-w-4xl mx-auto text-center">
        {/* Title */}
        <h2
          data-aos="fade-down"
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          Tentang Kami
        </h2>

        {/* Paragraph 1 */}
        <p
          data-aos="fade-right"
          data-aos-delay="100"
          className="text-white text-md md:text-lg leading-relaxed mb-4"
        >
          Sayurans.id hadir untuk memudahkan Anda mendapatkan sayuran segar langsung
          dari petani ke rumah Anda.
        </p>

        {/* Paragraph 2 */}
        <p
          data-aos="fade-left"
          data-aos-delay="200"
          className="text-white text-md md:text-lg leading-relaxed mb-4"
        >
          Kami berkomitmen menyediakan produk berkualitas dengan harga terjangkau
          serta layanan pengiriman yang cepat dan aman.
        </p>

        {/* Paragraph 3 */}
        <p
          data-aos="fade-right"
          data-aos-delay="300"
          className="text-white text-md md:text-lg leading-relaxed"
        >
          Misi kami adalah mendekatkan konsumen dengan petani lokal, sekaligus
          mendukung pertanian berkelanjutan di Indonesia.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
