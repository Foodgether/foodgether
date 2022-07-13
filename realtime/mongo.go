package main

import (
	"context"
	"github.com/gookit/event"
	"github.com/mitchellh/mapstructure"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
)

var mongoClient *mongo.Client
var Database *mongo.Database

func InitMongo() *mongo.Client {
	uri := os.Getenv("DATABASE_URL")
	if uri == "" {
		uri = "localhost:27017"
	}
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}
	mongoClient = client
	databaseName := os.Getenv("DATABASE_NAME")
	if uri == "" {
		uri = "foodgether-dev"
	}
	log.Printf("Successfully init mongo")
	Database = mongoClient.Database(databaseName)
	return client
}

func WatchUserOrder() {
	collection := Database.Collection("UserOrder")
	userOrderStream, err := collection.Watch(context.TODO(), mongo.Pipeline{bson.D{
		{"$match", bson.D{{
			"$or", bson.A{
				bson.D{{"operationType", "insert"}},
				bson.D{{"operationType", "update"}},
			},
		}}},
	}}, options.ChangeStream().SetFullDocument(options.UpdateLookup))
	log.Printf("UserOrder Change Stream Ready")
	if err != nil {
		panic(err)
	}

	defer userOrderStream.Close(context.TODO())

	for userOrderStream.Next(context.TODO()) {
		log.Printf("New Event")
		var userOrder *UserOrderChange
		var data bson.M
		if err := userOrderStream.Decode(&data); err != nil {
			panic(err)
		}
		err := mapstructure.Decode(data, &userOrder)
		if err != nil {
			log.Printf(err.Error())
			continue
		}
		if userOrder.OperationType == "insert" {
			userOrder.FullDocument.Id = userOrder.DocumentKey["_id"]
		}
		if eventBus.HasListeners("UserOrder") {
			err, _ = eventBus.Fire("UserOrder", event.M{"userOrder": userOrder})
			log.Printf("EVENT FIRED")

			if err != nil {
				log.Printf(err.Error())
				continue
			}
		}
	}
}
