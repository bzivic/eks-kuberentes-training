# Workshop 0: Setting up a Local Kubernetes Environment with Minikube

This workshop guides you through setting up a local Kubernetes cluster using Minikube on macOS. This local cluster will allow you to run and test the Kubernetes configurations from the subsequent workshops on your own machine.

## Prerequisites

Before installing Minikube, you need a hypervisor or container runtime. Common choices for macOS include:

*   **Docker Desktop:** Provides a container runtime environment. If you already have Docker Desktop installed, Minikube can use its Docker engine.
*   **HyperKit:** A lightweight macOS virtualization solution built on top of the Hypervisor.framework.
*   **VirtualBox:** A popular open-source hypervisor.
*   **VMware Fusion:** A commercial hypervisor product.

This guide will primarily focus on using Docker Desktop or HyperKit, as they are common choices on macOS.

## Installation

We'll use [Homebrew](https://brew.sh/) to install Minikube and `kubectl`. If you don't have Homebrew installed, open your Terminal and run:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Once Homebrew is ready, install Minikube and kubectl:

```bash
brew install minikube
brew install kubectl
```

This will install the latest stable versions of both tools.

## Starting Minikube

1.  **Choose a Driver:** Decide which driver Minikube should use.
    *   **Docker:** If you have Docker Desktop installed and running, this is often the easiest option.
    *   **HyperKit:** If you prefer HyperKit, install it first: `brew install hyperkit`

2.  **Start the Cluster:** Open your Terminal and run the `minikube start` command.
    *   **Using Docker Driver:**
        ```bash
        minikube start --driver=docker
        ```
    *   **Using HyperKit Driver:**
        ```bash
        minikube start --driver=hyperkit
        ```
    *   **Default Driver:** If you don't specify a driver, Minikube might try to auto-detect one, often defaulting to Docker if available.

    Minikube will download the necessary images and configure your local Kubernetes cluster. This might take a few minutes the first time.

## Verifying the Setup

1.  **Check Cluster Status:** Ensure your Minikube cluster is running:
    ```bash
    minikube status
    ```
    You should see output indicating the host, kubelet, and apiserver are running.

2.  **Configure kubectl:** Minikube usually updates your `kubectl` configuration automatically. Verify that `kubectl` is configured to talk to your Minikube cluster:
    ```bash
    kubectl config current-context
    ```
    This should output `minikube`.

3.  **Test kubectl:** Run a simple `kubectl` command to interact with your cluster:
    ```bash
    kubectl get nodes
    ```
    This should list the single node (`minikube`) in your local cluster with a `Ready` status.

## Basic Minikube Commands

*   **Start Cluster:** `minikube start`
*   **Stop Cluster:** `minikube stop` (Preserves the cluster state)
*   **Delete Cluster:** `minikube delete` (Deletes the cluster entirely)
*   **Check Status:** `minikube status`
*   **SSH into Node:** `minikube ssh`
*   **Open Dashboard:** `minikube dashboard` (Opens the Kubernetes dashboard in your browser)
*   **Set Docker Environment:** `eval $(minikube -p minikube docker-env)` (Configures your shell to use Minikube's Docker daemon, useful for building images directly within the cluster's context)

## Important Notes for Workshops

*   **Service Type LoadBalancer:** Cloud providers automatically provision load balancers for services of `type: LoadBalancer`. Minikube handles this differently. If a workshop uses or asks you to create a `LoadBalancer` service, you'll need to expose it using one of these Minikube commands in a separate terminal window:
    *   `minikube service <service-name>`: This command opens the service URL in your browser and keeps a tunnel open.
    *   `minikube tunnel`: This command creates a network route, allowing you to access LoadBalancer services via their assigned external IP within the Minikube network.

*   **Ingress Resources:** Some workshops (like Workshop 7 or potentially Workshop 8 if you enable Ingress in the Helm chart) might use Ingress resources to manage external access to services. Minikube requires an Ingress controller addon. Before working with Ingress resources, enable the addon:
    ```bash
    minikube addons enable ingress
    ```
    You can then access your Ingress resources via Minikube's IP address. Find the IP using `minikube ip`.

## Next Steps

With Minikube running and these points in mind, you now have a local Kubernetes environment ready. You can proceed to Workshop 1 and subsequent workshops, applying the Kubernetes manifests and commands against your Minikube cluster using `kubectl`.
