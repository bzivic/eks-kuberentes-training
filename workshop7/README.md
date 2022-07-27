# Workshop 7

## Ingress

### 1. Simple deployment

1. Let's deploy our kuard pod again [1_deployment.yaml](1_deployment.yaml)
1. Apply the service manifest for this deployment too [1_service.yaml](1_service.yaml)
1. Investigate the manifest [1_ingress.yaml](1_ingress.yaml), add a host header value and apply it
1. Run `describe` and `get` on your ingress
1. Ensure you can resolve the host header on your localhost (add entry to /etc/hosts)
1. Check out the ingress controller and it's logs

### 2. Multiple paths/hosts

1. Recreate italy/spain deployments from the last workshop. This time place them in the default namespace
1. Create service manifests for both (which service type?) and apply
1. Create a single ingress that routes specific paths to both services. Use a unique host header
1. Apply the manifests and investigate the resources that have been created
1. Update the ingress to route separate host headers to each service

### 3. TLS traffic

1. To enable the ingress controller to terminate TLS connections, you need a certificate and a private key
1. Generate these using openssl

    ```bash
    openssl genrsa -out tls.key 2048
    openssl req -new -x509 -key tls.key -out tls.cert -days 10 -subj "/CN=spain.mycloud"
    ```
 
 1. Store these files in a Secret object

    ```bash
    kubectl create secret tls tls-secret --cert=tls.cert --key=tls.key
    ```

1. Take a look at the secret created through this method, without a manifest
1. Update the ingress for the spain service to terminate tls

    ```yaml
    spec:
      tls:
      - hosts: 
        - spain.mycloud
        secretName: tls-secret
      rules:
        ...
    ```

1. Apply the manifest and investigate the changes
1. Try hitting your service, using https instead of http
