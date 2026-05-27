"use client";
import React, { useContext, useState } from "react";
import { appContext } from "@/context/globalContext";
import { updateUserProfile } from "@/utils/profile";
import { Spinner } from "@/components/ui/spinner";

const EditProfile = () => {
  const { loading, setLoading, setError, error,setOpenForm } = useContext(appContext);
  const [details, setDetails] = useState({
    username: "",
    email: "",
    bio: "",
    password: "",
    confirmPassword: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    
    setError(null);

    const hasAnyField =
      details.username.trim() ||
      details.email.trim() ||
      details.bio.trim() ||
      details.password.trim() ||
      details.confirmPassword.trim();

    if (!hasAnyField) {
      setError("Please fill at least one field to update your profile");
      return;
    }

    if (
      (details.password || details.confirmPassword) &&
      details.password !== details.confirmPassword
    ) {
      setError("Password and confirm password must match");
      return;
    }

    setLoading(true);
    try {
      
      await updateUserProfile({
        username: details.username,
        email: details.email,
        password: details.password,
        bio: details.bio,
      });

      setDetails({
        username: "",
        email: "",
        bio: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setError(error?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm z-20"
    onClick={() => setOpenForm(false)}>
      <form className="flex flex-col p-5 gap-3 border-gray-400 border w-100 rounded-2xl"
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <label htmlFor="Username" className="text-start">
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
            className="h-10 w-full border border-gray-300 rounded-lg outline-none p-2"
          />
        </label>
        <label htmlFor="Email" className="text-start">
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
            className="h-10 w-full border border-gray-300 rounded-lg outline-none p-2"
          />
        </label>
         <label htmlFor="Bio" className="text-start">
          Bio
          <textarea
            value={details.bio}
            onInput={(e) => {
              setDetails((prev) => {
                return { ...prev, bio: e.target.value };
              });
            }}
            type="text"
            name="text"
            className="h-15 w-full border border-gray-300 rounded-lg outline-none p-2"
          />
        </label>
        <label htmlFor="Password" className="text-start">
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
            className="h-10 w-full border border-gray-300 rounded-lg outline-none p-2"
          />
        </label>
        <label htmlFor="Password" className="text-start">
          Confirm Password
          <input
            type="password"
            name="confirm"
            value={details.confirmPassword}
            onChange={(e) => {
              setDetails((prev) => {
                return { ...prev, confirmPassword: e.target.value };
              });
            }}
            className="h-10 w-full border border-gray-300 rounded-lg outline-none p-2"
          />
        </label>
        <div className="flex justify-between gap-2">
           <button
          type="submit"
          className="h-10 w-1/2 rounded-md bg-blue-500 font-bold cursor-pointer active:scale-[0.98] transition-transform"
        >
          {loading ? <Spinner /> : "Continue"}
        </button>
          <button type="button"
            className="h-10 w-1/2 bg-gray-300 font-bold cursor-pointer active:scale-[0.98] transition-transform rounded-md"
          onClick={()=> setOpenForm(false)}>Cancel</button>
       </div>
      </form>
    </div>
  );
};

export default EditProfile;
