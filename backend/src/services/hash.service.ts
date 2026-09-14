import { createHash } from "crypto";

export const HashService = {
  generateHash(text: string): string {
    return createHash("sha256").update(text).digest("hex");
  },
};
