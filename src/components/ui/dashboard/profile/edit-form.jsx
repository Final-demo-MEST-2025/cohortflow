import { useActionState } from "react";
import { useOutletContext } from "react-router-dom";
import { z } from "zod";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilIcon,
  LinkIcon,
  CodeBracketIcon,
  BriefcaseIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../../button";

const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().optional(),
  bio: z.string(),
  links: z.object({
    gitHub: z.string(), //.url("Invalid URL").or(z.literal("")),
    linkedIn: z.string(), //.url("Invalid URL").or(z.literal("")),
    portfolio: z.string(),
  }).optional(),
});

export default function ProfileEditForm({ onUpdate }) {
  const data = useOutletContext();
  const user = { ...data.profile.data, ...data.user.data };
  
  const removeEmptyFields = (obj) => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === '')
      ) {
        return acc
      }

      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleaned = removeEmptyFields(value);
        if (Object.keys(cleaned).length > 0) {
          acc[key] = cleaned;
        }
        return acc;
      }
      acc[key] = value;
      return acc;
    }, {})
  }


  const [state, formAction] = useActionState(

    async (prevState, formData) => {
      try {
        const validatedData = ProfileSchema.safeParse({
          name: formData.get("name") || "",
          phoneNumber: formData.get("phone") || "",
          bio: formData.get("bio"),
          links: {
            gitHub: formData.get("gitHub") || "",
            linkedIn: formData.get("linkedIn") || "",
            portfolio: formData.get("portfolio") || "",
          },
        });

        if (!validatedData.success) {
          console.log(validatedData.error)
          return {
            errors: validatedData.error.flatten().fieldErrors,
            message: "Please fix the errors below",
          };
        }
        
        const cleaned = removeEmptyFields(validatedData.data);

        onUpdate(cleaned);

        // return { success: true, message: "Profile updated successfully!" };
      } catch (error) {
        console.log(error);
        // return { message: "Failed to update profile", success: false };
      }
    },
    { errors: {}, message: "" }
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className="mb-3 text-2xl font-medium">Edit Your Profile</h1>

        <div className="w-full space-y-4">
          {/* Name Field */}
          <div>
            <label
              className="mb-3 block text-xs font-medium text-gray-900"
              htmlFor="name"
            >
              Full Name
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                id="name"
                type="text"
                name="name"
                defaultValue={user.name}
                placeholder="Enter your full name"
                aria-describedby="name-error"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.name && (
              <div id="name-error" className="mt-2 flex items-start">
                <ExclamationCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                <p className="text-xs text-red-500">{state.errors.name[0]}</p>
              </div>
            )}
          </div>

          {/* Email Field (read-only) */}
          <div>
            <label
              className="mb-3 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm bg-gray-100 cursor-not-allowed"
                id="email"
                type="email"
                name="email"
                defaultValue={user.email}
                readOnly
                aria-describedby="email-error"
              />
              <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label
              className="mb-3 block text-xs font-medium text-gray-900"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                id="phone"
                type="tel"
                name="phone"
                defaultValue={user.phoneNumber || ""}
                placeholder="Enter your phone number"
                aria-describedby="phone-error"
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {/* {state?.errors?.phone && (
              <div id="name-error" className="mt-2 flex items-start">
                <ExclamationCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                <p className="text-xs text-red-500">{state.errors.phone[0]}</p>
              </div>
            )} */}
          </div>

          {/* Bio Field */}
          <div>
            <label
              className="mb-3 block text-xs font-medium text-gray-900"
              htmlFor="bio"
            >
              Bio
            </label>
            <div className="relative">
              <textarea
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[100px]"
                id="bio"
                name="bio"
                defaultValue={user.bio || ""}
                placeholder="Tell us about yourself"
                aria-describedby="bio-error"
              />
              <PencilIcon className="pointer-events-none absolute left-3 top-3 h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          {/* Social Media Section */}
          <div className="pt-2">
            <h3 className="mb-3 block text-xs font-medium text-gray-900">
              Social Media Links
            </h3>

            {/* GitHub */}
            <div className="mb-4">
              <label
                className="mb-3 block text-xs font-medium text-gray-900"
                htmlFor="github"
              >
                GitHub
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  id="github"
                  type="text"
                  name="gitHub"
                  defaultValue={
                    user.links?.gitHub || ""
                  }
                  placeholder="username"
                  aria-describedby="github-error"
                />
                <CodeBracketIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              {/* {state?.errors?.links?.github && (
                <div id="github-error" className="mt-2 flex items-start">
                  <ExclamationCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                  <p className="text-xs text-red-500">
                    {state.errors.links.github[0]}
                  </p>
                </div>
              )} */}
            </div>

            {/* LinkedIn */}
            <div>
              <label
                className="mb-3 block text-xs font-medium text-gray-900"
                htmlFor="linkedin"
              >
                LinkedIn
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  id="linkedin"
                  type="text"
                  name="linkedIn"
                  defaultValue={
                    user.links?.linkedIn || ""
                  }
                  placeholder="username"
                  aria-describedby="linkedin-error"
                />
                <BriefcaseIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              {/* {state?.errors?.links?.linkedin && (
                <div id="linkedin-error" className="mt-2 flex items-start">
                  <ExclamationCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                  <p className="text-xs text-red-500">
                    {state.errors.links.linkedin[0]}
                  </p>
                </div>
              )} */}
            </div>
          </div>

          {/* Portfolio */}
          <div>
            <label
              className="mb-3 block text-xs font-medium text-gray-900"
              htmlFor="portfolio"
            >
              Portfolio
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                id="portfolio"
                type="text"
                name="portfolio"
                defaultValue={user.links?.portfolio || ""}
                placeholder="link"
                aria-describedby="linkedin-error"
              />
              <BriefcaseIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.links?.portfolio && (
              <div id="portfolio-error" className="mt-2 flex items-start">
                <ExclamationCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                <p className="text-xs text-red-500">
                  {state.errors.links.porfolio[0]}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            // onClick={onCancel}
            className="flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Cancel
          </button>
          <Button
          
          >
            Save Changes
            <CheckIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Form-level error message */}
        {/* {state?.message && (
          <div className="mt-4 flex items-start">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-1" />
            <p className="text-sm text-red-500">{state.message}</p>
          </div>
        )} */}
      </div>
    </form>
  );
}
