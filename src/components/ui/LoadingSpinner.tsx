import React from "react";
import { Card } from "./card";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg" | "xl";
    color?: "blue" | "purple" | "green" | "red" | "gray";
    text?: string;
}

function LoadingSpinner({
    size = "md",
    color = "blue",
    text = "",
}: LoadingSpinnerProps) {
    const sizeClasses: Record<string, string> = {
        sm: "w-6 h-6 border-2",
        md: "w-12 h-12 border-3",
        lg: "w-16 h-16 border-4",
        xl: "w-24 h-24 border-4",
    };

    const colorClasses: Record<string, string> = {
        blue: "border-primary border-t-transparent",
        purple: "border-purple-500 border-t-transparent",
        green: "border-green-500 border-t-transparent",
        red: "border-red-500 border-t-transparent",
        gray: "border-gray-500 border-t-transparent",
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3 ">
            <div
                className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
            />
            {text && <p className="text-gray-600 text-sm">{text}</p>}
        </div>
    );
}

export default LoadingSpinner; // ✅ Default export
// // Full Page Loading Overlay
export function LoadingOverlay({ text = "Loading..." }) {
    return (
        <Card className="fixed  inset-0 bg-background bg-opacity-90 flex items-center justify-center z-50">
            <LoadingSpinner size="lg" color="blue" text={text} />
        </Card>
    );
}

// // Inline Loading (for buttons, cards, etc.)
// function InlineLoader({ size = "sm" }) {
//     return <LoadingSpinner size={size} color="blue" />;
// }

// // Demo Component
// export default function LoadingSpinnerDemo() {
//     const [showOverlay, setShowOverlay] = React.useState(false);

//     return (
//         <div className="p-8 max-w-4xl mx-auto">
//             <h1 className="text-3xl font-bold mb-8 text-gray-800">
//                 Loading Spinner Components
//             </h1>

//             {/* Different Sizes */}
//             <section className="mb-12">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-700">
//                     Different Sizes
//                 </h2>
//                 <div className="flex items-center gap-8 p-6 bg-gray-50 rounded-lg">
//                     <div className="text-center">
//                         <LoadingSpinner size="sm" color="blue" />
//                         <p className="mt-2 text-xs text-gray-600">Small</p>
//                     </div>
//                     <div className="text-center">
//                         <LoadingSpinner size="md" color="blue" />
//                         <p className="mt-2 text-xs text-gray-600">Medium</p>
//                     </div>
//                     <div className="text-center">
//                         <LoadingSpinner size="lg" color="blue" />
//                         <p className="mt-2 text-xs text-gray-600">Large</p>
//                     </div>
//                     <div className="text-center">
//                         <LoadingSpinner size="xl" color="blue" />
//                         <p className="mt-2 text-xs text-gray-600">
//                             Extra Large
//                         </p>
//                     </div>
//                 </div>
//             </section>

//             {/* Different Colors */}
//             <section className="mb-12">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-700">
//                     Different Colors
//                 </h2>
//                 <div className="flex items-center gap-8 p-6 bg-gray-50 rounded-lg">
//                     <LoadingSpinner size="md" color="blue" />
//                     <LoadingSpinner size="md" color="purple" />
//                     <LoadingSpinner size="md" color="green" />
//                     <LoadingSpinner size="md" color="red" />
//                     <LoadingSpinner size="md" color="gray" />
//                 </div>
//             </section>

//             {/* With Text */}
//             <section className="mb-12">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-700">
//                     With Text
//                 </h2>
//                 <div className="p-6 bg-gray-50 rounded-lg">
//                     <LoadingSpinner
//                         size="lg"
//                         color="purple"
//                         text="Loading your data..."
//                     />
//                 </div>
//             </section>

//             {/* Inline Usage */}
//             <section className="mb-12">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-700">
//                     Inline Usage (Buttons)
//                 </h2>
//                 <div className="flex gap-4">
//                     <button className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2">
//                         <InlineLoader size="sm" />
//                         <span>Loading...</span>
//                     </button>
//                     <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2">
//                         <InlineLoader size="sm" />
//                         <span>Processing</span>
//                     </button>
//                 </div>
//             </section>

//             {/* Full Page Overlay Demo */}
//             <section>
//                 <h2 className="text-xl font-semibold mb-4 text-gray-700">
//                     Full Page Overlay
//                 </h2>
//                 <button
//                     onClick={() => {
//                         setShowOverlay(true);
//                         setTimeout(() => setShowOverlay(false), 2000);
//                     }}
//                     className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
//                 >
//                     Show Loading Overlay (2s)
//                 </button>
//             </section>

//             {showOverlay && <LoadingOverlay text="Please wait..." />}

//             {/* Usage Code */}
//             <section className="mt-12 p-6 bg-gray-900 text-gray-100 rounded-lg">
//                 <h3 className="text-lg font-semibold mb-3">Usage Examples:</h3>
//                 <pre className="text-sm overflow-x-auto">
//                     {`// Basic spinner
// <LoadingSpinner size="md" color="blue" />

// // With text
// <LoadingSpinner size="lg" color="purple" text="Loading..." />

// // Full page overlay
// <LoadingOverlay text="Please wait..." />

// // In a button
// <button>
//   <InlineLoader size="sm" />
//   Loading...
// </button>`}
//                 </pre>
//             </section>
//         </div>
//     );
// }
