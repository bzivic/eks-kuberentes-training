# Workshop 3

## Deployments

### 1. Simple Deployment

1. Setup some watches to see what's happening

    ```bash
    # In window 1
    kubectl get rs -w
    # In window 2
    kubectl get pods -w
    ```

1. Apply the manifest [1_simple_deployment.yaml](1_simple_deployment.yaml)
1. After applying the manifest, look at the status of the deployment and the replicaset it created

    ```bash
    kubectl get deployments
    kubectl get rs
    ```

1. See the labels generated for the Pods

    ```bash
    kubectl get pods --show-labels
    ```

### 2. Adding resources

1. Setup clean watches and add resource limits (cpu: 50m, mem: 100Mi) and requests (cpu: 25m, mem: 100Mi) using your editor
1. Re-apply the manifest and watch the changes
1. Look at the status of the deployment and replicaset again

### 3. Multi-container pod (nginx)

1. Setup clean watches and add another nginx container to the manifest
1. Re-apply the manifest and watch the changes
1. Is there a problem? Investigate if necessary

### 4. Multi-container pod (redis)

1. Now lets add a different container to the manifest (redis). Make sure you remove resource requirements
1. Re-apply the manifest and watch the changes

### 5. Deployment rollouts

1. Delete the deployment and go back to a clean slate
1. Ensure no deployments are running, and reapply the deployment manifest
1. See the rollout status of a deployment

    ```bash
    kubectl rollout status deploy/nginx-deployment
    kubectl rollout history deploy/nginx-deployment
    ```

1. Update the container image from `nginx:1.14.2` to `nginx:1.16.1` in an editor
1. Reapply the manifest and immediately check the rollout status
1. Check the deployment's history and add `--revision=#` to see configuration
1. Let's rollback to the older deployment

    ```bash
    kubectl rollout undo deploy/nginx-deployment
    ```

1. Check replicasets and the deployment's history again. What's happened?
1. Describe the deployment

    ```bash
    kubectl describe deploy nginx-deployment
    ```

### 6. Rolling update strategy

1. Update the number of replicas to 10 in your editor and reapply the manifest
1. Let's explicitly declare some rolling update fields and update the container to `nginx:1.18.0`. Reapply the manifest

    ```yaml
    spec:
      strategy:
        type: RollingUpdate
        rollingUpdate:
          maxUnavailable: 50% #Maximum number of pods unavailable during an update
          maxSurge: 100% #Maximum number of pods that can be created OVER the number of desired pod replicas
    ```

1. Use kubectl rollout status or watch the replicaset to monitor changes
1. Once done, delete the deployment

## DaemonSet

### 7. Simple daemonset

1. Take a look at the current node count

    ```bash
    kubectl get nodes
    ```

1. EKS may already has a few daemonsets, lets check these out across ALL namespaces

    ```bash
    kubectl get daemonset -A
    ```

1. Now lets deploy one of our own by applying [7_simple_daemonset.yaml](7_simple_daemonset.yaml)
1. Describe the daemonset and check out the latest events

    ```bash
    kubectl get events --sort-by='.lastTimestamp'
    ```

1. This is a failing ds, let's delete it and move on!

### 8. CronJobs

1. Take a look at the manifest [8_cronjobs.yaml](8_cronjobs.yaml) and work out what it's trying to do
1. Apply the manifest
1. Take a look at the output of `get cronjob` and `describe cronjob`
1. Take a look at the output of `get job` and `describe job` (you may have to wait a little)
1. Investigate the pods that are created from these cronjobs. Look at the YAML, especially the status field
1. Look at the output of both events, and logs for the pods
1. Delete the cronjob and ensure all associated resources are removed

## Free exercises

### Deployments
1. Pick a container off dockerhub and create a deployment for it
1. Apply the manifest
1. Watch the deployment's rollout
1. Apply an incorrect version update and apply the manifest
1. Watch the deployment's rollout and use rollout history
1. Return the deployment to the older revision
1. Increase the replica count of the deployment to 10
1. Watch pod placement on nodes
1. Scale replicas down to 2

### Jobs/Cronjobs

1. Create a job on it's own, and run `echo hello;sleep 10; echo world` on a container of your choice
1. Follow the logs
1. Once completed, delete the job
1. Recreate the job with a longer sleep & set a value which will terminate the pod if it takes more than 20s to execute `job.spec.activeDeadlineSeconds`
1. Apply the manifest and follow the pod logs
1. Investigate the job status and `describe job` output
1. Delete the job
1. Recreate the job with a short sleep, and ensure it only runs 5 times serially `job.spec.completions`
1. Delete the job
1. Recreate the job and ensure it only runs 5 times, but in parallel `job.spec.parallelism`
1. Create a cronjob that prints hello world every minute. Terminate it, if it takes more than 10 seconds