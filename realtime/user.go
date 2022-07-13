package main

import (
	"context"
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
)

func GetUserFromPhoneNumber(phoneNumber string) (*UserDocument, error) {
	userString, err := GetValue(fmt.Sprintf("user-%s", phoneNumber))
	if err == nil {
		log.Printf("Found in redis")
		var user *UserInRedis
		err := json.Unmarshal([]byte(userString), &user)
		if err != nil {
			return nil, err
		}
		id, err := primitive.ObjectIDFromHex(user.Id)
		if err != nil {
			return nil, err
		}
		return &UserDocument{Id: id, PhoneNumber: user.PhoneNumber, Name: user.Name}, nil
	}
	log.Printf("Fallback to database")
	collection := Database.Collection("User")
	filter := bson.D{{"phoneNumber", phoneNumber}}
	var user UserDocument
	if err := collection.FindOne(context.TODO(), filter).Decode(&user); err != nil {
		log.Printf(err.Error())
		return nil, err
	}
	return &user, nil
}

func IsOwnerOfRunningOrder(userId primitive.ObjectID, inviteId string) (*OrderDocument, error) {
	collection := Database.Collection("Order")
	findOptions := options.FindOne()
	findOptions.SetSort(bson.D{{"createdAt", -1}})
	filter := bson.D{{"createdUserId", userId}, {"status", "INPROGRESS"}, {"inviteId", inviteId}}
	var order OrderDocument
	if err := collection.FindOne(context.TODO(), filter).Decode(&order); err != nil {
		log.Printf(err.Error())
		return nil, err
	}
	return &order, nil
}

func GetUserFromId(id primitive.ObjectID) (*UserDocument, error) {
	log.Printf("%v", id)
	collection := Database.Collection("User")
	filter := bson.D{{"_id", id}}
	var user UserDocument
	if err := collection.FindOne(context.TODO(), filter).Decode(&user); err != nil {
		log.Printf(err.Error())
		return nil, err
	}
	return &user, nil
}
