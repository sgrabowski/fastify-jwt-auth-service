export const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string" },
      password: { type: "string" },
    },
    additionalProperties: false,
  },
};

export interface LoginRequestBody {
  email: string;
  password: string;
}
