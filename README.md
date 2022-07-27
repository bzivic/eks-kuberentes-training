# kube-training

## Commands cheatsheet

### Kubernetes

```bash
# Obtain all events, sorted by timestamp
kubectl get events --sort-by='.lastTimestamp'

# See the configuration of a resource in yaml
kubectl get <object> -o yaml

# See the details of a resource
kubectl describe <object>

# Display a container's logs
kubectl logs <pod>

# Display a container's logs (if there are multiple containers)
kubectl logs <pod> -c <container>

# Display the logs for a previous (crashed) container
kubectl logs <pod> --previous

# Open an interactive terminal into a container, executing a shell command
kubectl exec -it <pod> -c container sh

# Run a temporary alpine container for debugging
kubectl run -i --rm --tty debug --image=alpine --restart=Never -- sh
```

[Official kubectl CLI cheat sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

### Minikube

```bash
# Configure your environment to use minikube's docker daemon
eval $(minikube docker-env)
```