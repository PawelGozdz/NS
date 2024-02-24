export type JwtPayload = {
	aud: string[]; // audience
	client_id: string;
	exp: number; // expiration time in ms
	ext: unknown; // ?
	iat: number; // issued at
	iss: string; // issuer
	jti: string; // jwt id
	nbf: number; // not before
	scp: string[]; // scopes
	sub: string; // subject
	id: string; // user id
};
