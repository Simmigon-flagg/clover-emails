"use client";

import { useEffect, useState } from "react";
import Filters from "./componets/Filters";
import SortDropdown from "./componets/SortDropdown";
import EmailList from "./componets/EmailList";
import BulkActions from "./componets/BulkActions";
import Pagination from "./componets/Pagination";
import useEmails from "./hook/useEmails";
import useFilteredEmails from "./hook/useFilteredEmails";
import paginate from "./utils/paginate";

export default function Home() {
  const ITEMS_PER_PAGE = 5;

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());

  const { emails, fetchError, updateEmail } = useEmails();

  useEffect(() => {
    setCurrentPage(1);
  }, [query, startDate, endDate]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleToggle = (id, email) => {
    updateEmail(id, { ...email, fav: !email.fav });
  };

  const filteredEmails = useFilteredEmails(emails, { query, startDate, endDate, sortConfig });
  const paginatedEmails = paginate(filteredEmails, currentPage, ITEMS_PER_PAGE);

  return (
    <div className="max-w-xl w-full mx-auto px-4 sm:px-6 py-4">

      <form className="mb-4">
        <Filters
          query={query}
          setQuery={setQuery}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      </form>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 text-black gap-2 sm:gap-0">
        <label className="text-sm font-medium">Sort by:</label>
        <SortDropdown sortConfig={sortConfig} setSortConfig={setSortConfig} />
      </div>

      {fetchError && (
        <p className="text-red-600 mb-2 text-sm">{`Error: ${fetchError}`}</p>
      )}

      <EmailList
        emails={paginatedEmails}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        handleToggle={handleToggle}
      />

      <BulkActions
        filteredEmails={filteredEmails}
        selectedIds={selectedIds}
        handleToggle={handleToggle}
        clearSelection={() => setSelectedIds(new Set())}
      />

      <Pagination
        currentPage={currentPage}
        totalItems={filteredEmails.length}
        itemsPerPage={ITEMS_PER_PAGE}
        setCurrentPage={setCurrentPage}
      />
    </div>

  );
}
