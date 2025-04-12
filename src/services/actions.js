import { loginFormSchema } from "../validators/users";
import { authService } from "./auth";

export async function authenticate(prevState, formData) {

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

  await authService.login({ email, password });
}