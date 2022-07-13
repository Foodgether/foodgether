package main

import (
	"fmt"
	"github.com/golang-jwt/jwt/v4"
	"github.com/mitchellh/mapstructure"
	"log"
)

type Claims struct {
	Data TokenData `json:"data"`
	jwt.Claims
}

type TokenData struct {
	PhoneNumber string `json:"phoneNumber"`
}

func VerifyToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("error while parsing")
		}
		return JwtKey, nil
	})
	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			log.Printf("Invalid Signature")
			return nil, err
		}
		log.Printf(err.Error())
		return nil, err
	}
	if !token.Valid {
		log.Printf("Invalid Token")
		return nil, err
	}
	return token, err
}

func ParseClaim(token *jwt.Token) (*Claims, error) {
	var tokenData Claims
	if _, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		err := mapstructure.Decode(token.Claims, &tokenData)
		if err != nil {
			log.Printf(err.Error())
			return nil, err
		}
	}
	return &tokenData, nil
}
