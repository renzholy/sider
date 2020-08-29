package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
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

func runCommand(w http.ResponseWriter, r *http.Request) {
	type Request struct {
		Connection string
		Command    []interface{}
	}
	request := Request{}
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	log.Println(request.Command)

	client, err := create(request.Connection)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	raw, err := client.Do(ctx, request.Command...).Result()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	bytes, err := json.Marshal(raw)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(bytes))
}

func create(uri string) (*redis.Client, error) {
	if cached, ok := clients.Load(uri); ok && cached != nil {
		return cached.(*redis.Client), nil
	}

	// Use mutex to make sure there is only one active redis client instance for one uri.
	// While with mutex, clients for different redis servers must be created one by one.
	creationMutex.Lock()
	defer creationMutex.Unlock()

	// check again, if it is already created, just return.
	if cached, ok := clients.Load(uri); ok && cached != nil {
		return cached.(*redis.Client), nil
	}

	opt, err := redis.ParseURL(uri)
	if err != nil {
		return nil, err
	}
	client := redis.NewClient(opt)

	clients.Store(uri, client)
	return client, nil
}

func destory() {
	clients.Range(func(k, v interface{}) bool {
		v.(*redis.Client).Close()
		return true
	})
}

func listConnections(w http.ResponseWriter, r *http.Request) {
	uris := os.Getenv("REDIS_URIS")
	var data []byte
	var err error
	if uris == "" {
		data = []byte("[]")
	} else {
		data, err = json.Marshal(strings.Split(uris, "|"))
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}

func main() {
	ctx = context.Background()

	// serve root dir
	mux.Handle("/", gziphandler.GzipHandler(http.FileServer(pkger.Dir("/dist"))))

	// handle runCommand
	mux.Handle("/api/runCommand", gziphandler.GzipHandler(http.HandlerFunc(runCommand)))

	// handle listConnections
	mux.Handle("/api/listConnections", gziphandler.GzipHandler(http.HandlerFunc(listConnections)))

	// start service
	startService()

	defer destory()
}
