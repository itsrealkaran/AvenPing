import { MousePointer2 } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

const Pointer = (props: { name: string; color?: "red" | "blue" }) => {
    const { name, color } = props;

    return (
        <div>
            <MousePointer2 size={25} className="mb-1 text-gray-700"/>
            <p
                className={twMerge(
                    "ml-5 inline-flex rounded-full font-bold text-sm bg-cyan-500 text-white px-2 rounded-tl-none",
                    color === "red" && "bg-red-500"
                )}
            >
                {name}
            </p>
        </div>
    );
};

export default Pointer;