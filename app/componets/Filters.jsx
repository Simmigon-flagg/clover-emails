
const Filters = ({ query, setQuery, startDate, setStartDate, endDate, setEndDate }) => {
    return (
        <>
            <div className="flex items-center border border-gray-300  overflow-hidden shadow-sm mb-5">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="flex-grow px-4 py-2 text-gray-700 focus:outline-none" />
            </div>
            <div className="flex gap-4 items-center text-sm">
                <label className="text-gray-700">
                    Start Date:
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="ml-2 px-2 py-1 border border-gray-300 rounded" />
                </label>

                <label className="text-gray-700">
                    End Date:
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="ml-2 px-2 py-1 border border-gray-300 rounded" />
                </label>
            </div>
        </>
    );
};

export default Filters;
