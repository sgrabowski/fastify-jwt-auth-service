export const refreshSchema = {
  body: {
    type: "object",
    required: ["refreshToken"],
    properties: {
      refreshToken: { type: "string", minLength: 10 },
    },
    additionalProperties: false,
  },
};

export interface RefreshRequestBody {
  refreshToken: string;
}
