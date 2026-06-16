"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
House,
User,
Package,
PhoneCall,
Settings,
X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";

const Stickyfooter = () => {
const [showRequirementModal, setShowRequirementModal] =
useState(false);

const [preview, setPreview] = useState(null);
const [product, setProduct] = useState("");
const [requirement, setRequirement] =
useState("");

const { user } = useSelector(
(state) => state.auth
);

const pathname = usePathname();

if (!user) return null;

const handleImage = (e) => {
const file = e.target.files?.[0];

```
if (file) {
  setPreview(URL.createObjectURL(file));
}
```

};

const handleSubmit = () => {
console.log({
product,
requirement,
image: preview,
});

```
// Add API call here

setShowRequirementModal(false);
setProduct("");
setRequirement("");
setPreview(null);
```

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
icon: PhoneCall,
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
<> <div className="md:hidden fixed bottom-0 left-0 right-0 z-50"> <div className="bg-white border-t rounded-t-3xl shadow-xl px-3 pt-2 pb-2"> <div className="grid grid-cols-5 items-end">
{menus.map((item) => {
const Icon = item.icon;


          const active = item.center
            ? false
            : pathname === item.href;

          if (item.center) {
            return (
              <button
                key={item.label}
                onClick={() =>
                  setShowRequirementModal(true)
                }
                className="flex flex-col items-center"
              >
                <div
                  className="
                    -mt-8
                    w-16
                    h-16
                    rounded-full
                    flex
                    items-center
                    justify-center
                    shadow-lg
                    border-4
                    border-white
                    bg-black
                    text-white
                  "
                >
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
                  active
                    ? "text-blue-600"
                    : "text-gray-500"
                }
              />

              <span
                className={`text-xs mt-1 ${
                  active
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {item.label}
              </span>

              <div
                className={`mt-1 h-1 w-1 rounded-full ${
                  active
                    ? "bg-blue-600"
                    : "bg-transparent"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  </div>

  {showRequirementModal && (
    <div
      className="fixed inset-0 bg-black/50 z-[9999] flex items-end justify-center"
      onClick={() =>
        setShowRequirementModal(false)
      }
    >
      <div
        className="
          bg-white
          w-full
          h-[85vh]
          rounded-t-3xl
          p-5
          overflow-y-auto
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">
            Post Requirement
          </h2>

          <button
            onClick={() =>
              setShowRequirementModal(false)
            }
          >
            <X size={24} />
          </button>
        </div>

        <label
          htmlFor="upload"
          className="
            border-2
            border-dashed
            border-gray-300
            rounded-2xl
            h-[220px]
            flex
            flex-col
            items-center
            justify-center
            cursor-pointer
            text-center
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

        <div className="mt-5">
          <label className="text-sm font-medium">
            Product / Service
          </label>

          <input
            value={product}
            onChange={(e) =>
              setProduct(e.target.value)
            }
            placeholder="Enter product name"
            className="
              mt-2
              w-full
              h-12
              px-4
              border
              rounded-xl
              outline-none
            "
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">
            Requirement Details
          </label>

          <textarea
            value={requirement}
            onChange={(e) =>
              setRequirement(e.target.value)
            }
            rows={4}
            placeholder="Enter requirement"
            className="
              mt-2
              w-full
              p-4
              border
              rounded-xl
              outline-none
            "
          />
        </div>

        <button
          onClick={handleSubmit}
          className="
            mt-5
            w-full
            h-12
            bg-[#19b6a4]
            text-white
            rounded-xl
            font-semibold
          "
        >
          Submit Requirement
        </button>
      </div>
    </div>
  )}
</>


);
};

export default Stickyfooter;
