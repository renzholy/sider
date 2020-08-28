package main

import (
	"context"
	"fmt"

	"github.com/go-redis/redis/v8"
)

var ctx = context.Background()

func main() {

	opt, err := redis.ParseURL("redis://localhost:6379/1")
	if err != nil {
		panic(err)
	}
	rdb := redis.NewClient(opt)

	rdb.Do(ctx, "set", "a", "b").Result()
	a, err := rdb.Do(ctx, "scan", "0").Result()
	if err != nil {
		panic(err)
	}

	fmt.Println(a)
}
