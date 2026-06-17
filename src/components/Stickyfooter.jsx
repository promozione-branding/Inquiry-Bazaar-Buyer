"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  User,
  Package,
  FilePlus2,
  Settings,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Stickyfooter = () => {
  const [showRequirementModal, setShowRequirementModal] =
    useState(false);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [product, setProduct] = useState("");
  const [requirement, setRequirement] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const pathname = usePathname();

  if (!user) return null;

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit2 = async () => {
    if (submitting) return;

    if (!product.trim()) {
      return toast.error("Please enter a product/service name");
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("product", product);
      formData.append("requirement", requirement);

      if (image) {
        formData.append("image", image);
      }

      await axios.post("/api/post-requirement", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("RFQ submitted successfully!");

      setProduct("");
      setRequirement("");
      setImage(null);
      setPreview(null);
      setShowRequirementModal(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to submit RFQ"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const menus = [
    {
      href: "/dashboard",
      label: "Home",
      icon: House,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
    },
    {
      href: "requirement",
      label: "Requirement",
      icon: FilePlus2,
      center: true,
    },
    {
      href: "/help",
      label: "Help",
      icon: Package,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Bottom Navbar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white border-t rounded-t-3xl shadow-xl px-3 pt-2 pb-2">
          <div className="grid grid-cols-5 items-end">
            {menus.map((item) => {
              const Icon = item.icon;

              const active = item.center
                ? false
                : pathname === item.href;

              if (item.center) {
                return (
                  <button
                    key={item.label}
                    onClick={() => setShowRequirementModal(true)}
                    className="flex flex-col items-center"
                  >
                    <div className=" -mt-8 w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white bg-[#19b6a4] text-white">
                      <Icon size={26} />
                    </div>

                    <span className="text-xs mt-1 text-gray-500">
                      {item.label}
                    </span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center"
                >
                  <Icon
                    size={22}
                    className={
                      active ? "text-blue-600" : "text-gray-500"
                    }
                  />

                  <span
                    className={`text-xs mt-1 ${
                      active ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {item.label}
                  </span>

                  <div
                    className={`mt-1 h-1 w-1 rounded-full ${
                      active ? "bg-blue-600" : "bg-transparent"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showRequirementModal && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999] flex items-end justify-center"
          onClick={() => setShowRequirementModal(false)}
        >
          <div
            className="bg-white w-full h-[85vh] rounded-t-3xl p-5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-5" />

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">
                Post Requirement
              </h2>

              <button onClick={() => setShowRequirementModal(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Upload */}
            <label
              htmlFor="upload"
              className="border-2 border-dashed border-gray-300 rounded-2xl h-[220px] flex flex-col items-center justify-center cursor-pointer text-center"
            >
              {preview ? (
                <img
                  src={preview}
                  alt=""
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <>
                  <p className="font-semibold mt-3">
                    Upload Product Photo
                  </p>
                </>
              )}
            </label>

            <input
              id="upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImage}
            />

            {/* Product */}
            <div className="mt-5">
              <label className="text-sm font-medium">
                Product / Service
              </label>

              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Enter product name"
                className="mt-2 w-full h-12 px-4 border rounded-xl outline-none"
              />
            </div>

            {/* Requirement */}
            <div className="mt-4">
              <label className="text-sm font-medium">
                Requirement Details
              </label>

              <textarea
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                rows={4}
                placeholder="Enter requirement"
                className="mt-2 w-full p-4 border rounded-xl outline-none"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit2}
              disabled={submitting}
              className="mt-5 w-full h-12 bg-orange-500 text-white rounded-xl font-semibold disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                      className="opacity-75"
                    />
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Requirement"
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Stickyfooter;