# Workshop 8

## Helm

### 1. Basic Helm Chart

1. Make sure helm is installed!

    ```bash
    # Ensure version is >3
    helm version
    # List all helm releases in current namespace
    helm list
    ```

1. Let's look for a chart on helm hub (used to search)

    ```bash
    helm search hub kube-hunter
    ```

1. And add the stable repository

    ```bash
    helm repo add stable https://kubernetes-charts.storage.googleapis.com/
    ```

1. Look at the chart information before installing

    ```bash
    # Take a look at the chart info
    helm show chart stable/kube-hunter
    # And the default values that will be plugged in
    helm show values stable/kube-hunter
    ```

1. And what resources it will install

    ```bash
    helm install kh stable/kube-hunter --dry-run
    ```

1. And finally install the chart

    ```bash
    helm install kh stable/kube-hunter
    ```

1. Confirm the installation

    ```bash
    helm list
    helm status kh
    ```

1. Take a look at the created resource(s)

### 2. Modify helm values

1. Let's modify these to run at a time near to us. Look at the values file again, to see what can be overwritten
1. Create a file called values.yaml which will be used to override the defaults inside the chart
1. Update the cronjob to run every 5 minutes in the values.yaml
1. Upgrade the release with the new values file

    ```bash
    helm upgrade kh stable/kube-hunter -f <filename>
    ```

### 3. Local helm chart

1. Jump into a new folder and create a helm chart structure

    ```bash
    mkdir charts
    helm create webapp
    ```

1. Take a look at the created files
1. Deploy the current chart

    ```bash
     helm install testnginx ./webchart
    ```

1. Take a look at the created resources

    ```bash
    kubectl get svc,sa,deploy
    ```

### 4. New application

1. Create a values.yaml file inside the new folder, without modifying what's in the webapp/ folder
1. Set variables in your `values.yaml` to run your custom application from workshop6 (e.g., `italy:1.0`). You'll likely need to override `image.repository` and `image.tag`.
   *   **Minikube Note:** Ensure the `italy:1.0` image was built within Minikube's Docker environment (using `eval $(minikube -p minikube docker-env)` as noted in Workshop 6). Also, ensure the Helm chart's `imagePullPolicy` (check `webapp/values.yaml` or set it in your override file) is set to `IfNotPresent` or `Never` so Kubernetes uses the local image.
1. Create a dry-run of the application to confirm appropriate resources will be created with a new helm release (`helm install --dry-run ... -f values.yaml ./webapp`)
1. Install the application with a new helm release (`helm install ... -f values.yaml ./webapp`)
