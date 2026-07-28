import React, { useEffect, useState } from "react";
import {
    History,
    Search,
    Trash2,
    ArrowRight,
    Compass,
} from "lucide-react";
import Link from "next/link";

export default function RecentActivity() {
    const [searches, setSearches] = useState([]);

    useEffect(() => {
        const recent = JSON.parse(localStorage.getItem("recentSearches")) || [];
        setSearches(recent);
    }, []);

    const clearHistory = () => {
        localStorage.removeItem("recentSearches");
        setSearches([]);
    };

    if (searches.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <div className="flex flex-col items-center justify-center text-center py-6">
                    <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <History className="h-7 w-7 text-gray-400" />
                    </div>

                    <h2 className="text-lg font-semibold text-[#183B63]">
                        No Recent Searches
                    </h2>

                    <p className="text-sm text-gray-500 mt-2 max-w-sm">
                        Your recently viewed categories and searches will appear here, making
                        it easy to continue where you left off.
                    </p>
                    <div className="mt-5">
                        <Link
                            href="https://dir.inquirybazaar.com/industries"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#183B63] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0f2b49] transition"
                        >
                            <Compass size={16} />
                            Explore Categories
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-orange-100 flex items-center justify-center">
                        <History className="h-5 w-5 text-[#ec771c]" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-[#183B63]">
                            Recent Searches
                        </h2>
                        <p className="text-sm text-gray-500">
                            Continue where you left off
                        </p>
                    </div>
                </div>

                <button
                    onClick={clearHistory}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition"
                >
                    <Trash2 size={16} />
                    Clear
                </button>
            </div>

            {/* Search Pills */}
            <div className="flex flex-wrap gap-3">
                {searches.slice(0, 8).map((item) => (
                    <Link href={`https://dir.inquirybazaar.com/search/${item.keyword}`}
                        key={item.keyword}
                        className="group flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-[#183B63] transition-all duration-300 hover:border-[#ec771c] hover:bg-[#ec771c] hover:text-white hover:shadow-md"
                    >
                        <Search
                            size={15}
                            className="text-[#ec771c] group-hover:text-white"
                        />

                        <span className="max-w-[160px] truncate">{item.name}</span>

                        <ArrowRight
                            size={14}
                            className="opacity-0 -translate-x-1 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}