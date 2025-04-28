# Workshop 6

## Misc

### 1. Kubectl config

1. Let's go through a couple of things in kubectl config

    ```bash
    kubectl config view
    ```

1. Hopefully this looks familiar. Important things to note are;

- Clusters (CA and server)
- Users (Especially authentication method)
- Context (cluster, namespace, user)

### 2. Basic recovery

1. Create a deployment spec, apply it and get your pod running
1. Delete the deployment spec file
1. How do you update the deployment spec now?
1. Try using `kubectl edit deployment <resource>`
1. Now try grabbing the yaml output. What do you see?
1. Pull only the spec by adding `-o yaml --export`

## Namespaces

### 3. Namespaced resources

1. Take a look at all namespaced resources

    ```bash
    kubectl api-resources --namespaced=true
    ```

1. Take a look at all the global resources

    ```bash
    kubectl api-resources --namespaced=false
    ```

### 4. Create a new namespace

1. Take a look at the manifest [4_namespace.yaml](4_namespace.yaml). Modify the name and create your own namespace
1. After applying the manifest, check both `get ns` and `describe ns`

### 5. Set some namespace resource limits

1. In our new namespace, let's set some defaults and limits
1. Take a look at the manifest [5_limitrange.yaml](5_limitrange.yaml) and apply to your new namespace using `--namespace <namespace>`
1. Check `describe ns` to see changes

### 6. Deploy into both the default and your new namespace

1. Take a look at the manifest [6_deployment.yaml](6_deployment.yaml). It's the same Pod from workshop 2, but converted into a deployment
1. Apply this manifest into the default (your current namespace)
1. Apply this manifest into your new namespace using `--namespace <namespace>`
1. Have a look at the deployment and pods running across all namespaces to see your workloads

    ```bash
    kubectl get deploy --all-namespaces
    kubectl get deploy -A
    ```

1. Make sure there's no issues & move on to the next step

## Services

### 7. Let's build some new containers

1. Some silly services, this time in golang are in `italy_go` and `spain_go`
1. Check out the dockerfiles for some extremely lean webserver configurations
1. Build both the containers, taking care with labels

    ```bash
    # Minikube Note: Remember `eval $(minikube -p minikube docker-env)` before building each image.
    cd italy_go && docker build -t italy:1.0 .
    cd ../spain_go && docker build -t spain:1.0 .
    cd .. 
    ```

1. Run docker image ls to see enjoy some functionally basic but tiny containers

### 8. Now let's run them!

1. Create two deployment manifests for each of your containers. Explicitly place them into different namespaces

    ```yaml
    metadata:
      name: italy
      namespace: default
    ```

1. Apply the manifests and make sure the pods come up
1. Port-forward and hit both of the deployments

### 9. Inter-pod communication via IP

1. How do you connect to one of these pods internally within the cluster? Obtain the IP address of all the pods

    ```bash
    kubectl get po -o wide
    ```

1. Run a debug container, and try to hit the pods

    ```bash
    # Run an interactive lean alpine container that never restarts (dies/rm on shutdown)
    kubectl run -i --rm --tty debug --image=alpine --restart=Never -- sh
    # Install curl command
    apk update
    apk add curl
    # Use curl to hit the webserver
    curl http://<IP Address>:8080/bobby
    ```

### 10. Inter-pod communication via Services and Endpoints

1. Take a look at [10_service1.yaml](10_service1.yaml) and [10_service2.yaml](10_service2.yaml). Update as necessary and apply the manifests
1. Once applied, relaunch the debug container in your current namespace
1. Try and hit the webserver using `service_name.namespace_name.svc.cluster.local`
1. Take a look at `/etc/resolv/conf` and walkthrough the lookups

    ```conf
    nameserver x.x.x.x
    search mynamespace.svc.cluster.local svc.cluster.local cluster.local
    options ndots:5
    ```

1. Exit out of the debug container and take a look at both `get service` and `describe service` outputs
1. See the output of both `get endpoints` and `describe endpoints` too and how they relate to services

### 11. Quick DNS troubleshooting

1. Launch a debug container
1. Try looking up something that obviously doesn't exist `nslookup random.default.pod.service.local` to generate some logs
1. Take another look at the nameserver in `/etc/resolv.conf`. That's our DNS server
1. Find the DNS server in the cluster
1. We can't exec into this container, but we can look at logs

### 12. NodePort service

1. Instead of constantly port-forwarding, let's expose our service as a NodePort service. Change the service type for one of your services to `NodePort`, and add a `nodePort: 30000` under your ports spec
1. Apply the manifest and look at the outputs for `get service` and `describe service` again
1. Hit the URL that's mapped all the way to your service.
   *   **Minikube Note:** To access the NodePort service from your host machine, use the Minikube IP and the specified port (e.g., 30000). Get the IP with `minikube ip`. The URL will be like `http://$(minikube ip):30000`.

### 13. LoadBalancer service

1. Modify an existing service to be of type `LoadBalancer` instead and reapply the manifest
1. Take a look at the service configuration. External-IP will be pending until you start a tunnel.
   *   **Minikube Note:** As mentioned in Workshop 0, Minikube requires `minikube tunnel` or `minikube service <service-name>` to expose `LoadBalancer` services. Run one of these in a separate terminal.
1. Check external-ip field in a different terminal while the tunnel is up

### 14. ExternalName service

1. Take a look at [14_externalname.yaml](14_externalname.yaml)
1. Apply this manifest and observe the outputs of `get` and `describe`
1. Launch the debug container again, add curl and try to curl the service `curl http://mysearchengine`
1. Make you delete resources deployed in the workshop

## Free Exercises

### Namespaces

1. Create a new namespace and set pod defaults/limits

### Services

1. Create a deployment and a service that runs [nginxdemos/hello](https://hub.docker.com/r/nginxdemos/hello/) and exposes port 80
1. Check clusterIP and endpoints
1. Open a temporary container and the cluster and curl the clusterip. Repeat the command to ensure you hit multiple pods
1. Open a temporary container in a different namespace and curl your service. Repeat the command to ensure you hit multiple pods

### Complete application

Excellent guestbook application over here: https://kubernetes.io/docs/tutorials/stateless-application/guestbook/ (if we have time)
