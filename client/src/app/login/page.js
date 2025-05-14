// src/app/login/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, setToken, getToken } from "../../lib/api"; // Pastikan path-nya sesuai


export default function Login() {
  // const router = useRouter();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [error, setError] = useState(null);

  // // useEffect(() => {
  // //   const token = getToken();
  // //   if (token) {
  // //     router.push("/admin/dashboard");
  // //   }
  // // }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   setError(null);

  //   try {
  //     const response = await login({ email, password });
  //     setToken(response.token);
  //     router.push("/admin/dashboard");
  //   } catch (err) {      
  //     setError("Login gagal, periksa kembali email dan password Anda.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  // const router = useRouter();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [error, setError] = useState(null);

  // // if token ada, push ke dashboard
  // // useEffect(() => {
  // //   const checkAuth = () => {
  // //     const token = getToken();
  // //     if (token) {
  // //       router.replace("/admin/dashboard");
  // //     } else {
  // //       setIsLoading(false);
  // //     }
  // //   };
    
  // //   checkAuth();
  // // }, [router]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   setError(null);

  //   try {
  //     const response = await login({ email, password });
  //     setToken(response.token);
  //     router.push("/admin/dashboard"); //push ke halaman dashboard ketika berhasil
  //   } catch (err) {
  //     setError("Login gagal, periksa kembali email dan password Anda.");
  //     router.push("/login"); // push balik ke login ketika gagal
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      // Just mark that we checked auth status
      setAuthChecked(true);
    } else {
      setAuthChecked(true);
    }
  }, []);

  
  useEffect(() => {
    if (authChecked) {
      const token = getToken();

      if (token) {
     
        const redirectTimer = setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 100);
        
        return () => clearTimeout(redirectTimer);
      }
    }
  }, [authChecked]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await login({ email, password });
      setToken(response.token);
      

      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError("Login gagal, periksa kembali email dan password Anda.");
      setIsSubmitting(false);
    }
  };


  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-100">
        <div className="text-blue-600">Memeriksa status login...</div>
      </div>
    );
  }


  if (authChecked && getToken()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-100">
        <div className="text-blue-600">Anda sudah login. Mengarahkan ke dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="w-full max-w-md p-6 md:p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src="/garuda-logo.png" alt="Garuda QHSE" className="max-w-[200px]" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">Login Admin</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan password"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2 transition-opacity duration-300">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
