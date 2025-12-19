import React from "react";

const Loading = () => {
    return (
        <div className="min-h-[60vh] flex justify-center items-center">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </div>
    );
};

export default Loading;
