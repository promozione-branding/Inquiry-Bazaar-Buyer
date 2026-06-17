"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ChevronDown } from "lucide-react";


import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
const [selectedCity, setSelectedCity] = useState("Detecting...");
const [loadingLocation, setLoadingLocation] = useState(true);

const [requirement, setRequirement] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [product, setProduct] = useState("");
const [submitting, setSubmitting] = useState(false);


 const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!product) return alert("Enter product name");

    const formData = new FormData();

    formData.append("product", product);

    if (image) {
      formData.append("image", image);
    }

    const res = await axios.post(
      "/api/post-requirement",
      formData
    );

    alert("Requirement submitted");
  };



  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        fetchSearchResults();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [searchQuery]);








useEffect(() => {
  const savedCity =
    localStorage.getItem("selectedCity");

  if (savedCity) {
    setSelectedCity(savedCity);
    setLoadingLocation(false);
    return;
  }

  if (!navigator.geolocation) {
    setSelectedCity("Select Location");
    setLoadingLocation(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } =
          position.coords;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        const data = await res.json();

        const city =
          data?.address?.city ||
          data?.address?.town ||
          data?.address?.village ||
          data?.address?.state ||
          "Your Location";

        setSelectedCity(city);

        localStorage.setItem(
          "selectedCity",
          city
        );

        localStorage.setItem(
          "userLat",
          latitude
        );

        localStorage.setItem(
          "userLng",
          longitude
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingLocation(false);
      }
    },
    () => {
      setSelectedCity("Select Location");
      setLoadingLocation(false);
    }
  );
}, []);



  const fetchSearchResults = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/search?q=${searchQuery}`
      );

      const data = await res.json();

      const results = [
        ...(data?.data?.industries || []).map((item) => ({
          ...item,
          type: "Industry",
        })),
        ...(data?.data?.categories || []).map((item) => ({
          ...item,
          type: "Category",
        })),
        ...(data?.data?.products || []).map((item) => ({
          ...item,
          type: "Product",
        })),
      ];

      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const saveRecentSearch = (item) => {
    try {
      const existing =
        JSON.parse(localStorage.getItem("recentSearches")) || [];

      const searchData = {
        keyword: item.slug,
        name: item.name,
        type: item.type,
        timestamp: Date.now(),
      };

      const filtered = existing.filter(
        (search) => search.keyword !== item.slug
      );

      filtered.unshift(searchData);

      localStorage.setItem(
        "recentSearches",
        JSON.stringify(filtered.slice(0, 10))
      );
    } catch (err) {
      console.log(err);
    }
  };


// for recommend
const [recommendedProducts, setRecommendedProducts] = useState([]);
const [recommendedCategories, setRecommendedCategories] = useState([]);
const [searches, setSearches] = useState([]);


const fetchRecommendedCategories = async () => {
  try {
    const searches =
      JSON.parse(
        localStorage.getItem("recentSearches")
      ) || [];

    const categorySearches = searches.filter(
      (item) => item.type === "Category"
    );

    if (!categorySearches.length) {
      setRecommendedCategories([]);
      return;
    }

 
    const keywords = categorySearches.map((item) =>
      item.name.toLowerCase()
    );

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/categories`
    );

    const data = await res.json();

    console.log("Categories API:", data);

    const allCategories = data?.data || [];

  
    const matchedCategories = allCategories.filter(
      (category) =>
        keywords.some((keyword) =>
          category.name
            ?.toLowerCase()
            .includes(keyword)
        )
    );


    const finalCategories =
      matchedCategories.length > 0
        ? matchedCategories
        : allCategories.slice(0, 8);

    setRecommendedCategories(
      finalCategories.slice(0, 8)
    );
  } catch (error) {
    console.log(error);
  }
};




useEffect(() => {
  fetchRecommendedCategories();
}, []);







useEffect(() => {
  const recent =
    JSON.parse(
      localStorage.getItem("recentSearches")
    ) || [];

  setSearches(recent);

  if (recent.length) {
    fetchRecommendedProducts(recent);
  }
}, []);


useEffect(() => {
  fetchRecommendedProducts();
}, []);

const fetchRecommendedProducts = async () => {
  try {
    const searches =
      JSON.parse(
        localStorage.getItem("recentSearches")
      ) || [];

    if (!searches.length) return;

    const keywords = [
      ...new Set(
        searches.map((item) => item.keyword)
      ),
    ];

    const responses = await Promise.all(
      keywords.map(async (keyword) => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/search/${keyword}`
        );

        return res.json();
      })
    );

    const products = responses.flatMap(
      (response) =>
        response?.data?.products || []
    );

    const uniqueProducts = Array.from(
      new Map(
        products.map((product) => [
          product._id,
          product,
        ])
      ).values()
    );

    setRecommendedProducts(
      uniqueProducts.slice(0, 12)
    );
  } catch (error) {
    console.log(error);
  }
};


const handleSubmit2 = async () => {
  if (submitting) return;

  if (!product.trim()) {
    return toast.error(
      "Please enter a product/service name"
    );
  }

  setSubmitting(true);

  try {
    const formData = new FormData();

    formData.append("product", product);
    formData.append("requirement", requirement);

    if (image) {
      formData.append("image", image);
    }

    await axios.post(
      "/api/post-requirement",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success(
      "RFQ submitted successfully!"
    );

    setProduct("");
    setRequirement("");
    setImage(null);
    setPreview("");
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        "Failed to submit RFQ"
    );
  } finally {
    setSubmitting(false);
  }
};
  return (

    <>
      <div className="flex-1 mb-7">



  <div className="w-full px-4 md:px-8 py-4">
  <div className="w-full bg-[#f3f3f3] rounded-xl p-4">
    <div className="flex flex-col lg:flex-row gap-4">

      <div className="flex items-center justify-between w-full lg:min-w-[250px] lg:w-auto h-[50px] px-4 bg-white border border-gray-300 rounded-lg cursor-pointer">
        <div className="flex items-center gap-3 overflow-hidden">
          <MapPin size={18} className="text-gray-500 shrink-0" />
          <span className="text-gray-700 truncate">
            {loadingLocation ? "Detecting..." : selectedCity}
          </span>
        </div>

        <ChevronDown size={18} className="text-gray-500 shrink-0" />
      </div>

      {/* Search */}
      <div className="relative flex-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder="Enter product / service"
          className="w-full h-[50px] px-5 bg-white border border-gray-300 rounded-lg outline-none focus:border-gray-400"
        />

        {showResults && (
          <div className="absolute top-[55px] left-0 w-full bg-white border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">Searching...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((item, index) => (
                <Link
                  key={index}
                  href={`https://dir.inquirybazaar.com/search/${item.slug}`}
                  onClick={() => {
                    saveRecentSearch(item);
                    setShowResults(false);
                    setSearchQuery("");
                  }}
                  className="block px-4 py-3 border-b hover:bg-gray-50"
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    {item.type}
                  </div>
                </Link>
              ))
            ) : searchQuery.length > 1 ? (
              <div className="p-4 text-center text-gray-500">
                No results found
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                Start typing...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        <button
          className="h-[50px] px-6 bg-[#183B63] text-white rounded-lg font-medium hover:bg-[#00796B] w-full sm:w-auto"
          onClick={fetchSearchResults}
        >
          Search
        </button>

      
      </div>
    </div>
  </div>
</div>




<section className="mt-10 px-8">

 <div className="bg-white text-black mb-4">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div className="w-full">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs sm:text-sm font-medium">
        ✨ Personalized Picks
      </div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
        Products You May Like
      </h2>

   
    </div>
  </div>

  {searches?.length > 0 && (
    <div className="bg-white border border-gray-200 rounded-xl md:rounded-2xl p-4 md:p-5 mb-6 md:mb-8 shadow-sm mt-5">
      
      <div className="flex items-start sm:items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
          🕒
        </div>

        <div>
          <h3 className="font-semibold text-[#183B63] text-sm sm:text-base">
            Recent Searches
          </h3>

          <p className="text-xs text-gray-500">
            Based on your browsing activity
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        {searches.slice(0, 5).map((item) => (
          <button
            key={item.keyword}
            className="
              group
              px-3 sm:px-4
              py-2
              rounded-full
              bg-orange-50
              border border-orange-100
              text-[#ec771c]
              text-xs sm:text-sm
              font-medium
              transition-all
              duration-300
              max-w-full
            "
          >
            <span className="flex items-center gap-2 truncate">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )}
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
  {recommendedProducts.slice(0,4).map((product) => {
    const image =
      product.media?.[0]?.url || "/placeholder.png";

    return (
      <Link
         href={`https://dir.inquirybazaar.com/search/${product.slug}`}
        key={product._id}
        className="group"
      >
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full">

          {/* Image Section */}
          <div className="relative bg-[#fafafa] h-[230px] flex items-center justify-center border-b">
            
            {/* Price Ribbon */}
            <div className="absolute top-0 left-0 z-10">
              <span className="bg-[#2d2d2d] text-white px-4 py-2 text-sm font-semibold rounded-br-lg shadow">
                {product.price
                  ? `₹${product.price}`
                  : "Ask Price"}
              </span>
            </div>

            {/* Wishlist */}
            <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition">
              ♥
            </button>

            <img
              src={image}
              alt={product.name}
              className="h-[200px] md:max-h-[180px] max-w-[90%] object-contain group-hover:scale-105 transition duration-300"
            />
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-[#0f2940] text-xl line-clamp-2 min-h-[56px]">
              {product.name}
            </h3>

            <p className="mt-4 text-gray-700">
              {product.brandName || "Supplier"}
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Rajasthan, India
            </p>

            {/* GST */}
            <div className="flex items-center gap-2 mt-4">
              <span className="text-green-600 font-medium text-sm">
                ✓ GST Verified
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center mt-3">
              <span className="text-yellow-400 text-lg">
                ★★★★☆
              </span>

              <span className="ml-2 text-sm text-gray-500">
                (1)
              </span>
            </div>

            {/* CTA */}
            <button className="w-full mt-5 bg-[#ec771c] text-white font-medium py-3 rounded-lg transition">
              Get Best Price
            </button>
          </div>
        </div>
      </Link>
    );
  })}
</div>




</section>



<section className="mt-10 px-4">
  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

    {/* Categories Section */}
    <div className="xl:col-span-8 bg-white   rounded-3xl  ">
      {recommendedCategories.length > 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#183B63]">
              Categories You May Like
            </h2>

            <p className="text-gray-500 mt-2">
              Recommendations based on your recent searches and interests.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3  gap-2">
            {recommendedCategories.slice(0, 6).map((category) => (
              <Link
                key={category._id}
                href={`https://dir.inquirybazaar.com/search/${category.slug}`}
                target="_blank"
              >
                <div className="border rounded-2xl p-4 h-full flex flex-col">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-[120px] md:h-[150px] object-contain"
                  />

                  <h3 className="font-semibold text-[#183B63] my-4 line-clamp-2">
                    {category.name}
                  </h3>

                  <button
                    className="
                    mt-auto
                    bg-[#183B63]
                    text-white
                    h-11
                    rounded-xl
                    w-full
                    mt-5
                  "
                  >
                    Get Quotes
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>

 
   <div className="xl:col-span-4">
  <div className="bg-white border border-gray-200 rounded-3xl p-5  h-full">
    <h2 className="text-2xl font-bold text-[#183B63] mb-6">
      Post RFQ via Photo
    </h2>

    <label
      htmlFor="upload"
      className="
        border-2
        border-dashed
        border-gray-300
        rounded-2xl
        h-[250px]
        md:h-[300px]
        flex
        flex-col
        items-center
        justify-center
        cursor-pointer
        text-center
        px-6
      "
    >
      {preview ? (
        <img
          src={preview}
          alt=""
          className="w-full h-full object-cover rounded-2xl"
        />
      ) : (
        <>
          <svg
            width="50"
            height="50"
            fill="none"
            viewBox="0 0 24 24"
            className="text-gray-400"
          >
            <path
              d="M12 16V8m0 0l-3 3m3-3l3 3"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>

          <p className="text-lg md:text-xl font-semibold text-gray-600 mt-5">
            Drag & drop a product photo
          </p>

          <p className="text-gray-400 mt-2">
            or click to upload
          </p>

          <button
            type="button"
            className="
              mt-6
              px-8
              h-12
              bg-orange-600
              text-white
              rounded-xl
            "
          >
            Upload
          </button>
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



    <div className="mb-2 mt-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product / Service Name
      </label>

      <input
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        placeholder="e.g. Diesel Generator"
        className="
          w-full
          h-12
          px-4
          border
          border-gray-300
          rounded-xl
          outline-none
          focus:border-[#183B63]
        "
      />
    </div>

    {/* Requirement */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Requirement Details
      </label>

      <textarea
        value={requirement}
        onChange={(e) => setRequirement(e.target.value)}
        placeholder="Enter your requirement..."
        rows={4}
        className="
          w-full
          px-4
          py-3
          border
          border-gray-300
          rounded-xl
          outline-none
          resize-none
          focus:border-[#183B63]
        "
      />
    </div>

    {/* Submit */}
  <button
  onClick={handleSubmit2}
  disabled={submitting}
  className="
    w-full
    h-14
    rounded-2xl
    bg-[#183B63]
    text-white
    font-semibold
    text-lg
    shadow-lg
    hover:shadow-xl
    hover:scale-[1.02]
    transition-all
    duration-300
    disabled:opacity-70
    disabled:cursor-not-allowed
    flex
    items-center
    justify-center
    gap-3
  "
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
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>

      Submitting...
    </>
  ) : (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M22 2L11 13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M22 2L15 22L11 13L2 9L22 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>

      Submit Requirement
    </>
  )}
</button>
  </div>
</div>

  </div>
</section>


    </div>








    </>
  );
}