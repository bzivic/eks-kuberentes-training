# Workshop 1

## Introduction

1. Ensure you can access your Kubernetes cluster

    ```bash
    kubectl version
    kubectl cluster-info
    kubectl get pods -A
    ```

1. Launch kuard container inside the kubernetes cluster

    ```bash
    kubectl run --restart=Never --image=gcr.io/kuar-demo/kuard-amd64:blue kuard
    ```

1. Watch the container come up

    ```bash
    kubectl get pods
    ```

1. Forward a port to your localhost, to access the container directly

    ```bash
    kubectl port-forward kuard 8080:8080
    ```

1. Open a browser and navigate to http://localhost:8080

1. Kill your port-forward, let's run through some basic commands

    ```bash
    kubectl get pods
    kubectl describe pod kuard
    kubectl logs kuard
    kubectl exec -it kuard sh
    ```

1. Delete the pod

    ```bash
    kubectl delete pod kuard
    ```

1. Run through what constitutes your cluster

    ```bash
    kubectl get namespaces
    ```