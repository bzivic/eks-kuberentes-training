# Workshop 2

## Pods

### 2. Pod manifests

1. Make sure an existing version of the pod isn't running

    ```bash
    kubectl get pods --namespace default
    kubectl delete pod kuard --namespace default
    ```

1. Apply the manifest [2_pod_manifests.yaml](2_pod_manifests.yaml) and watch the changes

    ```bash
    kubectl apply -f 2_pod_manifests.yaml
    kubectl get pods -w
    ```

1. Take a look at the modified object inside the API server

    ```bash
    kubectl get pod kuard -o yaml
    ```

1. Investigate the problem

    ```bash
    kubectl logs kuard
    kubectl get events
    kubectl describe pod kuard
    ```

1. Fix using your favorite editor and reapply. Make sure you're watching the pod

    ```bash
    kubectl get pod -w
    ```

1. Let's destroy the pod and try something different

    ```bash
    kubectl delete -f 2_pod_manifests.yaml
    ```

### 3. Pod resource allocations

1. Open the file [3_pod_resource_allocations.yaml](3_pod_resource_allocations.yaml) in your editor
1. Lets add some resources (limits/requests). Remember that resources apply to containers

    ```yaml
    resources:
      limits:
        memory: 200Mi
        cpu: 200m
      requests:
        memory: 100Mi
        cpu: 50m
    ```

1. Try to apply the manifest
1. Delete the pod, increase memory usage on the pod and reapply

    ```yaml
    args: ["--vm", "1", "--vm-bytes", "250M", "--vm-hang", "10"]
    ```

1. And now we're in a crash loop! Investigate the status
1. Lets stop the container from restarting on crashes too

    ```yaml
    restartPolicy: Never
    ```

1. Destroy the pod

### 4. Pod from scratch

1. Edit the file hello-world/index.html to include some custom content

    ```bash
    cd hello-world
    # Minikube Note: Before building, ensure your terminal is using Minikube's Docker daemon.
    # Run `eval $(minikube -p minikube docker-env)` first (see Workshop 0).
    docker build -t $insert_your_name_here:1.0 .
    docker images
    # Make sure your imagePullPolicy is set appropriately (e.g., Never or IfNotPresent)
    # so Kubernetes uses the image you just built inside Minikube's environment.
    ```

1. Create a manifest from scratch using your favorite editor
1. Apply your manifest
1. Use port forwarding to connect to your container
1. Update the index.html and reapply the kubernetes manifest. Do you see your changes?
1. You may have to delete the existing Pod

### 5. Versioned containers

1. Let's do this exercise in a scalable way, using versions
1. Create a new container and instead of overriding the version, increment it instead.
   *   **Minikube Note:** Remember to use `eval $(minikube -p minikube docker-env)` before running `docker build` if using Minikube.
1. Update the manifest to point to the new version, and apply
1. Describe the Pod to see which version it's using
1. Get the Pod output in yaml to be sure
1. Once the Pod is in running state, port-forward into it and observe your changes
1. Once we're done, remember to delete your pods

## Free exercises

### Pod

1. Pick a container from dockerhub, create a Pod spec for it and run the container
1. Change the Pods image version and watch it through `kubectl get po -w`
1. Can you see the previous pod's logs?
1. Try listing all components that belong to the control plane tier (should be labelled with tier=control-plane)
1. Take a look at the pod specs for core kubernetes objects. Anything interesting?
1. Check out the logs for these objects
