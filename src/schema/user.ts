import { isContainSpace } from "@/utils/methods";
import {
  InferInput,
  check,
  email,
  maxLength,
  minLength,
  object,
  pipe,
  string,
} from "valibot";

const CreateUserSchema = object({
  name: pipe(string(), minLength(1, "Please enter your name.")),
  email: pipe(
    string(),
    minLength(1, "Please enter your email."),
    check(isContainSpace, "Email cannot contain space."),
    email("Please enter a valid email.")
  ),
  contact: pipe(
    string(),
    minLength(1, "Please enter your contact number."),
    maxLength(10, "Please enter valid contact number.")
  ),
});

type CreateUserForm = InferInput<typeof CreateUserSchema>;
export { CreateUserSchema, type CreateUserForm };
