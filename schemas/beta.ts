import { z } from "zod";

export const BetaSignupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  firstName: z.string().min(2, { message: "Your first name is too short." }),
  lastName: z.string().min(2, { message: "Your last name is too short." }),
});
