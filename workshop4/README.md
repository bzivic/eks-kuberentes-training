# Workshop 4

## Annotations

### 1. Annotations

1. Add some relevant annotations to our Pod in the [1_annotations.yaml](1_annotations.yaml) manifest

    ```yaml
    metadata:
      annotations:
        git_repo: "https://github.com/java/world"
        owner: "John Smith 0123456789"
    ```

1. Apply the manifest and observe your annotations using kubectl

## Labels

### 2. Labels

1. Our previous deployment in [1_annotations.yaml](1_annotations.yaml) had labels already. Let's add some more to those

  ```yaml
  metadata:
    labels:
      app.kubernetes.io/name: nginx_web
      app.kubernetes.io/managed-by: ops
  ```

1. Reapply the new manifest and observe your changes using describe on both the deployment and the pods
1. Pull up a list of pods, pick one and edit it's manifest. Change the label `app` to a new value
1. Check the status of both deployments and pods. Is there a discrepency?
1. Edit the pod again, and restore the label
1. Check the status of both deployments and pods

### 3. Custom labels

1. Lets add some custom labels to both our deployment and pods

    ```yaml
    labels:
      app.kubernetes.io/env: dev
      app.kubernetes.io/release: test
    ```

1. Apply the manifest and let's search for them

    ```yaml
    kubectl get deploy -l 'app.kubernetes.io/env=dev'
    kubectl get po -l 'app.kubernetes.io/env=dev'
    kubectl get po -l 'app.kubernetes.io/env in (prod,dev)'
    ```

1. Delete the deployment once done

## Healthcheck Probes

### 4. Liveness Probe (command check)

1. Investigate the manifest [4_liveness_probe_command.yaml](4_liveness_probe_command.yaml)
1. Apply the manifest and set a watch on the pod or events
1. If there's a problem, investigate and identify the fix
1. Delete the pod once done

### 5. Liveness Probe (http check)

1. Let's create another pod using the container `k8s.gcr.io/liveness` with the arg `/server`
1. Set a livenessProbe to perform a http check

  ```yaml
  livenessProbe:
    httpGet:
      path: /healthz
      port: 8080
  ```

1. Apply the manifest and observe what happens to the pod (logs & events)
1. Source code: [here](https://github.com/kubernetes/kubernetes/blob/master/test/images/agnhost/liveness/server.go)
1. Delete the pod once done

### 6.  Liveness Probe (tcp socket)

1. Use the pod previously created and modify the check to a TCP check

  ```yaml
  livenessProbe:
    tcpSocket:
      port: 8080
  ```

1. Apply the manifest. What's going on here?
1. Delete the pod once done

### 7. Startup Probe

1. Add a startup probe (using the same variables) to the pod previously created
1. Apply the manifest. What's the use of a startup probe? Can we replace it something else?
1. Delete the pod once done
