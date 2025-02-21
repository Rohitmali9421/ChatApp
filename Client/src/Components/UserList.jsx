function UserList({ name, image, isOnline }) {
    return (
        <div className="flex items-center p-3 hover:bg-blue-50 cursor-pointer transition duration-200 ease-in-out rounded-lg border-b-2">

            <div className="relative">
                <img
                    src={image}
                    alt={name}
                    className="h-12 w-12 rounded-full object-cover shadow-md"
                />
                {isOnline && (
                    <span className="absolute bottom-0 right-0 bg-green-500 h-3 w-3 rounded-full border-2 border-white"></span>
                )}
            </div>


            <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-800">{name}</h3>
                <p
                    className={`text-sm ${isOnline ? "text-green-500 font-semibold" : "text-gray-500"
                        }`}
                >
                    {isOnline ? "Online" : "Offline"}
                </p>
            </div>
        </div>
    );
};

export default UserList;
