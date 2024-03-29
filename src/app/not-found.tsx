import Link from "next/link";

const ErrorPage = () => {
    return (
        <div className="relative flex h-screen flex-col items-center justify-center gap-16 px-6 py-28 md:px-24 md:py-20 lg:flex-row lg:gap-28 lg:py-32">
            <div className="w-full text-center lg:max-w-2xl">
                <h1 className="text-6xl font-black text-indigo-400">404!</h1>
                <h1 className="py-4 text-3xl font-extrabold text-gray-800 dark:text-white lg:text-4xl">
                    Looks like you&apos;ve found the doorway to the great nothing
                </h1>
                <p className="text-base text-gray-800 dark:text-white">
                    The content you’re looking for doesn’t exist. Either it was removed, or you mistyped the link.
                </p>
                <p className="py-2 text-base text-gray-800 dark:text-white">Sorry about that! Please visit our hompage to get where you need to go.</p>
                <Link href="/dashboard">
                    <button className="my-4 w-full rounded-md bg-indigo-600 px-1 py-5 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50 sm:px-16 lg:w-auto">
                        Go back to Homepage
                    </button>
                </Link>
            </div>
        </div>
    );
};
export default ErrorPage;
