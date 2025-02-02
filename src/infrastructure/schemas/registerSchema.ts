export const registerSchema = {
  body: {
    type: "object",
    required: ["email", "username", "password"],
    properties: {
      email: { type: "string", format: "email" },
      username: { type: "string", minLength: 3 },
      password: { type: "string", minLength: 8 },
    },
    additionalProperties: false,
  },
};

export interface RegisterRequestBody {
  email: string;
  username: string;
  password: string;
}
