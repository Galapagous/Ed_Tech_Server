// src/presentation/service/token.ts (or tokenInstance.ts)

import JwtTokenService from "./token";

export const jwtTokenService = new JwtTokenService(
  process.env.JWT_SECRET || "iamwhatiam"
);

export default JwtTokenService;
