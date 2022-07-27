# Workshop 5

## Application setup

### 1. Hardcoded envvars

1. Take a the look at hello-world application, this time in NodeJS (using Express)

    ```bash
    docker build -t mynodejsapp:1.0 .
    ```

1. Create a deployment manifest that can run the container, and apply the manifest
1. Look at the output of the application
1. Now let's add some environment variables to the application

    ```js
    //Add the following constants to assign local variables from environment variables
    const SITE_COLOR = process.env.SITE_COLOR;
    const DB_USERNAME = process.env.DB_USERNAME;
    const DB_PASSWORD = process.env.DB_PASSWORD;
    //Add the following to the response section, which exposes the variables as straight HTML
    res.write(`Your Site color is: ${SITE_COLOR}<br/>`);
    res.write(`Your DB Username is: ${DB_USERNAME}<br/>`);
    res.write(`Your DB Password is: ${DB_PASSWORD}<br/>`);
    ```

1. Update your dockerfile to set the environment variables

    ```dockerfile
    # Add environment variables
    ENV SITE_COLOR 123454321
    ENV DB_USERNAME dbuser
    ENV DB_PASSWORD supersecretpassword
    ```

1. Build the container again, and increment the version number!

    ```bash
    docker build -t mynodejsapp:2.0 .
    ```

1. Update your manifest to reference the new container, and reapply
1. Confirm the output of the application

### 2. Hardcoded filesync

1. There's a configuration file already under /config. We will pull this into the container and read from it inside the code
1. Update the application to read from the file

    ```js
    let rawjson = fs.readFileSync('/config/config.json');
    res.write(`Your language setting is ${JSON.parse(rawjson).LANGUAGE}<br/>`)
    ```

1. Update your dockerfile to copy the file

    ```dockerfile
    # Copy volume
    RUN mkdir /config
    COPY /config/config.json /config/
    ```

1. Build the container after incrementing the version and update your kubernetes deployment
1. Confirm the output of the application

## ConfigMaps

### 3. Creation

1. Take a look at the existing configmaps
1. [3_configmap1.yaml](3_configmap1.yaml) contains a simple key-pair variable
1. [3_configmap2.yaml](3_configmap2.yaml) contains a json blob that will be stored in config.json
1. These should be in a single configmap, but have been separated to show how each can be mounted as an env var, or a volume
1. Apply both manifests and take a look at the kubernetes resources created

### 4. ConfigMap usage (environment variable)

1. We are going to pull out the variables from our dockerfile, and instead put them in a configmap
1. Let's remove the environment variables first (only from the dockerfile!)
1. Rebuild with a new version
1. Update the deployment manifest and apply
1. Investigate the output of the application
1. Leave the deployment running
1. Update the deployment manifest to load the specified variable from `myapp-cm1` configmap (Note: this is added to the container section)

    ```yaml
    env:
      - name: SITE_COLOR
        valueFrom:
          configMapKeyRef:
            # The ConfigMap containing the value you want to assign to SPECIAL_LEVEL_KEY
            name: myapp-cm1
            # Specify the key associated with the value
            key: color
    ```

1. Describe the created pod, specifically look at the `Environment` section
1. Investigate the output of the application
1. Jump into the container and look at what environment variables are set `env`

### 5. ConfigMap usage (volume)

1. Now let's pull out the volume mount from our dockerfile and rebuild the container (new version ofcourse)
1. Update the manifest to pull config.json from the `myapp-cm2` configmap

    ```yaml
    spec:
      volumes:
        - name: configmap-json
          configMap:
            name: myapp-cm2 #Configmap reference
      containers:
        - name: mynodejsapp
          ...
          volumeMounts:
            - name: configmap-json #Mount the volume inside the pod. All variables are mounted as files 
              mountPath: /config
    ```

1. Open a shell into the container and take a look at /config
1. Investigate the output of the application

### 6. ConfigMap dynamic updates

1. Lets update both configmaps to use new values. Edit the manifests and reapply
1. Investigate the output of the application (
1. You may have to wait upto 1 minute (kubelet sync period) + 1 minute (configmap cache ttl). Trigger an immediate refresh by updating a Pod annotation
1. Open a shell into the container and take a look at both /config/config.json and `env` command output

## Secrets

### Creation

1. Take a look at [6_secret.yaml](6_secret.yaml)
1. We need to encode the secret data before we put it in this file

    ```bash
    echo -n 'yourvalue' | base64
    ```

1. Once both username and password fields are updated, apply the manifest
1. Take a look at both yaml output using `kubectl get secret ...` and `describe`
1. Note: to decode a secret simply run `base64 --decode`

### 7. Secrets Usage

1. We should have already removed the db_username and db_password values from the docker container, so we don't need to build a new container
1. Update the deployment manifest to pull the secret in as an environment variable. This is exactly the same as a configmap, but uses `secretKeyRef` instead
1. Apply the manifest after updating it
1. Investigate the output of the container
1. Open a shell into the container and run `env`

## Volumes

### 8. EmptyDir

1. Take a look at the [8_emptydir.yaml](8_emptydir.yaml) manifest and apply
1. Look at the logs of the container
1. Open a shell into the container and create a few files in your mounted volume
1. Exit and re-observe the logs of the container

### 9. Restricted root

1. Open a shell back into your container and try creating some files under the root (/) filesystem. Exit once done
1. Add the following to your pod.container[0] spec from the previous exercise

  ```yaml
  container:
  - image: busybox
    ...
    securityContext:
      readOnlyRootFilesystem: true
  ```

1. Re-apply the manifest and try to create some files under the root file system again
1. Try to create some files under the mounted volume

### 10. Shared EmptyDir

1. Take a look at the multi-container deployment in [10_shared_emptydir.yaml](10_shared_emptydir.yaml). Is there anything missing?
1. Modify if necessary and apply the manifest
1. Port forward and investigate the output
1. Was there a containerPort defined?
1. Did you specify which container you want to port forward from?

### 11. HostPath

1. Open up the manifest at [11_hostpath.yaml](11_hostpath.yaml) and add the following volume:

  ```yaml
  volumes:
    - name: my-volume
      hostPath:
        path: /var/log
        type: Directory
  ```

1. Mount this in your container under /tmp/log and apply your manifest
1. Open a shell into your container and see the contents of your volume mount

### 12. Static Provisioning

1. Take a look at [12_persistent_volume.yaml](12_persistent_volume.yaml)
1. Apply the manifest and investigate the created resource
1. Take a look at the PVC manifest at [12_persistentvolumeclaim.yaml](12_persistentvolumeclaim.yaml)
1. Create a persistent volume claim to try to bind the statically created volume by applying the manifest
1. Investigate the created resource, along with the previously created PV
1. Create a deployment (with busybox container) which specifies this PVC as it's volume type. Mount it to /tmp/data

  ```yaml
  volumes:
    - name: my-volume
      persistentVolumeClaim:
        claimName: staticclaim
  ```

1. Create a shell into the container and confirm the mount point
1. Create another PVC which tries to claim the PV. What happens?
1. Try to increase the size of the PVC to match the PV and reapply the manifest. What happens?

### 13. Dynamic Provisioning

1. Let's create a physical volume claim which will use this storage class. Investigate and apply the manifest [13_persistentvolumeclaim.yaml](13_persistentvolumeclaim.yaml)
1. Investigate the created resources (PVC and PV)
1. Create a deployment (with busybox container) which will specify this PVC as it's volume type. Mount it to /tmp/data
1. Apply the deployment manifest and confirm the volume mounts
1. Create a shell into the container and write some data into a file on the volume

  ```bash
  echo "Hello World" > /tmp/storage/myfile
  ```
1. Exit and delete the deployment
1. Recreate the deployment
1. Shell into the container and confirm your file is still there
1. Exit and delete the resources created

## Free Exercises

### ConfigMaps & Secrets

1. Create a new configmap with multiple kv pairs
1. Create a new secret with multiple kv pairs
1. Create a deployment which runs a basic nginx server
1. Expose the configmap kv pairs as env vars. Try loading them into different environment variables than their key names
1. Try exposing all the configmap variables as environment variables without specifying them individually

    ```yaml
    envFrom:
    - prefix: CONFIG_
      configMapRef:
        name: myconfigmap
    ```

1. Mount the secrets as volumes
1. Open a shell into the container and ensure the variables are available
1. Try referencing a configmap that doesn't exist in a deployment and update
1. Try referencing keys in a configmap that don't exist
1. Finally, create a docker container which runs in a languge of your choice (java, python, shell etc), which utilises environment variables/files from a volume
1. Create a deployment for this container, along with any necessary configmaps & execute the manifests
