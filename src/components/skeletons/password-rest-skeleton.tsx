import { Card } from "../ui/card";

export function ResetPasswordFallback() {
    return (
        <Card className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-700/50 relative z-10 overflow-hidden">
            <div className="animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-6"></div>
                <div className="h-10 bg-gray-700 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-700 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-700 rounded w-1/2 mt-2"></div>
            </div>
        </Card>
    );
}