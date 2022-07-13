package main

import (
	"context"
	"fmt"
	"github.com/go-redis/redis/v8"
	"log"
	"os"
	"strconv"
	"time"
)

var RedisClient *redis.Client

func InitRedis() {
	redisStringPort := os.Getenv("FOODGETHER_REDIS_PORT")
	if redisStringPort == "" {
		redisStringPort = "6379"
	}
	redisPort, _ := strconv.Atoi(redisStringPort)

	redisHost := os.Getenv("FOODGETHER_REDIS_HOST")
	if redisHost == "" {
		redisHost = "localhost"
	}

	redisPassword := os.Getenv("FOODGETHER_REDIS_PASSWORD")
	if redisPassword == "" {
		redisPassword = "12345"
	}

	RedisClient = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", redisHost, redisPort),
		Password: redisPassword, // no password set
		DB:       0,             // use default DB
	})

	log.Printf("Successfully init redis")
}

func SetNewValue(key, value string, expiresIn time.Duration) (result string, err error) {
	return RedisClient.Set(context.TODO(), key, value, expiresIn).Result()
}

func GetValue(key string) (result string, err error) {
	result, err = RedisClient.Get(context.TODO(), key).Result()
	if err != nil {
		log.Printf(err.Error())
	}
	return result, err
}
