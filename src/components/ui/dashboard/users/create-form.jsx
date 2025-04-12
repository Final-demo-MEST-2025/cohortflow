import { useActionState, useEffect, useRef, useState } from "react";
import { useNavigate  } from "react-router-dom";
import {
  UserCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  XMarkIcon,
  ArrowPathIcon,
  EyeSlashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { registerFormSchema } from "@/validators/users";


export function RegisterForm({ onSuccess, onSubmitAndAdd }) {
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [state, formAction, isPending] = useActionState(
    async (prevState , formData) => {
      try {
        const validatedFields = registerFormSchema.safeParse({
          name: formData.get("name"),
          role: formData.get("role"),
          email: formData.get("email"),
          password: formData.get("password"),
          confirmPassword: formData.get("confirmPassword"),
        });

        if (!validatedFields.success) {
          return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please fix the errors to submit",
            success: false,
            formValues: Object.fromEntries(formData.entries()) // preserve all inputs
          };
        }

        const action = formData.get("action");
        const message = "User registered successfully!";
        action === "submitAndAdd"
          ? onSubmitAndAdd(validatedFields.data)
          : onSuccess(validatedFields.data, message);

        // Here you would typically call your API to register the user

        // const response = await registerUser(validatedFields.data);
        return {
          message: "User registered successfully!",
          success: true,
          action: action === 'submitAndAdd' ? 'addAnother' : 'submit'
        };
      } catch (error) {
        console.log(error)
        return {
          message: "An error occurred while registering the user",
          success: false,
          formValues: Object.fromEntries(formData.entries()), // preserve on error
        };
      }
    }, { errors: {}, message: "", success: false });

    useEffect(() => {
      // if (state.success) {
      //   if (state.action === 'addAnother' && onSubmitAndAdd) {
      //     onSubmitAndAdd()
      //   } else if (onSuccess) {
      //     onSuccess();
      //   }
      // } else
      if (state?.success === false && state.formValues && formRef.current) {
        Object.entries(state.formValues).forEach(([name, value]) => {
          const input = formRef.current?.elements.namedItem(name);
          if (input && 'value' in input) {
            input.value = value;
          }
        })
      }
    }, [state]);

    const close = () => {
      navigate(-1);
    }

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Full Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter full name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-gray-500"
              aria-describedby="name-error"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Role Field */}
        <div className="mb-4">
          <label htmlFor="role" className="mb-2 block text-sm font-medium">
            Role
          </label>
          <div className="relative">
            <select
              id="role"
              name="role"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="role-error"
            >
              <option value="" disabled>
                Select a role
              </option>
              <option value="admin">Admin</option>
              <option value="instructor">Instructor</option>
              <option value="learner">Learner</option>
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="role-error" aria-live="polite" aria-atomic="true">
            {state.errors?.role &&
              state.errors.role.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-gray-500"
              aria-describedby="email-error"
            />
            <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-gray-500"
              aria-describedby="password-error"
            />
            <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <div id="password-error" aria-live="polite" aria-atomic="true">
            {state.errors?.password &&
              state.errors.password.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 6 characters with 1 uppercase, 1
            lowercase, 1 number, and 1 special character.
          </p>
        </div>

        {/* Confirm Password Field */}
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-gray-500"
              aria-describedby="confirmPassword-error"
            />
            <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <div id="confirmPassword-error" aria-live="polite" aria-atomic="true">
            {state.errors?.confirmPassword &&
              state.errors.confirmPassword.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Form-wide error message */}
        {state.message && !state.success && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-600">{state.message}</p>
          </div>
        )}

        {/* Success message */}
        {state.success && state.action === "addAnother" && (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-600">{state.message}</p>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={close}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 cursor-pointer"
        >
          <XMarkIcon className="h-5 w-5 mr-2" />
          Cancel
        </button>

        <button
          type="submit"
          name="action"
          value="submit"
          className={clsx(
            isPending && "cursor-progress",
            "flex h-10 items-center rounded-lg bg-brand-400 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 cursor-pointer"
          )}
          disabled={isPending}
        >
          Submit and Exit
        </button>

        <button
          type="submit"
          name="action"
          value="submitAndAdd"
          className={clsx(
            isPending && "cursor-progress",
            "flex h-10 items-center cursor-pointer rounded-lg bg-brand-600/100 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-500"
          )}
          disabled={isPending}
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          Submit and Add Another
        </button>
      </div>
    </form>
  );
}
