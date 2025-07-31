import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

const EmailList = ({ emails, selectedIds, toggleSelect, handleToggle }) => {
    return (
        <ul className="space-y-2 text-black">
            {emails.length > 0 ? (
                emails.map((email) => {
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
    );
};

export default EmailList;
