FROM node:slim AS node-builder
WORKDIR /src/node
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY .umirc.ts .
COPY tsconfig.json .
COPY public ./public
COPY src ./src
RUN npm run build

FROM golang:alpine AS golang-builder
RUN go env -w GO111MODULE=on
RUN go env -w GOPROXY=https://goproxy.io,direct
# https://github.com/markbates/pkger/issues/116
RUN ln -s /go /workaround_pkger_go_path && ln -s /root /workaround_pkger_home
ENV GOPATH /workaround_pkger_go_path
ENV HOME /workaround_pkger_home
RUN go get github.com/markbates/pkger/cmd/pkger
WORKDIR /src/golang
COPY go/go.mod go/go.sum ./
RUN go mod download
COPY go/. .
COPY --from=node-builder /src/node/dist ./dist
RUN /go/bin/pkger
RUN go build -tags headless -o sider .

FROM alpine
ENV PORT=3000
EXPOSE 3000
COPY --from=golang-builder /src/golang/sider /usr/local/bin/sider
CMD ["/usr/local/bin/sider"]
