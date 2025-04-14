import {
    AtSymbolIcon,
    ExclamationCircleIcon,
  } from "@heroicons/react/24/outline";
  import { ArrowRightIcon } from "@heroicons/react/20/solid";
  import { Button } from "./button";
  import { useActionState } from "react";
  import { useNavigate } from "react-router-dom";
  import { forgotpasswordSchema } from "../../validators/users";
  import { authService } from "../../services/auth";
  import { useNotification } from "@/hooks";
  
  export default function ForgotPasswordForm() {
    const navigate  = useNavigate();
    const iniatialState = { message: null, errors: {} };
    const notify = useNotification();
  
    const [state, formAction, isPending] = useActionState(
      async (prevState, formData) => {
        try {
          const { error, success, data } = forgotpasswordSchema.safeParse({
              email: formData.get("email"),
            
            });
            if (!success) {
              return {
                errors: error.flatten().fieldErrors,
                message: "Missing fields. Failed to login",
              };
            }
            const res = await authService.forgotPassword(data);
            if (res) {
              console.log(res)
              navigate("/auth/reset-password");
              notify("if your email is in our system you will receive reset code", "success");
            }
        } catch (error) {
          console.log(error)
          notify(error?.response.data.error, 'error');
        }
      },
      iniatialState
    );
  
    return (
      <form action={formAction} className="space-y-3">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className="font-lusitana mb-3 text-2xl">
            Forgot Password?
          </h1>
          <p>
            No worries, we'll send you reset instructions
          </p>
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
            
          </div>
          {/* <input type="hidden" name="redirectTo" value={callbackUrl} /> */}
          <Button className="mt-4 w-full" aria-disabled={isPending}>
            {isPending ? (
              "Processing..."
            ) : (
              <>
                Reset Password
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
  