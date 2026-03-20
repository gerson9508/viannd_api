export interface JwtPayload {
   userId: number;
   iat: number;
   exp: number;
}

export interface AuthUser {
   userId: number;
}