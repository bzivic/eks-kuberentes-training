# Using the golang:alpine image as the builder
# Alpine is a security oriented lightweight linux distribution based on musl, libc and busybox
FROM golang:alpine as builder
RUN mkdir /build
ADD . /build/
WORKDIR /build
# Statically link runtime libraries into the binary itself
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags '-extldflags "-static"' -o main .
# Scratch is a special image provided by docker. 0KB, no internal OS, nothing!
# But capable of running an isolated binary, as long as the host architecture supports the compiled binary architecture
FROM scratch
COPY --from=builder /build/main /app/
WORKDIR /app
CMD ["./main"]