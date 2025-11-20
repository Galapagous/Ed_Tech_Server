import jwt from "jsonwebtoken";

interface ITokenService {
  generate: (payload: Object) => string | null;
  verify: (token: string) => Object | null;
}

class JwtTokenService implements ITokenService {
  constructor(private secret: string) {}
  generate(payload: object): string | null {
    const token = jwt.sign(payload, this.secret, { expiresIn: "2d" });
    return token;
  }
  verify(token: string): object | null {
    try {
      const result = jwt.verify(token, this.secret) as object;
      return result;
    } catch {
      return null;
    }
  }
}

export default JwtTokenService;
