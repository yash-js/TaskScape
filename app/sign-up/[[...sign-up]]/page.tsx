import { Suspense } from "react";
import { Loader2, UserPlus, Shield } from "lucide-react";
import { SignUp } from "@clerk/nextjs";

function SignUpSkeleton() {
    return (
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
                {/* Header skeleton */}
                <div className="text-center space-y-2">
                    <div className="h-8 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
                </div>
                
                {/* Form skeleton */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
                
                {/* Divider skeleton */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                </div>
                
                {/* Social buttons skeleton */}
                <div className="space-y-3">
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}

function SignUpLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-2">
                    <UserPlus className="h-6 w-6 text-blue-600" />
                    <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm text-gray-600">Loading sign-up...</p>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md">
                <Suspense fallback={<SignUpLoading />}>
                    <SignUp 
                        appearance={{
                            elements: {
                                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm normal-case transition-colors",
                                card: "shadow-lg border-0",
                                headerTitle: "text-2xl font-bold text-gray-900",
                                headerSubtitle: "text-gray-600",
                                socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50 transition-colors",
                                formFieldInput: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                                footerActionLink: "text-blue-600 hover:text-blue-700",
                            }
                        }}
                        signInUrl="/sign-in"
                        afterSignUpUrl="/select-org"
                    />
                </Suspense>
            </div>
        </div>
    );
}
