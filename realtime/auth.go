package main

func Authenticate(tokenString string) *Claims {
	token, err := VerifyToken(tokenString)

	if err != nil {
		return nil
	}

	var claims *Claims
	claims, err = ParseClaim(token)

	if err != nil {
		return nil
	}
	return claims
}
