import Link from "next/link";

const ErrorPage = () => {
    return (
        <div className="flex items-center flex-col justify-center lg:flex-row py-28 px-6 md:px-24 md:py-20 lg:py-32 gap-16 lg:gap-28 relative h-screen">
            <div className="w-full lg:max-w-2xl text-center">
                <h1 className="text-6xl font-black text-indigo-400">404!</h1>
                <h1 className="py-4 text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white">
                    Looks like you&apos;ve found the doorway to the great nothing
                </h1>
                <p className="text-base text-gray-800 dark:text-white">
                    The content you’re looking for doesn’t exist. Either it was removed, or you mistyped the link.
                </p>
                <p className="py-2 text-base text-gray-800 dark:text-white">Sorry about that! Please visit our hompage to get where you need to go.</p>
                <Link href="/dashboard">
                    <button className="w-full lg:w-auto my-4 rounded-md px-1 sm:px-16 py-5 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50">
                        Go back to Homepage
                    </button>
                </Link>
            </div>
        </div>
    );
};
export default ErrorPage;
