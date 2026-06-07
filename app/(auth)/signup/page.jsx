"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

const Page = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (details.password !== details.confirmPassword) {
      setError("Password and confirm password must match");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: details.username.trim(),
        email: details.email.trim(),
        password: details.password,
      };

      await apiFetch("/auth/register", payload, "post");
      router.replace("/login");
    } catch (error) {
      setError(error?.message || "Failed to create an account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-2xl w-100 p-5">
      <h1 className="text-center text-2xl font-bold">Sign Up</h1>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <form onSubmit={handleSubmit} className="flex flex-col p-5 gap-3">
        <label htmlFor="Username">
          Username
          <input
            value={details.username}
            onInput={(e) => {
              setDetails((prev) => {
                return { ...prev, username: e.target.value };
              });
            }}
            type="text"
            name="username"
            required
            className="h-10 w-full border border-gray-300 rounded-lg outline-none p-2"
          />
        </label>
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
        <label htmlFor="Password">
          Confirm Password
          <input
            type="password"
            name="confirm"
            value={details.confirmPassword}
            onChange={(e) => {
                setDetails((prev) => {
                  return {...prev, confirmPassword: e.target.value}
              });
            }}
            required
            className="h-10 w-full border border-gray-300 rounded-lg outline-none p-2"
          />
        </label>
        <button
          type="submit"
          className="w-full h-10 rounded-md bg-violet-700 text-white font-bold cursor-pointer active:scale-98"
        >
          {loading ? <Spinner /> : "Continue"}
        </button>
      </form>
      <p>
        already have an account? <Link href={"/login"}>Login</Link>
      </p>
    </div>
  );
};

export default Page;
