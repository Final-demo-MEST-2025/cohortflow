import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "./button";
import { useActionState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginFormSchema } from "../../validators/users";
import { authService } from "../../services/auth";
import { useNotification } from "@/hooks";

export default function LoginForm() {
  const navigate  = useNavigate();
  const location = useLocation();
  const iniatialState = { message: null, errors: {} };
  const notify = useNotification();

  const [state, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      try {
        const { error, success, data } = loginFormSchema.safeParse({
            email: formData.get("email"),
            password: formData.get("password"),
          });
          if (!success) {
            return {
              errors: error.flatten().fieldErrors,
              message: "Missing fields. Failed to login",
            };
          }
          const { email, password } = data;
          const res = await authService.login({ email, password });
          if (res) {
            const from = location.state?.from.pathname || '/dashboard';
            navigate(from, { replace: true });
            notify("Login successfully", "success");
          }
      } catch (error) {
        notify(error?.response.data.error, 'error');
      }
    },
    iniatialState
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className="font-lusitana mb-3 text-2xl">
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                aria-describedby="email-error"
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="email-error" aria-live="polite" aria-atomic="true">
              {state?.errors.email &&
                state.errors.email.map((error) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                aria-describedby="password-error"
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="password-error" aria-live="polite" aria-atomic="true">
              {state?.errors.password &&
                state.errors.password.map((error) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <div className="mt-2 md:mt-4 text-brand-600 text-sm">
          <Link
            to='/auth/forgot-password'
          >
          forgot password?
          </Link>
        </div>
        {/* <input type="hidden" name="redirectTo" value={callbackUrl} /> */}
        <Button className="mt-4 w-full" aria-disabled={isPending}>
          {isPending ? (
            "Processing..."
          ) : (
            <>
              Log in
              <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
            </>
          )}
        </Button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {state?.message && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="mt-2 text-sm text-red-500" key={state.message}>
                {state.message}
              </p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
