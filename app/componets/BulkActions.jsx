const BulkActions = ({ filteredEmails, selectedIds, handleToggle, clearSelection }) => {
    const selectedEmails = filteredEmails.filter(email => selectedIds.has(email.id));

    const setFavoriteForSelected = (favValue) => {
        selectedEmails.forEach(email => {
            if (email.fav !== favValue) {
                handleToggle(email.id, email, favValue);
            }
        });
    };

    if (selectedIds.size === 0) return null;

    return (
        <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded mb-4">
            <div>
                <span className="text-sm text-gray-700">
                    {selectedIds.size} selected
                </span>
            </div>
            <div className="flex gap-4">
                <button
                    onClick={() => setFavoriteForSelected(true)}
                    className="text-blue-600 hover:underline text-sm"
                >
                    Mark as Favorite
                </button>
                <button
                    onClick={() => setFavoriteForSelected(false)}
                    className="text-yellow-600 hover:underline text-sm"
                >
                    Unmark Favorite
                </button>
                <button
                    onClick={clearSelection}
                    className="text-red-600 hover:underline text-sm"
                >
                    Clear Selection
                </button>
            </div>
        </div>
    );
};

export default BulkActions;
