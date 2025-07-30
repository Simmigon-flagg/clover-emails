"use client";

import { useEffect, useState, useMemo } from "react";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

export default function Home() {
  const API_URL = `http://localhost:4000/emails`
  const [query, setQuery] = useState("");
  const [emails, setEmails] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw Error("Error Retriving data")
        const data = await response.json();
        setEmails(data);
        setFetchError(null)
      } catch (err) {
        console.log(err)
        setFetchError(err.message)
      }
    };

    fetchEmails();
  }, []);

  const handleToggle = async (id, email) => {
    const updatedEmail = { ...email, fav: !email.fav };

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEmail),
      });

      if (!response.ok) throw new Error("Failed to update Fav");

      const updated = await response.json();
      console.log("Updated email:", updated);

      setEmails((prev) =>
        prev.map((email) => (email.id === id ? { ...email, fav: updated.fav } : email))
      );
      setFetchError(null)
    } catch (err) {
      console.error("Toggle failed:", err);
      setFetchError(err.message)
    }
  };


  const filteredEmails = useMemo(() => {
    const q = query.toLowerCase();
    return emails.filter((email) =>
      email.title.toLowerCase().includes(q) || email.date.toLowerCase().includes(q)
    );
  }, [query, emails]);


  const paginatedEmails = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEmails.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEmails, currentPage]);


  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Search Input */}
      <form className="mb-4">
        <div className="flex items-center border border-gray-300  overflow-hidden shadow-sm">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="flex-grow px-4 py-2 text-gray-700 focus:outline-none"
          />
        </div>
      </form>
      {fetchError && <p className="text-red-600">{`Error: ${fetchError}`}</p>}
      {/* Filtered List */}
      {!fetchError && <ul className="space-y-2 text-black">
        {paginatedEmails.length > 0 ? (
          paginatedEmails.map((email) => (
            <li
              key={email.id}
              className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              <div>
                <p className="font-medium">{email.title}</p>
                <p className="text-sm text-gray-600">{new Date(email.date).toLocaleString()}</p>
              </div>
              <div className="ml-4">
                {email.fav ? (
                  <StarSolid onClick={() => handleToggle(email.id, email)} className="h-5 w-5 text-yellow-500" />
                ) : (
                  <StarOutline onClick={() => handleToggle(email.id, email)} className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No results found.</li>
        )}
      </ul>}
      <div className="flex justify-center gap-4 mt-4">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(filteredEmails.length / ITEMS_PER_PAGE)
                ? prev + 1
                : prev
            )
          }
          disabled={currentPage >= Math.ceil(filteredEmails.length / ITEMS_PER_PAGE)}
        >
          Next
        </button>
      </div>

    </div>
  );
}
