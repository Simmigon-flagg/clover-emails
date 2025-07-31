import { useMemo } from "react";

export default function useFilteredEmails(emails, { query, startDate, endDate, sortConfig }) {
    return useMemo(() => {
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
    }, [emails, query, startDate, endDate, sortConfig]);
}
