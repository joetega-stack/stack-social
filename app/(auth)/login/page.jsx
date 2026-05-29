"use client";
import React from "react";
import Link from "next/link";
import { useState, useContext } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { appContext } from "@/context/globalContext";
import { saveToken } from "@/lib/auth";



const Page = () => {
  const {loading, setLoading, error, setError} = useContext(appContext)
  const [details, setDetails] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        email: details.email.trim(),
        password: details.password,
      };

      const data = await apiFetch("/auth/login", payload, "POST");
      const token = data?.access_token || data?.token;
      if (!token) {
        throw new Error("Login response did not include an access token");
      }
      saveToken(token);
      router.replace("/main-page");
    } catch (error) {
      setError(error?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-2xl w-100 p-5">
      <h1 className="text-center text-2xl font-bold">Login</h1>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <form onSubmit={handleSubmit} className="flex flex-col p-5 gap-3">
        
        <label htmlFor="Email">
          Email
          <input
            value={details.email}
            onInput={(e) => {
              setDetails((prev) => {
                return { ...prev, email: e.target.value };
              });
            }}
            type="Email"
            name="email"
            required
            className="h-10 w-full border border-gray-300 rounded-lg outline-none p-2"
          />
        </label>
        <label htmlFor="Password">
          Password
          <input
            value={details.password}
            onInput={(e) => {
              setDetails((prev) => {
                return { ...prev, password: e.target.value };
              });
            }}
            type="password"
            name="password"
            required
            className="h-10 w-full border border-gray-300 rounded-lg outline-none p-2"
          />
        </label>
        <button
          type="submit"
          className="w-full h-10 rounded-md bg-violet-700 font-bold cursor-pointer active:scale-98"
        >
          {loading? <Spinner/> :"Continue"}
        </button>
      </form>
      <p>
        Don&apos;t have an account? <Link href={"/signup"}>Signup</Link>
      </p>
    </div>
  );
};

export default Page;
