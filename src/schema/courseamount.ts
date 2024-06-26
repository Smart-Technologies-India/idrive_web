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

const CreateCourseAmountSchema = object({
  agent: pipe(string(), minLength(1, "Please select Agent.")),
  course: pipe(string(), minLength(1, "Please select Course.")),
  vehicle: pipe(string(), minLength(1, "Please select Vehicle.")),
  basefess: pipe(string(), minLength(1, "Please enter Base Fees.")),
  idrivecomm: pipe(string(), minLength(1, "Please enter Idrive Commission.")),
});

type CreateAmountForm = InferInput<typeof CreateCourseAmountSchema>;
export { CreateCourseAmountSchema, type CreateAmountForm };
