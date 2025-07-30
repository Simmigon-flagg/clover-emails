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
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(""); const [selectedIds, setSelectedIds] = useState(new Set());



  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw Error("Error Retriving data")
        const data = await response.json();
        setEmails(data);
        setFetchError(null)
      } catch (err) {
        setFetchError(err.message)
      }
    };

    fetchEmails();
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };


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

      if (!response.ok) throw new Error("Failed to update Favorite");

      const updated = await response.json();

      setEmails((prev) =>
        prev.map((email) => (email.id === id ? { ...email, fav: updated.fav } : email))
      );
      setFetchError(null)
    } catch (err) {

      setFetchError(err.message)
    }
  };

  const filteredEmails = useMemo(() => {
    const q = query.toLowerCase();

    return emails
      .filter((email) => {
        const titleMatch = email.title.toLowerCase().includes(q);
        const dateMatch = email.date.toLowerCase().includes(q);
        return titleMatch || dateMatch;
      })
      .filter((email) => {
        if (!startDate && !endDate) return true;

        const emailDate = new Date(email.date);
        const afterStart = startDate ? emailDate >= new Date(startDate) : true;
        const beforeEnd = endDate ? emailDate <= new Date(endDate) : true;

        return afterStart && beforeEnd;
      })
      .sort((a, b) => {
        if (!sortConfig?.key) return 0;

        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (sortConfig.key === "date") {
          return sortConfig.direction === "asc"
            ? new Date(aVal) - new Date(bVal)
            : new Date(bVal) - new Date(aVal);
        }

        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
  }, [query, emails, startDate, endDate, sortConfig]);

  const paginatedEmails = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEmails.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEmails, currentPage]);

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Search Input */}
      <form className="mb-4">
        <div className="flex items-center border border-gray-300  overflow-hidden shadow-sm mb-5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="flex-grow px-4 py-2 text-gray-700 focus:outline-none"
          />
        </div>

        <div className="flex gap-4 items-center text-sm">
          <label className="text-gray-700">
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="ml-2 px-2 py-1 border border-gray-300 rounded"
            />
          </label>

          <label className="text-gray-700">
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="ml-2 px-2 py-1 border border-gray-300 rounded"
            />
          </label>
        </div>

      </form>
      <div className="flex items-center justify-between mb-4 text-black">
        <label className="text-sm font-medium mr-2">Sort by:</label>
        <select
          value={`${sortConfig.key}-${sortConfig.direction}`}
          onChange={(e) => {
            const [key, direction] = e.target.value.split("-");
            setSortConfig({ key, direction });
          }}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="date-desc">Date ↓</option>
          <option value="date-asc">Date ↑</option>
          <option value="title-asc">Title A–Z</option>
          <option value="title-desc">Title Z–A</option>
        </select>
      </div>

      {fetchError && (
        <p className="text-red-600 mb-2">{`Error: ${fetchError}`}</p>
      )}
 
      {/* Filtered List */}
      <ul className="space-y-2 text-black">
        {paginatedEmails.length > 0 ? (
          paginatedEmails.map((email) => {
            const isSelected = selectedIds.has(email.id);

            return (
              <li
                key={email.id}
                className={`flex items-center justify-between px-4 py-2 rounded hover:bg-gray-200 ${isSelected ? "bg-blue-100" : "bg-gray-100"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(email.id)}
                    className="h-4 w-4"
                  />
                  <div>
                    <p className="font-medium">{email.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(email.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="ml-4">
                  {email.fav ? (
                    <StarSolid
                      onClick={() => handleToggle(email.id, email)}
                      className="h-5 w-5 text-yellow-500 cursor-pointer"
                    />
                  ) : (
                    <StarOutline
                      onClick={() => handleToggle(email.id, email)}
                      className="h-5 w-5 text-gray-400 cursor-pointer"
                    />
                  )}
                </div>
              </li>
            );
          })
        ) : (
          <li className="text-gray-500">No results found.</li>
        )}
      </ul>

      {selectedIds.size > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={async () => {
              for (const email of filteredEmails) {
                if (selectedIds.has(email.id) && !email.fav) {
                  await handleToggle(email.id, email);
                }
              }
              setSelectedIds(new Set()); // optional: clear selection after action
            }}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Add to Favorite
          </button>
        </div>
      )}


      {/* Pagination */}
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
