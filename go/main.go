package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/NYTimes/gziphandler"
	"github.com/go-redis/redis/v8"
	"github.com/markbates/pkger"
)

var (
	ctx           context.Context
	clients       sync.Map
	creationMutex sync.Mutex
	mux           = http.NewServeMux()
)

type connection struct {
	Addrs      []string
	DB         int
	Username   string
	Password   string
	MasterName string
}
type requestCommand struct {
	Connection connection
	Command    []interface{}
	Raw        bool
}

func runCommand(w http.ResponseWriter, r *http.Request) {
	request := requestCommand{}
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	log.Println(request.Command)

	client, err := getClient(request.Connection)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	raw, err := client.Do(ctx, request.Command...).Result()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if request.Raw {
		w.Header().Set("Content-Type", "plain/text")
		w.Write([]byte(fmt.Sprintf("%X", raw)))
	} else {
		bytes, err := json.Marshal(raw)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(bytes))
	}
}

type requestPipeline struct {
	Connection connection
	Commands   [][]interface{}
}

func runPipeline(w http.ResponseWriter, r *http.Request) {
	request := requestPipeline{}
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	log.Println(request.Commands)

	client, err := getClient(request.Connection)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	pipeline := client.Pipeline()
	for _, command := range request.Commands {
		pipeline.Do(ctx, command...)
	}
	cmders, err := pipeline.Exec(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	raw := make([]interface{}, len(cmders))
	for index, cmder := range cmders {
		cmd := cmder.(*redis.Cmd)
		str, err := cmd.Result()
		if err != nil {
			raw[index] = nil
		} else {
			raw[index] = str
		}
	}
	bytes, err := json.Marshal(raw)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(bytes))
}

func getClient(opt connection) (redis.UniversalClient, error) {
	uri, err := json.Marshal(opt)
	key := string(uri)
	if err != nil {
		return nil, err
	}

	if cached, ok := clients.Load(key); ok && cached != nil {
		return cached.(redis.UniversalClient), nil
	}

	// Use mutex to make sure there is only one active redis client instance for one uri.
	// While with mutex, clients for different redis servers must be created one by one.
	creationMutex.Lock()
	defer creationMutex.Unlock()

	// check again, if it is already created, just return.
	if cached, ok := clients.Load(key); ok && cached != nil {
		return cached.(redis.UniversalClient), nil
	}

	client := redis.NewUniversalClient(&redis.UniversalOptions{
		Addrs:      opt.Addrs,
		DB:         opt.DB,
		Username:   opt.Username,
		Password:   opt.Password,
		MasterName: opt.MasterName,
	})

	clients.Store(key, client)
	return client, nil
}

func destory() {
	clients.Range(func(k, v interface{}) bool {
		v.(redis.UniversalClient).Close()
		return true
	})
}

func listConnections(w http.ResponseWriter, r *http.Request) {
	opts := os.Getenv("REDIS_OPTS")
	if opts == "" {
		opts = "[]"
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(opts))
}

func main() {
	ctx = context.Background()

	// serve root dir
	mux.Handle("/", gziphandler.GzipHandler(http.FileServer(pkger.Dir("/dist"))))

	// handle runCommand
	mux.Handle("/api/runCommand", gziphandler.GzipHandler(http.HandlerFunc(runCommand)))

	// handle runCommand
	mux.Handle("/api/runPipeline", gziphandler.GzipHandler(http.HandlerFunc(runPipeline)))

	// handle listConnections
	mux.Handle("/api/listConnections", gziphandler.GzipHandler(http.HandlerFunc(listConnections)))

	// start service
	startService()

	defer destory()
}
