import {
    AtSymbolIcon,
    KeyIcon,
    ExclamationCircleIcon,
  } from "@heroicons/react/24/outline";
  import { ArrowRightIcon, CodeBracketIcon } from "@heroicons/react/20/solid";
  import { Button } from "./button";
  import { useActionState } from "react";
  import { useNavigate, useLocation, Link } from "react-router-dom";
  import { resetpasswordFormSchema } from "../../validators/users";
  import { authService } from "../../services/auth";
  import { useNotification } from "@/hooks";
  
  export default function ResetPasswordForm() {
    const navigate  = useNavigate();
    const location = useLocation();
    const iniatialState = { message: null, errors: {} };
    const notify = useNotification();
  
    const [state, formAction, isPending] = useActionState(
      async (prevState, formData) => {
        try {
          const { error, success, data } = resetpasswordFormSchema.safeParse({
              code: formData.get("code"),
              newPassword: formData.get("newPassword"),
              confirmNewPassword: formData.get("confirmNewPassword")
            });
            if (!success) {
              console.log(error)
              return {
                errors: error.flatten().fieldErrors,
                message: "Missing fields. Failed to login",
              };
            }
            const res = await authService.resetPassword(data);
            if (res) {
              navigate("/auth/login");
              notify("password reset sucessful", "success");
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
            Reset Password.
          </h1>
          <div className="w-full">
          <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="code"
              >
               Reset Code
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  id="code"
                  type="text"
                  name="code"
                  placeholder="Reset Code"
                  aria-describedby="code-error"
                />
                <CodeBracketIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="code-error" aria-live="polite" aria-atomic="true">
                {state?.errors.code &&
                  state.errors.code.map((error) => (
                    <p className="mt-2 text-xs text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="newPassword"
              >
               New Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password "
                  aria-describedby="newPassword-error"
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="newPassword-error" aria-live="polite" aria-atomic="true">
                {state?.errors.newPassword &&
                  state.errors.newPassword.map((error) => (
                    <p className="mt-2 text-xs text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="confirmNewPassword"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-gray-500"
                  id="confirmNewPassword"
                  type="password"
                  name="confirmNewPassword"
                  placeholder="confirm new password"
                  aria-describedby="confirmNewPassword-error"
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="confirmNewPassword-error" aria-live="polite" aria-atomic="true">
                {state?.errors.confirmNewPassword &&
                  state.errors.confirmNewPassword.map((error) => (
                    <p className="mt-2 text-xs text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>
         
          {/* <input type="hidden" name="redirectTo" value={callbackUrl} /> */}
          <Button className="mt-4 w-full" aria-disabled={isPending}>
            {isPending ? (
              "Processing..."
            ) : (
              <>
                Reset
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
  