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

const CreateVehicleSchema = object({
  name: pipe(string(), minLength(1, "Please enter Vehicle name.")),
  number: pipe(string(), minLength(1, "Please select vehicle number name.")),
  category: pipe(string(), minLength(1, "Please enter Vehicle category.")),
  agent: pipe(string(), minLength(1, "Please select Agent.")),
  year: pipe(string(), minLength(1, "Please ender year.")),
  ac: pipe(string(), minLength(1, "Please select AC or Non AC.")),
  timeslot: pipe(string(), minLength(1, "Please select Time Solt.")),
  transmission: pipe(
    string(),
    minLength(1, "Please select vehicle transmission.")
  ),
});

type CreateVehicleForm = InferInput<typeof CreateVehicleSchema>;
export { CreateVehicleSchema, type CreateVehicleForm };
