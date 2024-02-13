import { Document } from "mongoose";

export interface UserType extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    createJWT: () => string;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
  }