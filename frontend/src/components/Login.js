import React, { useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/users/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login berhasil! 👋", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });

      setTimeout(() => (window.location.href = "/"), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Username atau password salah ❌", {
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
      className="relative flex items-center justify-center py-28 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="relative z-10 flex-grow flex items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="bg-white bg-opacity-95 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-green-700">
            Login
          </h2>

          <label className="block text-gray-700 font-medium mb-1">Username</label>
          <input
            className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={!username || !password || loading}
            className={`bg-green-600 text-white py-2 px-6 rounded-full font-semibold mx-auto block transition ${
              !username || !password
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-green-700"
            }`}
          >
            {loading ? "Memproses..." : "Login"}
          </button>

          <p className="text-center text-gray-700 text-sm mt-4">
            Belum punya akun?{" "}
            <a
              href="/register"
              className="text-green-600 font-medium hover:underline"
            >
              Daftar di sini
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
