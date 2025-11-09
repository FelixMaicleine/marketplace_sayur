import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const DiscountBanner1 = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      easing: "ease-out",
      once: true, 
    });
  }, []);

  return (
    <div
      data-aos="fade-right" 
      className="relative h-32 flex items-center justify-between text-white mx-1 my-4 rounded-lg overflow-hidden"
    >
      {/* overlay orange transparan */}
      <div className="absolute inset-0 bg-orange-500 bg-opacity-100"></div>

      <div className="relative z-10 flex justify-between items-center w-full px-6">
        <div>
          <h2 className="text-2xl font-bold">Diskon Sayur Segar 10%</h2>
          <p className="text-sm">
            Nikmati sayuran sehat langsung dari petani ke rumah Anda
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiscountBanner1;
