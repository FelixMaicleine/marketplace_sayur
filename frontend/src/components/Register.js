import React, { useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // dummy
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi password tidak sama");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await API.post("/users/register", {
        username,
        password,
        role: "user",
      });

      localStorage.setItem("token", res.data.token);

      toast.success("Registrasi berhasil 🎉", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });

      setTimeout(() => (window.location.href = "/login"), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat registrasi ❌", {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center relative bg-cover bg-center py-10"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="relative z-10 flex-grow flex items-center justify-center p-6">
        <form
          onSubmit={handleRegister}
          className="bg-white bg-opacity-95 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-3 text-center text-green-700">
            Register
          </h2>

          <label className="block text-gray-700 mb-1 font-medium">Username</label>
          <input
            className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="block text-gray-700 mb-1 font-medium">Email</label>
          <input
            type="email"
            className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block text-gray-700 mb-1 font-medium">Password</label>
          <input
            type="password"
            className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="block text-gray-700 mb-1 font-medium">
            Konfirmasi Password
          </label>
          <input
            type="password"
            className={`border p-2 w-full mb-1 rounded focus:outline-none focus:ring-2 ${
              confirmPassword && confirmPassword !== password
                ? "focus:ring-red-500 border-red-500"
                : "focus:ring-green-500"
            }`}
            placeholder="Ulangi password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {confirmPassword && confirmPassword !== password && (
            <p className="text-red-500 text-sm mb-3">
              Konfirmasi password belum sama
            </p>
          )}

          {errorMsg && (
            <p className="text-red-600 text-sm text-center mb-2">{errorMsg}</p>
          )}

          <button
            disabled={
              !username ||
              !password ||
              !confirmPassword ||
              password !== confirmPassword ||
              loading
            }
            className="bg-green-600 text-white mt-2 py-2 px-6 rounded-full font-semibold hover:bg-green-700 transition disabled:opacity-70 mx-auto block"
          >
            {loading ? "Mendaftarkan..." : "Register"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-2">
            Sudah punya akun?{" "}
            <a
              href="/login"
              className="text-green-600 hover:underline font-semibold"
            >
              Login di sini
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
