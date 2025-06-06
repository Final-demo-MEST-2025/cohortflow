import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function UserProfile({ user }) {
  const getRoleColor = () => {
    switch (user.role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "instructor":
        return "bg-purple-100 text-purple-800";
      case "learner":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white w-full">
        <div className="px-6 pb-6 -mt-16 relative">
          <Link to="/dashboard/users/me/edit">
            <button
              // onClick={onEdit}
              className="absolute top-6 right-6 p-2 rounded-full bg-white shadow-md text-brand-600 hover:bg-brand-50 transition-colors"
              aria-label="Edit profile"
              title="Update profile"
            >
              <span className="sr-only">Edit profile</span>
              <PencilSquareIcon className="h-5 w-5" />
            </button>
          </Link>

          {/* Avatar */}
          <div className="flex">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-32 w-32 rounded-full border-4 border-white shadow-md"
                />
              ) : (
                <div className="flex items-center justify-center h-32 w-32 rounded-full border-4 border-white bg-brand-100 shadow-md text-4xl font-bold text-brand-800">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor()}`}
              >
                {user.role}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Info */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 border-teal-100">
                  Contact Information
                </h2>
                <div className="space-y-2">
                  <p className="flex items-center text-gray-600">
                    <svg
                      className="h-5 w-5 mr-2 text-brand-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {user.email}
                  </p>
                  {user.phone && (
                    <p className="flex items-center text-gray-600">
                      <svg
                        className="h-5 w-5 mr-2 text-brand-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {user.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 border-teal-100">
                  About
                </h2>
                <p className="text-gray-600">{user.bio || "No bio provided"}</p>
              </div>
            </div>

            {/* Social Links */}
            {user.socials && (
              <div className="pt-4">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 border-teal-100">
                  Social Media
                </h2>
                <div className="flex space-x-4 mt-3">
                  {user.socials.twitter && (
                    <a
                      href={user.socials.twitter}
                      className="text-brand-600 hover:text-brand-800"
                    >
                      <span className="sr-only">Twitter</span>
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  )}
                  {user.socials.linkedin && (
                    <a
                      href={user.socials.linkedin}
                      className="text-brand-600 hover:text-brand-800"
                    >
                      <span className="sr-only">LinkedIn</span>
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  )}
                  {user?.socials.github && (
                    <a
                      href={user.socials.github}
                      className="text-brand-600 hover:text-brand-800"
                    >
                      <span className="sr-only">GitHub</span>
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
