package main

import "go.mongodb.org/mongo-driver/bson/primitive"

type UserDocument struct {
	Id          primitive.ObjectID `bson:"_id"`
	PhoneNumber string             `bson:"phoneNumber"`
	Name        string             `bson:"name"`
}

type UserInRedis struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	PhoneNumber string `json:"phoneNumber"`
}

type OrderDocument struct {
	Id            primitive.ObjectID `bson:"_id"`
	InviteId      string             `bson:"inviteId"`
	CreatedUserId primitive.ObjectID `bson:"createdUserId"`
}

type UserOrderChange struct {
	OperationType string                        `bson:"operationType"`
	DocumentKey   map[string]primitive.ObjectID `bson:"documentKey"`
	FullDocument  FullUserOrderDocument         `bson:"fullDocument,omitempty"`
}

type FullUserOrderDocument struct {
	Id      primitive.ObjectID `bson:"_id"`
	Detail  []UserOrderDetail  `bson:"detail"`
	OrderId primitive.ObjectID `bson:"orderId"`
	UserId  primitive.ObjectID `bson:"userId"`
}

type UserOrderDetail struct {
	DishId     int `bson:"dishId" json:"dishId"`
	DishTypeId int `bson:"dishTypeId" json:"dishTypeId"`
	Quantity   int `bson:"quantity" json:"quantity"`
}
