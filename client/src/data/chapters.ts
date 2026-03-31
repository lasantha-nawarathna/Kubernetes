export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Section {
  title: string;
  content: string;
  code?: { lang: string; label: string; code: string }[];
}

export interface Chapter {
  id: number;
  title: string;
  difficulty: DifficultyLevel;
  emoji: string;
  description: string;
  topics: string[];
  sections: Section[];
  image?: string;
}

export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner: 'badge-beginner',
  intermediate: 'badge-intermediate',
  advanced: 'badge-advanced',
  expert: 'badge-expert',
};

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

export const chapters: Chapter[] = [
  {
    id: 1,
    title: "Introduction to Kubernetes",
    difficulty: "beginner",
    emoji: "🧭",
    description: "Understand what Kubernetes is, why it exists, and how it fits into the modern cloud-native ecosystem.",
    topics: ["What is Kubernetes?", "Why Kubernetes?", "History & CNCF", "Architecture Overview", "Use Cases"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497990309/hGE5paskEp38fsYKPNESZa/k8s-hero-architecture-asuNrmHkCncM3rbdqL4ZVC.webp",
    sections: [
      {
        title: "What is Kubernetes?",
        content: `Kubernetes (often abbreviated as **K8s**) is an open-source container orchestration platform originally developed by Google and donated to the Cloud Native Computing Foundation (CNCF) in 2014. The name derives from the Greek word for "helmsman" or "pilot," reflecting its role in steering containerized workloads across a fleet of machines.

At its core, Kubernetes automates the deployment, scaling, and management of containerized applications. Rather than manually specifying which server runs which container, you declare the desired state of your system — how many replicas, what resources they need, how they communicate — and Kubernetes continuously works to make reality match that declaration.

Kubernetes has become the de-facto standard for container orchestration. As of 2025, over 80% of organizations running containers in production use Kubernetes, and the platform underpins everything from small startups to hyperscale cloud providers.`,
        code: [
          {
            lang: "yaml",
            label: "Minimal Pod Definition",
            code: `apiVersion: v1
kind: Pod
metadata:
  name: hello-k8s
  labels:
    app: hello
spec:
  containers:
  - name: hello
    image: nginx:1.27
    ports:
    - containerPort: 80`
          }
        ]
      },
      {
        title: "Why Kubernetes?",
        content: `Before Kubernetes, teams faced the "works on my machine" problem at scale. Containers solved the packaging problem, but orchestrating hundreds or thousands of containers across many servers introduced new challenges: scheduling, health checking, service discovery, rolling updates, and secret management.

**Kubernetes vs Docker Swarm:** Docker Swarm is simpler to set up but lacks the extensibility and ecosystem of Kubernetes. Swarm is suitable for small teams with straightforward needs, while Kubernetes excels in complex, multi-team environments requiring fine-grained control.

**Kubernetes vs Traditional Deployments:** Traditional VM-based deployments require manual capacity planning, slow provisioning, and significant operational overhead. Kubernetes enables bin-packing (fitting more workloads onto fewer machines), self-healing (automatically restarting failed containers), and horizontal scaling in seconds.

Key benefits include: declarative configuration via YAML/JSON, self-healing infrastructure, automated rollouts and rollbacks, horizontal scaling, service discovery and load balancing, secret and configuration management, and a rich extensibility model through Custom Resource Definitions (CRDs).`,
      },
      {
        title: "History & the CNCF",
        content: `Kubernetes traces its lineage to Google's internal container management systems, Borg and Omega, which managed billions of containers per week across Google's data centers. In 2014, Google open-sourced Kubernetes and, in 2016, donated it to the newly formed Cloud Native Computing Foundation (CNCF), a vendor-neutral home under the Linux Foundation.

The CNCF now hosts over 200 projects in its landscape, with Kubernetes as the flagship "graduated" project. The foundation defines cloud-native computing as building and running scalable applications in modern, dynamic environments such as public, private, and hybrid clouds. Kubernetes releases follow a quarterly cadence, with version 1.33 (released in 2025) introducing significant improvements for AI/ML workloads and platform engineering.`,
      },
      {
        title: "Architecture Overview",
        content: `A Kubernetes cluster consists of two logical planes: the **Control Plane** and the **Worker Nodes**.

The Control Plane is the brain of the cluster. It houses the API Server (the single entry point for all cluster operations), the Scheduler (which assigns pods to nodes), the Controller Manager (which runs reconciliation loops), and etcd (the distributed key-value store holding all cluster state).

Worker Nodes are the machines that actually run your containerized workloads. Each node runs a Kubelet (the node agent that communicates with the API Server), a container runtime (such as containerd), and kube-proxy (which manages network rules for service routing).

This architecture enables Kubernetes to be both highly available and horizontally scalable — you can run multiple Control Plane replicas for fault tolerance and add worker nodes to increase capacity.`,
      },
      {
        title: "Use Cases",
        content: `Kubernetes excels in a wide variety of scenarios. **Microservices architectures** benefit from Kubernetes' service discovery, load balancing, and independent scaling of each service. **AI and ML workloads** leverage GPU scheduling, batch job management, and frameworks like Kubeflow that run natively on Kubernetes.

**CI/CD pipelines** use Kubernetes as a dynamic build environment, spinning up ephemeral test environments on demand. **Multi-tenant SaaS platforms** use namespace isolation and RBAC to safely host multiple customers on shared infrastructure. **Edge computing** deployments use lightweight Kubernetes distributions like K3s to run workloads on resource-constrained devices.

As of 2025, Kubernetes has become the preferred platform for AI infrastructure, with GPU-aware scheduling, fractional GPU support, and deep integration with MLOps toolchains making it the go-to choice for training and serving machine learning models at scale.`,
      }
    ]
  },
  {
    id: 2,
    title: "Container Fundamentals",
    difficulty: "beginner",
    emoji: "📦",
    description: "Master Docker containers, images, registries, and Dockerfiles — the building blocks of Kubernetes workloads.",
    topics: ["What are containers?", "Intro to Docker", "Images vs Containers", "Container Registries", "Writing a Dockerfile", "Building & Pushing Images"],
    sections: [
      {
        title: "What are Containers?",
        content: `Containers are lightweight, portable, self-contained units of software that package an application together with all its dependencies — libraries, runtime, configuration files — into a single artifact. Unlike virtual machines, containers share the host operating system kernel, making them far more efficient in terms of startup time and resource consumption.

Containers achieve isolation through two Linux kernel features: **namespaces** (which provide isolated views of system resources like process IDs, network interfaces, and file systems) and **cgroups** (control groups, which limit and account for resource usage like CPU and memory). This combination gives containers the isolation of VMs with a fraction of the overhead.

A container image is the immutable blueprint; a container is the running instance. You can run many containers from the same image, each isolated from the others.`,
      },
      {
        title: "Introduction to Docker",
        content: `Docker, launched in 2013, popularized containers by providing a developer-friendly toolchain for building, shipping, and running containers. While Kubernetes can use any OCI-compliant container runtime (containerd, CRI-O), Docker remains the most common tool for building images.

Docker's architecture consists of the Docker daemon (dockerd), the Docker CLI client, and the Docker Hub registry. The daemon manages images, containers, networks, and volumes. The CLI sends commands to the daemon via a REST API.`,
        code: [
          {
            lang: "bash",
            label: "Essential Docker Commands",
            code: `# Pull an image from Docker Hub
docker pull nginx:1.27

# Run a container
docker run -d -p 8080:80 --name my-nginx nginx:1.27

# List running containers
docker ps

# View container logs
docker logs my-nginx

# Execute a command inside a running container
docker exec -it my-nginx /bin/bash

# Stop and remove a container
docker stop my-nginx && docker rm my-nginx

# List images
docker images

# Remove an image
docker rmi nginx:1.27`
          }
        ]
      },
      {
        title: "Writing a Dockerfile",
        content: `A Dockerfile is a text file containing instructions for building a container image. Each instruction creates a new layer in the image, and Docker caches these layers to speed up subsequent builds.

Best practices for production Dockerfiles include: using specific image tags (not \`latest\`), minimizing layer count, using multi-stage builds to reduce image size, running as a non-root user, and scanning images for vulnerabilities.`,
        code: [
          {
            lang: "dockerfile",
            label: "Production-Ready Dockerfile (Multi-stage)",
            code: `# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runtime (minimal image)
FROM node:20-alpine AS runtime
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "server.js"]`
          }
        ]
      },
      {
        title: "Container Registries",
        content: `A container registry is a repository for storing and distributing container images. **Docker Hub** is the default public registry, hosting millions of official and community images. For production use, private registries provide better security, access control, and performance.

Major registry options include: **Amazon ECR** (Elastic Container Registry), **Google Artifact Registry**, **Azure Container Registry**, **GitHub Container Registry** (ghcr.io), and self-hosted solutions like Harbor. Most registries support image scanning for vulnerabilities, signing for supply chain security, and geo-replication for global deployments.`,
        code: [
          {
            lang: "bash",
            label: "Build and Push to Registry",
            code: `# Build image with tag
docker build -t myapp:v1.2.3 .

# Tag for a private registry
docker tag myapp:v1.2.3 registry.example.com/team/myapp:v1.2.3

# Login to registry
docker login registry.example.com

# Push image
docker push registry.example.com/team/myapp:v1.2.3

# Pull image
docker pull registry.example.com/team/myapp:v1.2.3`
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Kubernetes Architecture Deep Dive",
    difficulty: "beginner",
    emoji: "🏗️",
    description: "Explore every component of the Kubernetes control plane and worker nodes in detail.",
    topics: ["API Server", "Scheduler", "Controller Manager", "etcd", "Kubelet", "Kube Proxy", "Cluster Networking"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497990309/hGE5paskEp38fsYKPNESZa/k8s-hero-architecture-asuNrmHkCncM3rbdqL4ZVC.webp",
    sections: [
      {
        title: "The Control Plane",
        content: `The Control Plane is the management layer of a Kubernetes cluster. It makes global decisions about the cluster (such as scheduling) and detects and responds to cluster events (such as starting up a new pod when a deployment's replica count is not met). In production, the control plane runs on dedicated nodes, often replicated across multiple availability zones for high availability.`,
      },
      {
        title: "kube-apiserver",
        content: `The **API Server** is the front-end of the Kubernetes control plane. It exposes the Kubernetes API — a RESTful interface that all components and external clients use to interact with the cluster. Every operation (creating a pod, scaling a deployment, checking node status) goes through the API Server.

The API Server validates and processes API requests, persists state to etcd, and serves as the hub through which all other components communicate. It implements authentication, authorization (RBAC), and admission control (webhooks that can validate or mutate API requests before they are persisted).

As of Kubernetes 1.33, the API Server supports aggregated APIs, allowing custom API servers to be registered and served under the main API endpoint.`,
        code: [
          {
            lang: "bash",
            label: "Interacting with the API Server directly",
            code: `# Get the API Server URL
kubectl cluster-info

# Access API directly with kubectl proxy
kubectl proxy --port=8001 &
curl http://localhost:8001/api/v1/namespaces/default/pods

# List all API groups and versions
kubectl api-versions

# List all API resources
kubectl api-resources`
          }
        ]
      },
      {
        title: "kube-scheduler",
        content: `The **Scheduler** watches for newly created pods that have no assigned node and selects a node for them to run on. Scheduling decisions consider: resource requirements (CPU/memory requests), hardware/software/policy constraints, affinity and anti-affinity specifications, data locality, inter-workload interference, and deadlines.

The scheduling process has two phases: **filtering** (finding feasible nodes that meet the pod's requirements) and **scoring** (ranking feasible nodes to find the best placement). The scheduler is extensible via scheduling profiles and plugins, allowing custom scoring and filtering logic.`,
      },
      {
        title: "kube-controller-manager",
        content: `The **Controller Manager** runs a collection of controllers — control loops that watch the state of the cluster and make changes to move the current state toward the desired state. Each controller manages a specific resource type.

Key controllers include: the **Node Controller** (monitors node health and evicts pods from unhealthy nodes), the **ReplicaSet Controller** (ensures the correct number of pod replicas), the **Deployment Controller** (manages rolling updates), the **Service Account Controller** (creates default service accounts in new namespaces), and the **Job Controller** (manages batch jobs to completion).`,
      },
      {
        title: "etcd",
        content: `**etcd** is a distributed, consistent key-value store that serves as Kubernetes' backing store for all cluster data. It stores the entire cluster state: all resource definitions, configuration, secrets, and status information. etcd uses the Raft consensus algorithm to ensure data consistency across multiple replicas.

In production, etcd should run as a cluster of 3 or 5 nodes (odd numbers ensure quorum). Regular etcd backups are critical — losing etcd data without a backup means losing the entire cluster state. etcd performance directly impacts API Server latency, so it should run on fast SSD storage with low-latency network connections.`,
        code: [
          {
            lang: "bash",
            label: "etcd Backup and Restore",
            code: `# Backup etcd (requires etcdctl)
ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-snapshot.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# Verify backup
ETCDCTL_API=3 etcdctl snapshot status /backup/etcd-snapshot.db

# Restore etcd
ETCDCTL_API=3 etcdctl snapshot restore /backup/etcd-snapshot.db \
  --data-dir=/var/lib/etcd-restored`
          }
        ]
      },
      {
        title: "Worker Node Components",
        content: `Each worker node runs three essential components. The **Kubelet** is the primary node agent. It watches for pods assigned to its node via the API Server and ensures the containers described in those pod specs are running and healthy. The Kubelet also reports node and pod status back to the API Server.

The **container runtime** (typically containerd) is responsible for pulling container images and running containers. Kubernetes uses the Container Runtime Interface (CRI) to communicate with runtimes, making the runtime pluggable.

**kube-proxy** is a network proxy that runs on each node and implements the Kubernetes Service concept. It maintains network rules that allow network communication to pods from inside or outside the cluster. Modern clusters often use eBPF-based alternatives like Cilium for improved performance.`,
      }
    ]
  },
  {
    id: 4,
    title: "Setting Up Kubernetes",
    difficulty: "beginner",
    emoji: "⚙️",
    description: "Get a Kubernetes cluster running locally with Minikube or Kind, or on managed cloud services.",
    topics: ["Minikube", "Kind", "Amazon EKS", "Azure AKS", "Google GKE", "kubectl", "First Deployment"],
    sections: [
      {
        title: "Local Setup with Minikube",
        content: `**Minikube** is the most popular tool for running a single-node Kubernetes cluster locally. It supports multiple drivers (Docker, VirtualBox, Hyper-V, KVM) and provides a full Kubernetes environment suitable for development and learning. Minikube includes add-ons for common components like the Dashboard, Ingress controller, and metrics-server.`,
        code: [
          {
            lang: "bash",
            label: "Minikube Setup",
            code: `# Install Minikube (macOS with Homebrew)
brew install minikube

# Start cluster with specific Kubernetes version
minikube start --kubernetes-version=v1.33.0 --cpus=4 --memory=8192

# Enable useful add-ons
minikube addons enable ingress
minikube addons enable metrics-server
minikube addons enable dashboard

# Open the dashboard
minikube dashboard

# Get cluster IP
minikube ip

# Stop the cluster
minikube stop

# Delete the cluster
minikube delete`
          }
        ]
      },
      {
        title: "Local Setup with Kind",
        content: `**Kind** (Kubernetes in Docker) runs Kubernetes clusters using Docker containers as nodes. It is the tool of choice for CI/CD pipelines and testing Kubernetes itself, as it starts faster than Minikube and supports multi-node clusters. Kind is maintained by the Kubernetes SIGs (Special Interest Groups).`,
        code: [
          {
            lang: "yaml",
            label: "Kind Multi-Node Cluster Config",
            code: `# kind-config.yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
- role: worker
- role: worker`
          },
          {
            lang: "bash",
            label: "Kind Commands",
            code: `# Create cluster from config
kind create cluster --config kind-config.yaml --name dev-cluster

# List clusters
kind get clusters

# Load a local Docker image into Kind
kind load docker-image myapp:latest --name dev-cluster

# Delete cluster
kind delete cluster --name dev-cluster`
          }
        ]
      },
      {
        title: "Managed Kubernetes Services",
        content: `For production workloads, managed Kubernetes services eliminate the operational burden of running the control plane. The three major cloud providers each offer a managed service.

**Amazon EKS** (Elastic Kubernetes Service) integrates deeply with AWS services like IAM, VPC, ELB, and EBS. It supports Fargate for serverless pods and Karpenter for intelligent node autoscaling.

**Azure AKS** (Azure Kubernetes Service) offers tight integration with Azure Active Directory, Azure Monitor, and Azure Container Registry. It supports Windows node pools and confidential computing nodes.

**Google Kubernetes Engine (GKE)** is the most mature managed Kubernetes service, given Google's role in creating Kubernetes. GKE Autopilot mode manages node provisioning automatically, offering a fully serverless Kubernetes experience.`,
        code: [
          {
            lang: "bash",
            label: "Create EKS Cluster with eksctl",
            code: `# Install eksctl
brew install eksctl

# Create EKS cluster
eksctl create cluster \
  --name production \
  --region us-east-1 \
  --nodegroup-name workers \
  --node-type m5.xlarge \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 10 \
  --managed

# Update kubeconfig
aws eks update-kubeconfig --name production --region us-east-1`
          }
        ]
      },
      {
        title: "Installing and Configuring kubectl",
        content: `**kubectl** is the command-line tool for interacting with Kubernetes clusters. It communicates with the API Server using the Kubernetes API. kubectl reads cluster connection information from a **kubeconfig** file (default: \`~/.kube/config\`), which can contain credentials and connection details for multiple clusters.`,
        code: [
          {
            lang: "bash",
            label: "kubectl Installation and Configuration",
            code: `# Install kubectl (macOS)
brew install kubectl

# Install kubectl (Linux)
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl && sudo mv kubectl /usr/local/bin/

# View current context
kubectl config current-context

# List all contexts
kubectl config get-contexts

# Switch context
kubectl config use-context my-cluster

# Set default namespace
kubectl config set-context --current --namespace=my-namespace

# Verify cluster access
kubectl cluster-info
kubectl get nodes`
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Core Kubernetes Concepts",
    difficulty: "beginner",
    emoji: "🔷",
    description: "Master the fundamental building blocks: Pods, ReplicaSets, Deployments, StatefulSets, DaemonSets, Jobs, and more.",
    topics: ["Pods", "Labels & Selectors", "Namespaces", "Annotations", "ReplicaSets", "Deployments", "StatefulSets", "DaemonSets", "Jobs & CronJobs"],
    sections: [
      {
        title: "Pods",
        content: `A **Pod** is the smallest deployable unit in Kubernetes. It represents one or more containers that share a network namespace (same IP address and port space) and storage volumes. Containers within a pod communicate via localhost and share the same lifecycle.

While you can run a single container per pod (the most common pattern), multi-container pods are used for sidecar patterns: a main application container paired with a logging agent, a proxy, or an init container that prepares the environment before the main container starts.

Pods are ephemeral — they are not designed to be long-lived. When a pod dies, it is not resurrected; instead, higher-level controllers like Deployments create replacement pods.`,
        code: [
          {
            lang: "yaml",
            label: "Pod with Resource Limits and Health Checks",
            code: `apiVersion: v1
kind: Pod
metadata:
  name: web-app
  labels:
    app: web
    version: "1.0"
spec:
  containers:
  - name: web
    image: nginx:1.27-alpine
    ports:
    - containerPort: 80
    resources:
      requests:
        cpu: "100m"
        memory: "128Mi"
      limits:
        cpu: "500m"
        memory: "256Mi"
    livenessProbe:
      httpGet:
        path: /healthz
        port: 80
      initialDelaySeconds: 10
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /ready
        port: 80
      initialDelaySeconds: 5
      periodSeconds: 5
  - name: log-sidecar
    image: fluent/fluent-bit:3.2
    volumeMounts:
    - name: logs
      mountPath: /var/log/app
  volumes:
  - name: logs
    emptyDir: {}`
          }
        ]
      },
      {
        title: "Labels, Selectors & Namespaces",
        content: `**Labels** are key-value pairs attached to Kubernetes objects. They are used to organize and select subsets of objects. Labels have no semantic meaning to the Kubernetes core but are meaningful to users and to controllers that use label selectors.

**Selectors** allow you to filter objects by their labels. Equality-based selectors (\`app=web\`) and set-based selectors (\`environment in (prod, staging)\`) are both supported.

**Namespaces** provide a mechanism for isolating groups of resources within a single cluster. They are intended for use in environments with many users spread across multiple teams or projects. Resource names need to be unique within a namespace but not across namespaces. Kubernetes starts with four built-in namespaces: \`default\`, \`kube-system\`, \`kube-public\`, and \`kube-node-lease\`.`,
        code: [
          {
            lang: "bash",
            label: "Working with Labels and Namespaces",
            code: `# Create a namespace
kubectl create namespace production

# Apply a resource to a specific namespace
kubectl apply -f deployment.yaml -n production

# Filter pods by label
kubectl get pods -l app=web,environment=production

# Add a label to a running pod
kubectl label pod web-app version=2.0

# Remove a label
kubectl label pod web-app version-

# Get all resources across all namespaces
kubectl get pods --all-namespaces`
          }
        ]
      },
      {
        title: "Deployments",
        content: `A **Deployment** is the recommended way to manage stateless applications in Kubernetes. It provides declarative updates for Pods and ReplicaSets. You describe the desired state in a Deployment, and the Deployment Controller changes the actual state to the desired state at a controlled rate.

Deployments support rolling updates (gradually replacing old pods with new ones), rollbacks (reverting to a previous version), and scaling. The Deployment manages a ReplicaSet under the hood, creating new ReplicaSets for each update while keeping old ones for rollback purposes.`,
        code: [
          {
            lang: "yaml",
            label: "Production Deployment with Rolling Update Strategy",
            code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Max pods above desired count during update
      maxUnavailable: 0  # Zero downtime: no pods removed before new ones ready
  template:
    metadata:
      labels:
        app: web-app
        version: "2.1"
    spec:
      containers:
      - name: web
        image: myapp:2.1.0
        ports:
        - containerPort: 8080
        resources:
          requests:
            cpu: "200m"
            memory: "256Mi"
          limits:
            cpu: "1000m"
            memory: "512Mi"
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5`
          },
          {
            lang: "bash",
            label: "Deployment Management Commands",
            code: `# Apply deployment
kubectl apply -f deployment.yaml

# Check rollout status
kubectl rollout status deployment/web-app

# View rollout history
kubectl rollout history deployment/web-app

# Rollback to previous version
kubectl rollout undo deployment/web-app

# Rollback to specific revision
kubectl rollout undo deployment/web-app --to-revision=2

# Scale deployment
kubectl scale deployment/web-app --replicas=5

# Pause/resume rollout
kubectl rollout pause deployment/web-app
kubectl rollout resume deployment/web-app`
          }
        ]
      },
      {
        title: "StatefulSets",
        content: `**StatefulSets** manage stateful applications that require stable, unique network identifiers, stable persistent storage, and ordered, graceful deployment and scaling. Unlike Deployments, StatefulSet pods have predictable names (e.g., \`mysql-0\`, \`mysql-1\`, \`mysql-2\`) and are created/deleted in order.

StatefulSets are ideal for databases (MySQL, PostgreSQL, MongoDB), distributed systems (Kafka, ZooKeeper, Elasticsearch), and any application that requires persistent identity. Each pod in a StatefulSet gets its own PersistentVolumeClaim, and these claims are not deleted when the StatefulSet is deleted.`,
      },
      {
        title: "DaemonSets & Jobs",
        content: `A **DaemonSet** ensures that a copy of a pod runs on every (or a subset of) node(s) in the cluster. Common use cases include log collectors (Fluentd, Filebeat), monitoring agents (Prometheus Node Exporter), and network plugins (Calico, Cilium). When nodes are added to the cluster, pods are automatically added to them.

A **Job** creates one or more pods and ensures that a specified number of them successfully terminate. Jobs are used for batch processing, data migrations, and one-off tasks. A **CronJob** creates Jobs on a repeating schedule (using standard cron syntax), enabling periodic batch operations like database backups, report generation, and cleanup tasks.`,
        code: [
          {
            lang: "yaml",
            label: "CronJob Example",
            code: `apiVersion: batch/v1
kind: CronJob
metadata:
  name: db-backup
spec:
  schedule: "0 2 * * *"   # Run at 2 AM daily
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
          - name: backup
            image: postgres:16-alpine
            command: ["/bin/sh", "-c"]
            args: ["pg_dump $DATABASE_URL | gzip > /backup/db-$(date +%Y%m%d).sql.gz"]
            env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-credentials
                  key: url
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-pvc`
          }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Working with kubectl",
    difficulty: "intermediate",
    emoji: "💻",
    description: "Master kubectl commands, YAML manifests, imperative vs declarative approaches, and debugging techniques.",
    topics: ["kubectl basics", "Imperative vs Declarative", "YAML structure", "Debugging commands", "Logs & exec"],
    sections: [
      {
        title: "kubectl Fundamentals",
        content: `kubectl follows a consistent command structure: \`kubectl [command] [TYPE] [NAME] [flags]\`. The command is the operation (get, create, apply, delete, describe), TYPE is the resource type (pod, deployment, service), NAME is the resource name (optional), and flags modify behavior.

Understanding the difference between **imperative** and **declarative** approaches is fundamental. Imperative commands tell Kubernetes what to do step by step (\`kubectl create deployment\`). Declarative manifests describe the desired state and let Kubernetes figure out how to achieve it (\`kubectl apply -f\`). For production, always prefer declarative manifests stored in version control.`,
        code: [
          {
            lang: "bash",
            label: "Essential kubectl Commands",
            code: `# --- GETTING RESOURCES ---
kubectl get pods                          # List pods in default namespace
kubectl get pods -n kube-system           # List pods in kube-system
kubectl get pods -o wide                  # Show node assignment
kubectl get pods -o yaml                  # Full YAML output
kubectl get pods --watch                  # Watch for changes
kubectl get all                           # Get all resource types
kubectl get pods,services,deployments     # Multiple resource types

# --- DESCRIBING RESOURCES ---
kubectl describe pod web-app-xyz          # Detailed info + events
kubectl describe node worker-1            # Node details

# --- CREATING/UPDATING ---
kubectl apply -f manifest.yaml            # Declarative apply
kubectl apply -f ./manifests/             # Apply directory
kubectl create deployment nginx --image=nginx:1.27  # Imperative

# --- DELETING ---
kubectl delete pod web-app-xyz
kubectl delete -f manifest.yaml
kubectl delete pods --all -n staging      # Delete all pods in namespace

# --- EDITING ---
kubectl edit deployment web-app           # Opens in $EDITOR`
          }
        ]
      },
      {
        title: "Debugging and Troubleshooting",
        content: `Effective debugging in Kubernetes requires understanding the pod lifecycle and knowing which commands to use at each stage. When a pod is not running as expected, start with \`kubectl describe\` to see events, then check logs, and finally exec into the container if needed.`,
        code: [
          {
            lang: "bash",
            label: "Debugging Commands",
            code: `# View pod logs
kubectl logs web-app-xyz
kubectl logs web-app-xyz -c sidecar       # Specific container
kubectl logs web-app-xyz --previous       # Previous container instance
kubectl logs -f web-app-xyz               # Follow/stream logs
kubectl logs --tail=100 web-app-xyz       # Last 100 lines

# Execute commands in a running container
kubectl exec -it web-app-xyz -- /bin/bash
kubectl exec web-app-xyz -- env           # List environment variables
kubectl exec web-app-xyz -- cat /etc/config/app.conf

# Port-forward for local debugging
kubectl port-forward pod/web-app-xyz 8080:80
kubectl port-forward service/web-service 8080:80
kubectl port-forward deployment/web-app 8080:80

# Copy files to/from pods
kubectl cp web-app-xyz:/var/log/app.log ./app.log
kubectl cp ./config.yaml web-app-xyz:/etc/config/

# Run a debug container (ephemeral containers - K8s 1.23+)
kubectl debug -it web-app-xyz --image=busybox --target=web

# Check resource usage
kubectl top pods
kubectl top nodes`
          }
        ]
      },
      {
        title: "YAML Manifest Structure",
        content: `Every Kubernetes manifest follows the same four-field top-level structure: \`apiVersion\`, \`kind\`, \`metadata\`, and \`spec\`. Understanding this structure is essential for writing and reading any Kubernetes resource.

\`apiVersion\` specifies which API group and version to use. Core resources like Pods use \`v1\`, while apps resources like Deployments use \`apps/v1\`. \`kind\` is the resource type. \`metadata\` contains identifying information (name, namespace, labels, annotations). \`spec\` is the desired state — its structure varies by resource type.`,
        code: [
          {
            lang: "bash",
            label: "Useful kubectl Shortcuts",
            code: `# Generate YAML without applying (dry-run)
kubectl create deployment web --image=nginx --dry-run=client -o yaml

# Diff current vs applied manifest
kubectl diff -f deployment.yaml

# Explain any resource field
kubectl explain pod.spec.containers.resources
kubectl explain deployment.spec.strategy

# Get resource in JSON format for scripting
kubectl get pod web-app-xyz -o json | jq '.status.podIP'

# Use jsonpath for specific fields
kubectl get pods -o jsonpath='{.items[*].metadata.name}'

# Custom columns output
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase,NODE:.spec.nodeName`
          }
        ]
      }
    ]
  },
  {
    id: 7,
    title: "Networking in Kubernetes",
    difficulty: "intermediate",
    emoji: "🌐",
    description: "Understand Kubernetes networking model, Services, DNS, Ingress, and Network Policies.",
    topics: ["Cluster Networking Model", "ClusterIP", "NodePort", "LoadBalancer", "DNS", "Ingress", "Network Policies"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497990309/hGE5paskEp38fsYKPNESZa/k8s-networking_7586b80c.png",
    sections: [
      {
        title: "The Kubernetes Networking Model",
        content: `Kubernetes imposes a fundamental networking requirement: every pod must be able to communicate with every other pod in the cluster without NAT. This flat network model simplifies application design but requires a Container Network Interface (CNI) plugin to implement.

Popular CNI plugins include **Calico** (policy-rich, BGP-based), **Cilium** (eBPF-based, high performance, built-in observability), **Flannel** (simple overlay network), and **Weave Net** (encrypted mesh). Each pod gets its own IP address from the cluster's pod CIDR range.`,
      },
      {
        title: "Services",
        content: `A **Service** is an abstraction that defines a logical set of pods and a policy for accessing them. Services provide stable IP addresses and DNS names for pods, which are ephemeral and change IP when restarted. Services use label selectors to determine which pods they route traffic to.

**ClusterIP** (default): Exposes the service on an internal IP only accessible within the cluster. Used for internal microservice communication.

**NodePort**: Exposes the service on each node's IP at a static port (30000-32767). Accessible from outside the cluster via \`<NodeIP>:<NodePort>\`. Useful for development but not recommended for production.

**LoadBalancer**: Exposes the service externally using a cloud provider's load balancer. The cloud provider provisions an external IP and routes traffic to the NodePort. This is the standard way to expose services in managed Kubernetes.

**ExternalName**: Maps a service to a DNS name, useful for integrating external services into the cluster's DNS.`,
        code: [
          {
            lang: "yaml",
            label: "Service Types",
            code: `# ClusterIP Service (internal only)
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP

---
# LoadBalancer Service (external)
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
spec:
  selector:
    app: frontend
  ports:
  - port: 443
    targetPort: 8443
    protocol: TCP
  type: LoadBalancer`
          }
        ]
      },
      {
        title: "Ingress & Ingress Controllers",
        content: `**Ingress** is an API object that manages external access to services in a cluster, typically HTTP/HTTPS. Ingress provides load balancing, SSL/TLS termination, and name-based virtual hosting — all in a single resource rather than requiring a LoadBalancer service per application.

An **Ingress Controller** is the component that reads Ingress resources and configures a reverse proxy accordingly. Popular controllers include **NGINX Ingress Controller**, **Traefik**, **HAProxy**, and cloud-native options like **AWS ALB Ingress Controller** and **GKE Ingress**. As of 2025, **Gateway API** is the successor to Ingress, offering more expressive routing capabilities.`,
        code: [
          {
            lang: "yaml",
            label: "Ingress with TLS",
            code: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - app.example.com
    secretName: app-tls-cert
  rules:
  - host: app.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80`
          }
        ]
      },
      {
        title: "Network Policies",
        content: `**Network Policies** are Kubernetes resources that control traffic flow between pods and between pods and external endpoints. By default, all pods in a cluster can communicate with all other pods. Network Policies allow you to implement a zero-trust network model by explicitly defining allowed traffic.

A Network Policy uses pod selectors and namespace selectors to define which pods the policy applies to, and ingress/egress rules to define allowed traffic. Policies are additive — if multiple policies select a pod, all rules are combined.`,
        code: [
          {
            lang: "yaml",
            label: "Network Policy: Allow only frontend to backend",
            code: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-allow-frontend
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
  # Allow DNS resolution
  - to: []
    ports:
    - protocol: UDP
      port: 53`
          }
        ]
      }
    ]
  },
  {
    id: 8,
    title: "Storage & Persistence",
    difficulty: "intermediate",
    emoji: "💾",
    description: "Manage stateful workloads with Volumes, PersistentVolumes, PersistentVolumeClaims, and StorageClasses.",
    topics: ["Volumes", "Persistent Volumes (PV)", "Persistent Volume Claims (PVC)", "Storage Classes", "Stateful Storage Patterns"],
    sections: [
      {
        title: "Volumes",
        content: `Kubernetes Volumes solve the problem of data persistence across container restarts. Unlike Docker volumes, Kubernetes volumes are tied to the pod lifecycle — they exist as long as the pod exists. When a container restarts, the volume data persists; when the pod is deleted, the volume is also deleted (unless it's backed by persistent storage).

Common volume types include: **emptyDir** (temporary storage shared between containers in a pod), **configMap/secret** (inject configuration data as files), **hostPath** (mount a directory from the host node — use with caution), **nfs** (mount an NFS share), and **projected** (combine multiple volume sources into a single directory).`,
      },
      {
        title: "PersistentVolumes and PersistentVolumeClaims",
        content: `**PersistentVolumes (PV)** are cluster-level storage resources provisioned by an administrator or dynamically by a StorageClass. They have a lifecycle independent of any individual pod. PVs abstract the underlying storage technology (AWS EBS, GCP PD, Azure Disk, NFS, Ceph) behind a common API.

**PersistentVolumeClaims (PVC)** are requests for storage by users. A PVC specifies the required size, access mode, and optionally a StorageClass. Kubernetes binds PVCs to matching PVs. Access modes include: **ReadWriteOnce** (single node read-write), **ReadOnlyMany** (multiple nodes read-only), **ReadWriteMany** (multiple nodes read-write), and **ReadWriteOncePod** (single pod read-write, K8s 1.22+).`,
        code: [
          {
            lang: "yaml",
            label: "PVC and Pod using Persistent Storage",
            code: `# PersistentVolumeClaim
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-data
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 50Gi

---
# Pod using the PVC
apiVersion: v1
kind: Pod
metadata:
  name: postgres
spec:
  containers:
  - name: postgres
    image: postgres:16-alpine
    env:
    - name: POSTGRES_PASSWORD
      valueFrom:
        secretKeyRef:
          name: postgres-secret
          key: password
    volumeMounts:
    - name: data
      mountPath: /var/lib/postgresql/data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: postgres-data`
          }
        ]
      },
      {
        title: "Storage Classes",
        content: `**StorageClasses** enable dynamic provisioning of PersistentVolumes. Instead of pre-provisioning storage, a StorageClass defines a "class" of storage (e.g., fast SSD, standard HDD, replicated) with a provisioner that automatically creates PVs when a PVC requests that class.

Each cloud provider has its own provisioners: \`ebs.csi.aws.com\` for AWS EBS, \`pd.csi.storage.gke.io\` for GCP Persistent Disk, \`disk.csi.azure.com\` for Azure Disk. The Container Storage Interface (CSI) standardizes how storage plugins are developed and deployed.`,
        code: [
          {
            lang: "yaml",
            label: "StorageClass Definition",
            code: `apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
  annotations:
    storageclass.kubernetes.io/is-default-class: "false"
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
  iops: "3000"
  throughput: "125"
  encrypted: "true"
reclaimPolicy: Retain      # Keep PV after PVC deletion
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer  # Provision in same AZ as pod`
          }
        ]
      }
    ]
  },
  {
    id: 9,
    title: "Configuration Management",
    difficulty: "intermediate",
    emoji: "🔧",
    description: "Manage application configuration and secrets using ConfigMaps, Secrets, and environment variables.",
    topics: ["ConfigMaps", "Secrets", "Environment Variables", "Secure Secret Management"],
    sections: [
      {
        title: "ConfigMaps",
        content: `**ConfigMaps** store non-confidential configuration data as key-value pairs. They decouple environment-specific configuration from container images, enabling the same image to run in development, staging, and production with different configurations.

ConfigMaps can be consumed by pods as environment variables, command-line arguments, or as files in a volume. When a ConfigMap is updated, pods using it as a volume will see the updated values within a short period (typically under a minute), while pods using it as environment variables require a restart.`,
        code: [
          {
            lang: "yaml",
            label: "ConfigMap Definition and Usage",
            code: `# ConfigMap with multiple data types
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  # Simple key-value
  LOG_LEVEL: "info"
  MAX_CONNECTIONS: "100"
  # Multi-line file content
  app.properties: |
    server.port=8080
    cache.ttl=300
    feature.flags=dark-mode,new-ui
  nginx.conf: |
    server {
      listen 80;
      location / { proxy_pass http://backend:8080; }
    }

---
# Pod consuming ConfigMap
spec:
  containers:
  - name: app
    image: myapp:1.0
    envFrom:
    - configMapRef:
        name: app-config   # All keys become env vars
    volumeMounts:
    - name: config-files
      mountPath: /etc/config
  volumes:
  - name: config-files
    configMap:
      name: app-config
      items:
      - key: nginx.conf
        path: nginx.conf`
          }
        ]
      },
      {
        title: "Secrets",
        content: `**Secrets** store sensitive data such as passwords, OAuth tokens, and SSH keys. They are similar to ConfigMaps but are base64-encoded and have additional access controls. By default, Kubernetes Secrets are stored unencrypted in etcd — enabling encryption at rest and using external secret management systems is strongly recommended for production.

Secret types include: **Opaque** (arbitrary user-defined data), **kubernetes.io/dockerconfigjson** (Docker registry credentials), **kubernetes.io/tls** (TLS certificates), and **kubernetes.io/service-account-token** (service account tokens).`,
        code: [
          {
            lang: "yaml",
            label: "Secret Creation and Usage",
            code: `# Create secret from literal values
kubectl create secret generic db-credentials \
  --from-literal=username=admin \
  --from-literal=password='S3cur3P@ss!'

# Create TLS secret
kubectl create secret tls app-tls \
  --cert=tls.crt \
  --key=tls.key

# Secret manifest (values are base64-encoded)
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
stringData:          # Use stringData for plain text (auto-encoded)
  username: admin
  password: S3cur3P@ss!

---
# Using secrets in a pod
spec:
  containers:
  - name: app
    env:
    - name: DB_USERNAME
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: username
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: password`
          }
        ]
      },
      {
        title: "Secure Secret Management",
        content: `Native Kubernetes Secrets have limitations: they are only base64-encoded (not encrypted), and any user with RBAC access to the namespace can read them. For production security, use external secret management solutions.

**HashiCorp Vault** with the Vault Agent Injector or the Vault Secrets Operator can inject secrets directly into pods without storing them in Kubernetes. **AWS Secrets Manager** and **Azure Key Vault** integrate via the Secrets Store CSI Driver. **External Secrets Operator** synchronizes secrets from external systems into Kubernetes Secrets, providing a Kubernetes-native API while storing secrets externally.

Always enable etcd encryption at rest, use RBAC to restrict secret access, audit secret access with audit logging, and rotate secrets regularly.`,
      }
    ]
  },
  {
    id: 10,
    title: "Scaling & Resource Management",
    difficulty: "intermediate",
    emoji: "📈",
    description: "Implement autoscaling with HPA, VPA, and Cluster Autoscaler. Manage resource requests, limits, and QoS classes.",
    topics: ["HPA", "VPA", "Cluster Autoscaler", "Resource Requests & Limits", "QoS Classes"],
    sections: [
      {
        title: "Horizontal Pod Autoscaler (HPA)",
        content: `The **Horizontal Pod Autoscaler** automatically scales the number of pod replicas in a Deployment, ReplicaSet, or StatefulSet based on observed CPU utilization, memory utilization, or custom metrics. HPA queries the Metrics Server (or custom metrics adapter) at regular intervals and adjusts the replica count to maintain the target metric value.

HPA v2 (stable since Kubernetes 1.23) supports multiple metrics simultaneously, including custom metrics from Prometheus via the custom metrics API, and external metrics from cloud provider services.`,
        code: [
          {
            lang: "yaml",
            label: "HPA with CPU and Custom Metrics",
            code: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: AverageValue
        averageValue: 400Mi
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Pods
        value: 4
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300  # Wait 5 min before scaling down`
          }
        ]
      },
      {
        title: "Vertical Pod Autoscaler (VPA)",
        content: `The **Vertical Pod Autoscaler** automatically adjusts the CPU and memory resource requests for pods based on historical usage. Unlike HPA which adds/removes pods, VPA resizes individual pods. VPA operates in three modes: **Off** (recommendations only), **Initial** (sets resources at pod creation), and **Auto** (updates resources by evicting and recreating pods).

VPA and HPA should not both target CPU/memory for the same deployment simultaneously, as they can conflict. A common pattern is to use VPA for right-sizing and HPA for scaling based on custom application metrics.`,
      },
      {
        title: "Resource Requests, Limits & QoS",
        content: `**Resource requests** are the minimum amount of CPU/memory a container needs. The scheduler uses requests to decide which node to place a pod on. **Resource limits** are the maximum amount a container can use. If a container exceeds its memory limit, it is OOMKilled; if it exceeds its CPU limit, it is throttled.

Kubernetes assigns pods to one of three **Quality of Service (QoS) classes** based on their resource configuration. **Guaranteed** pods have equal requests and limits for all containers — they are the last to be evicted under pressure. **Burstable** pods have requests lower than limits — they are evicted after BestEffort pods. **BestEffort** pods have no requests or limits — they are the first to be evicted.`,
        code: [
          {
            lang: "yaml",
            label: "Guaranteed QoS Pod",
            code: `# Guaranteed QoS: requests == limits for all containers
spec:
  containers:
  - name: app
    resources:
      requests:
        cpu: "500m"
        memory: "512Mi"
      limits:
        cpu: "500m"      # Same as request = Guaranteed
        memory: "512Mi"  # Same as request = Guaranteed`
          }
        ]
      }
    ]
  },
  {
    id: 11,
    title: "Deployment Strategies",
    difficulty: "intermediate",
    emoji: "🚀",
    description: "Master rolling updates, blue-green deployments, canary releases, and recreate strategies.",
    topics: ["Rolling Updates", "Recreate Strategy", "Blue-Green Deployments", "Canary Deployments"],
    sections: [
      {
        title: "Rolling Updates",
        content: `The **Rolling Update** strategy is the default for Kubernetes Deployments. It gradually replaces old pods with new ones, ensuring that a minimum number of pods remain available throughout the update. The \`maxUnavailable\` parameter controls how many pods can be unavailable during the update, and \`maxSurge\` controls how many extra pods can be created above the desired count.

Rolling updates provide zero-downtime deployments for most applications. The key requirement is that the new version must be backward-compatible with the old version during the transition period, as both versions run simultaneously.`,
      },
      {
        title: "Blue-Green Deployments",
        content: `**Blue-Green deployment** maintains two identical production environments: blue (current) and green (new). Traffic is switched from blue to green all at once by updating the Service selector. This enables instant rollback (switch back to blue) and eliminates the mixed-version period of rolling updates.

The trade-off is resource cost — you need double the infrastructure during the transition. Blue-green is ideal for applications that cannot tolerate mixed-version states, such as those with database schema changes that are not backward-compatible.`,
        code: [
          {
            lang: "yaml",
            label: "Blue-Green Service Switch",
            code: `# Blue deployment (current)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
      version: blue
  template:
    metadata:
      labels:
        app: web-app
        version: blue
    spec:
      containers:
      - name: web
        image: myapp:1.0.0

---
# Service pointing to blue
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
spec:
  selector:
    app: web-app
    version: blue    # Switch to "green" to cut over
  ports:
  - port: 80
    targetPort: 8080`
          }
        ]
      },
      {
        title: "Canary Deployments",
        content: `**Canary deployment** gradually shifts traffic to the new version, starting with a small percentage (e.g., 5%) and increasing as confidence grows. This limits the blast radius of a bad release — only a fraction of users are affected if the new version has issues.

In Kubernetes, basic canary deployments can be implemented by running two Deployments (stable and canary) with different replica counts. For more sophisticated traffic splitting (by percentage, header, or user segment), use a service mesh like Istio or a traffic management tool like Argo Rollouts.`,
        code: [
          {
            lang: "yaml",
            label: "Canary with Argo Rollouts",
            code: `apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: web-app
spec:
  replicas: 10
  strategy:
    canary:
      steps:
      - setWeight: 10    # 10% to canary
      - pause: {duration: 5m}
      - setWeight: 30    # 30% to canary
      - pause: {duration: 10m}
      - setWeight: 60
      - pause: {duration: 10m}
      - setWeight: 100   # Full rollout
      canaryService: web-app-canary
      stableService: web-app-stable
      analysis:
        templates:
        - templateName: success-rate
        startingStep: 2`
          }
        ]
      }
    ]
  },
  {
    id: 12,
    title: "Observability & Monitoring",
    difficulty: "advanced",
    emoji: "📊",
    description: "Implement comprehensive observability with logging, metrics, Prometheus, Grafana, and distributed tracing.",
    topics: ["Logging Concepts", "Metrics & Monitoring", "Prometheus", "Grafana", "Distributed Tracing (Jaeger)", "Alerting"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497990309/hGE5paskEp38fsYKPNESZa/k8s-monitoring_6815d301.png",
    sections: [
      {
        title: "The Three Pillars of Observability",
        content: `Observability in Kubernetes is built on three pillars: **logs** (discrete events with timestamps), **metrics** (numerical measurements over time), and **traces** (records of requests as they flow through distributed systems). Together, these give you the ability to understand your system's behavior and diagnose issues.

In Kubernetes, logs are typically collected from pod stdout/stderr by a DaemonSet-based log collector (Fluentd, Fluent Bit, or Vector) and shipped to a centralized log store (Elasticsearch, Loki, or CloudWatch). Metrics are scraped by Prometheus from pods and nodes. Traces are collected by instrumented applications and sent to a tracing backend like Jaeger or Tempo.`,
      },
      {
        title: "Prometheus",
        content: `**Prometheus** is the de-facto standard for metrics collection in Kubernetes. It uses a pull model — Prometheus scrapes metrics from HTTP endpoints exposed by applications and Kubernetes components. The **kube-prometheus-stack** Helm chart deploys Prometheus, Alertmanager, and Grafana together with pre-configured dashboards and alerts.

Prometheus stores metrics in a time-series database with a powerful query language called **PromQL**. Key metrics to monitor include: pod CPU/memory usage, request rate and error rate (RED method), saturation, and availability (four golden signals).`,
        code: [
          {
            lang: "yaml",
            label: "ServiceMonitor for Prometheus Scraping",
            code: `# ServiceMonitor tells Prometheus which services to scrape
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: web-app-monitor
  labels:
    release: prometheus  # Must match Prometheus selector
spec:
  selector:
    matchLabels:
      app: web-app
  endpoints:
  - port: metrics
    path: /metrics
    interval: 30s
    scrapeTimeout: 10s`
          },
          {
            lang: "bash",
            label: "Useful PromQL Queries",
            code: `# Request rate (per second, 5-minute window)
rate(http_requests_total[5m])

# Error rate percentage
rate(http_requests_total{status=~"5.."}[5m]) 
  / rate(http_requests_total[5m]) * 100

# Pod CPU usage
rate(container_cpu_usage_seconds_total{container!=""}[5m])

# Memory usage by pod
container_memory_working_set_bytes{container!=""}

# Pod restart count
kube_pod_container_status_restarts_total`
          }
        ]
      },
      {
        title: "Distributed Tracing with Jaeger",
        content: `**Distributed tracing** tracks requests as they flow through multiple microservices, helping identify latency bottlenecks and failure points. Each request gets a unique trace ID, and each service adds spans (units of work) to the trace.

**Jaeger** (CNCF graduated project) and **Tempo** (Grafana's tracing backend) are popular choices. Applications must be instrumented with OpenTelemetry — the CNCF standard for telemetry data collection. OpenTelemetry provides SDKs for all major languages and can export to Jaeger, Tempo, Zipkin, and cloud provider tracing services.`,
      },
      {
        title: "Alerting Strategies",
        content: `Effective alerting requires alerting on symptoms (user-visible impact) rather than causes (internal metrics). The **Alertmanager** component of the Prometheus stack handles alert routing, deduplication, grouping, and silencing.

Key alerting principles: alert on SLO burn rate (how fast you are consuming your error budget), use multi-window multi-burn-rate alerts to catch both fast and slow burns, define clear runbooks for every alert, and avoid alert fatigue by only paging for actionable, urgent issues.`,
        code: [
          {
            lang: "yaml",
            label: "PrometheusRule Alert Definition",
            code: `apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: web-app-alerts
spec:
  groups:
  - name: web-app.rules
    rules:
    - alert: HighErrorRate
      expr: |
        rate(http_requests_total{status=~"5.."}[5m])
        / rate(http_requests_total[5m]) > 0.05
      for: 5m
      labels:
        severity: critical
      annotations:
        summary: "High error rate on {{ $labels.service }}"
        description: "Error rate is {{ $value | humanizePercentage }}"
        runbook: "https://runbooks.example.com/high-error-rate"
    - alert: PodCrashLooping
      expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
      for: 5m
      labels:
        severity: warning`
          }
        ]
      }
    ]
  },
  {
    id: 13,
    title: "Security in Kubernetes",
    difficulty: "advanced",
    emoji: "🔐",
    description: "Secure your clusters with RBAC, Pod Security Standards, network security, image scanning, and runtime security.",
    topics: ["Authentication & Authorization", "RBAC", "Pod Security Standards", "Network Security", "Secrets Management", "Image Scanning", "Runtime Security"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497990309/hGE5paskEp38fsYKPNESZa/k8s-security-shield_44534a37.png",
    sections: [
      {
        title: "Authentication & Authorization",
        content: `Kubernetes supports multiple authentication methods: **X.509 client certificates** (used by kubeconfig), **Bearer tokens** (service account tokens, OIDC tokens), **Bootstrap tokens** (for node bootstrapping), and **Webhook token authentication** (for external identity providers like LDAP or Active Directory).

After authentication, authorization determines what an authenticated user can do. Kubernetes supports RBAC (Role-Based Access Control), ABAC (Attribute-Based Access Control), Node authorization, and Webhook authorization. RBAC is the standard and recommended approach.`,
      },
      {
        title: "RBAC (Role-Based Access Control)",
        content: `RBAC uses four API objects: **Role** (namespace-scoped permissions), **ClusterRole** (cluster-wide permissions), **RoleBinding** (grants a Role to a subject in a namespace), and **ClusterRoleBinding** (grants a ClusterRole cluster-wide).

Subjects can be users (human operators), groups (sets of users), or service accounts (identities for pods). The principle of least privilege should guide all RBAC configurations — grant only the minimum permissions required.`,
        code: [
          {
            lang: "yaml",
            label: "RBAC Role and RoleBinding",
            code: `# Role: read-only access to pods and logs in a namespace
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: production
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["apps"]
  resources: ["deployments", "replicasets"]
  verbs: ["get", "list", "watch"]

---
# RoleBinding: grant role to a user
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods-binding
  namespace: production
subjects:
- kind: User
  name: alice@example.com
  apiGroup: rbac.authorization.k8s.io
- kind: ServiceAccount
  name: monitoring-agent
  namespace: monitoring
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io`
          },
          {
            lang: "bash",
            label: "RBAC Audit Commands",
            code: `# Check what a user can do
kubectl auth can-i create deployments --as alice@example.com -n production
kubectl auth can-i '*' '*'  # Check if you're cluster-admin

# List all permissions for a service account
kubectl auth can-i --list --as=system:serviceaccount:default:my-sa

# Audit RBAC with rakkess (third-party tool)
kubectl access-matrix -n production`
          }
        ]
      },
      {
        title: "Pod Security Standards",
        content: `**Pod Security Standards (PSS)** replaced the deprecated PodSecurityPolicy in Kubernetes 1.25. PSS defines three policy levels applied via the **Pod Security Admission** controller:

**Privileged**: No restrictions — for system and infrastructure workloads. **Baseline**: Prevents known privilege escalations — suitable for most applications. **Restricted**: Heavily restricted, following current pod hardening best practices — requires running as non-root, dropping all capabilities, using read-only root filesystem.

Policies are applied at the namespace level using labels, with three modes: **enforce** (reject violating pods), **audit** (log violations), and **warn** (warn but allow).`,
        code: [
          {
            lang: "bash",
            label: "Apply Pod Security Standards to Namespace",
            code: `# Apply restricted policy to namespace
kubectl label namespace production \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/enforce-version=latest \
  pod-security.kubernetes.io/warn=restricted \
  pod-security.kubernetes.io/audit=restricted`
          }
        ]
      },
      {
        title: "Image Security & Runtime Protection",
        content: `Container image security is a critical layer of defense. **Image scanning** tools like Trivy, Grype, or Snyk analyze images for known CVEs in OS packages and application dependencies. Integrate scanning into CI/CD pipelines to catch vulnerabilities before deployment.

**Image signing** with Sigstore/Cosign ensures that only trusted, verified images are deployed. The **Admission Controller** can enforce image signature verification using tools like Kyverno or OPA Gatekeeper.

**Runtime security** tools like Falco monitor system calls at runtime and alert on suspicious behavior (e.g., a container spawning a shell, writing to unexpected paths, or making unexpected network connections). Falco rules can be customized to match your application's expected behavior.`,
      }
    ]
  },
  {
    id: 14,
    title: "Helm & Package Management",
    difficulty: "advanced",
    emoji: "⛵",
    description: "Use Helm to package, version, and deploy Kubernetes applications with reusable chart templates.",
    topics: ["What is Helm", "Charts & Templates", "Helm Repositories", "Deploying Apps with Helm"],
    sections: [
      {
        title: "What is Helm?",
        content: `**Helm** is the package manager for Kubernetes. It allows you to define, install, and upgrade complex Kubernetes applications using **charts** — packages of pre-configured Kubernetes resources. Helm solves the problem of managing many related Kubernetes manifests as a single unit, with parameterization for different environments.

Helm 3 (the current version) removed the server-side Tiller component from Helm 2, making it more secure by using the user's kubeconfig credentials directly. Helm stores release state in Kubernetes Secrets within the target namespace.`,
        code: [
          {
            lang: "bash",
            label: "Helm Essentials",
            code: `# Install Helm
brew install helm

# Add a chart repository
helm repo add stable https://charts.helm.sh/stable
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Search for charts
helm search repo nginx
helm search hub postgresql

# Install a chart
helm install my-nginx bitnami/nginx \
  --namespace web \
  --create-namespace \
  --set replicaCount=3 \
  --set service.type=LoadBalancer

# Install with values file
helm install my-app ./my-chart -f values-prod.yaml

# List releases
helm list -A

# Upgrade a release
helm upgrade my-nginx bitnami/nginx --set replicaCount=5

# Rollback
helm rollback my-nginx 1

# Uninstall
helm uninstall my-nginx -n web`
          }
        ]
      },
      {
        title: "Charts & Templates",
        content: `A Helm chart is a directory with a specific structure: \`Chart.yaml\` (metadata), \`values.yaml\` (default configuration), \`templates/\` (Kubernetes manifests with Go template syntax), and optionally \`charts/\` (sub-charts/dependencies).

Helm templates use Go's \`text/template\` package with Sprig functions. The \`{{ .Values.xxx }}\` syntax injects values from \`values.yaml\` or user-provided overrides. The \`_helpers.tpl\` file defines reusable template fragments.`,
        code: [
          {
            lang: "yaml",
            label: "Helm Chart Template Example",
            code: `# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "myapp.fullname" . }}
  labels:
    {{- include "myapp.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "myapp.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "myapp.selectorLabels" . | nindent 8 }}
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
        ports:
        - containerPort: {{ .Values.service.targetPort }}
        resources:
          {{- toYaml .Values.resources | nindent 10 }}
        {{- if .Values.env }}
        env:
          {{- range $key, $val := .Values.env }}
          - name: {{ $key }}
            value: {{ $val | quote }}
          {{- end }}
        {{- end }}`
          }
        ]
      }
    ]
  },
  {
    id: 15,
    title: "CI/CD with Kubernetes",
    difficulty: "advanced",
    emoji: "🔄",
    description: "Build automated deployment pipelines with GitOps, Argo CD, Jenkins, and GitHub Actions.",
    topics: ["CI/CD Fundamentals", "Kubernetes Deployment Pipelines", "GitOps", "Argo CD", "Jenkins", "GitHub Actions"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497990309/hGE5paskEp38fsYKPNESZa/k8s-cicd-pipeline_ca7ccef9.png",
    sections: [
      {
        title: "GitOps with Argo CD",
        content: `**GitOps** is an operational model where Git is the single source of truth for declarative infrastructure and application configuration. Changes to the cluster are made by committing to Git, and an automated agent (like Argo CD) continuously reconciles the cluster state with the Git repository.

**Argo CD** is a declarative, GitOps continuous delivery tool for Kubernetes. It monitors Git repositories and automatically applies changes to the cluster. Argo CD provides a web UI for visualizing application state, a CLI for operations, and supports Helm, Kustomize, and plain YAML.`,
        code: [
          {
            lang: "bash",
            label: "Argo CD Setup",
            code: `# Install Argo CD
kubectl create namespace argocd
kubectl apply -n argocd -f \
  https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d

# Port-forward to access UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Login with CLI
argocd login localhost:8080

# Create an application
argocd app create web-app \
  --repo https://github.com/myorg/k8s-manifests \
  --path apps/web-app \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace production \
  --sync-policy automated \
  --auto-prune \
  --self-heal`
          }
        ]
      },
      {
        title: "GitHub Actions Pipeline",
        content: `**GitHub Actions** provides a powerful CI/CD platform tightly integrated with GitHub repositories. A typical Kubernetes deployment pipeline includes: building and testing the application, building and scanning the container image, pushing to a registry, updating the Kubernetes manifest (or Helm values) with the new image tag, and triggering Argo CD to sync.`,
        code: [
          {
            lang: "yaml",
            label: "GitHub Actions K8s Deployment Workflow",
            code: `name: Build and Deploy

on:
  push:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: github.repository

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write

    steps:
    - uses: actions/checkout@v4

    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        push: true
        tags: REGISTRY/IMAGE_NAME:SHA

    - name: Scan image for vulnerabilities
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: REGISTRY/IMAGE_NAME:SHA
        severity: 'CRITICAL,HIGH'
        exit-code: '1'

    - name: Update Kubernetes manifest
      run: |
        sed -i "s|image:.*|image: REGISTRY/IMAGE_NAME:SHA|" \
          k8s/deployment.yaml
        git config user.email "ci@example.com"
        git config user.name "CI Bot"
        git add k8s/deployment.yaml
        git commit -m "ci: update image to SHA"
        git push`
          }
        ]
      }
    ]
  },
  {
    id: 16,
    title: "Service Mesh",
    difficulty: "advanced",
    emoji: "🕸️",
    description: "Implement advanced traffic management, observability, and security with Istio service mesh.",
    topics: ["What is a Service Mesh?", "Istio Overview", "Traffic Management", "Observability & Security in Mesh"],
    sections: [
      {
        title: "What is a Service Mesh?",
        content: `A **service mesh** is a dedicated infrastructure layer for handling service-to-service communication in a microservices architecture. It provides features like mutual TLS (mTLS) for encryption and authentication, advanced traffic management (canary releases, circuit breaking, retries), and deep observability (metrics, traces, logs) — all without modifying application code.

The mesh works by injecting a sidecar proxy (typically Envoy) into each pod. These proxies intercept all network traffic and implement the mesh's features. The control plane (Istiod in Istio) configures the proxies and collects telemetry.`,
      },
      {
        title: "Istio Traffic Management",
        content: `**Istio** is the most widely adopted service mesh for Kubernetes. Its traffic management features include: **VirtualServices** (define routing rules for traffic), **DestinationRules** (define policies for traffic to a destination), **Gateways** (manage ingress/egress traffic), and **ServiceEntries** (add external services to the mesh registry).

As of 2025, Istio's **Ambient Mesh** mode (stable in Istio 1.22) eliminates the sidecar injection requirement by using a node-level proxy (ztunnel) for L4 features and optional waypoint proxies for L7 features, significantly reducing resource overhead.`,
        code: [
          {
            lang: "yaml",
            label: "Istio VirtualService for Canary",
            code: `apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: web-app
spec:
  hosts:
  - web-app
  http:
  - match:
    - headers:
        x-canary:
          exact: "true"
    route:
    - destination:
        host: web-app
        subset: v2
  - route:
    - destination:
        host: web-app
        subset: v1
      weight: 90
    - destination:
        host: web-app
        subset: v2
      weight: 10  # 10% canary traffic

---
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: web-app
spec:
  host: web-app
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2`
          }
        ]
      }
    ]
  },
  {
    id: 17,
    title: "Advanced Scheduling",
    difficulty: "advanced",
    emoji: "📅",
    description: "Control pod placement with taints, tolerations, node affinity, pod affinity, and custom schedulers.",
    topics: ["Taints & Tolerations", "Node Affinity", "Pod Affinity", "Custom Schedulers", "Batch Workload Optimization"],
    sections: [
      {
        title: "Taints & Tolerations",
        content: `**Taints** are applied to nodes to repel pods that don't explicitly tolerate the taint. They are used to dedicate nodes for specific workloads (e.g., GPU nodes, spot instances, nodes with sensitive data). A taint has three effects: **NoSchedule** (don't schedule new pods), **PreferNoSchedule** (avoid scheduling if possible), and **NoExecute** (evict existing pods that don't tolerate the taint).

**Tolerations** are applied to pods to allow (but not require) them to be scheduled on nodes with matching taints.`,
        code: [
          {
            lang: "bash",
            label: "Taints and Tolerations",
            code: `# Taint a node for GPU workloads only
kubectl taint nodes gpu-node-1 gpu=true:NoSchedule

# Taint spot instances to prefer on-demand for critical workloads
kubectl taint nodes spot-node-1 spot=true:PreferNoSchedule

# Remove a taint
kubectl taint nodes gpu-node-1 gpu=true:NoSchedule-`
          },
          {
            lang: "yaml",
            label: "Pod with Toleration",
            code: `spec:
  tolerations:
  - key: "gpu"
    operator: "Equal"
    value: "true"
    effect: "NoSchedule"
  nodeSelector:
    accelerator: nvidia-tesla-v100`
          }
        ]
      },
      {
        title: "Node & Pod Affinity",
        content: `**Node Affinity** allows you to constrain which nodes a pod can be scheduled on based on node labels. It is more expressive than nodeSelector, supporting \`In\`, \`NotIn\`, \`Exists\`, \`DoesNotExist\`, \`Gt\`, and \`Lt\` operators. \`requiredDuringSchedulingIgnoredDuringExecution\` is a hard requirement; \`preferredDuringSchedulingIgnoredDuringExecution\` is a soft preference.

**Pod Affinity and Anti-Affinity** allow you to constrain pod placement based on the labels of other pods already running on nodes. Anti-affinity is commonly used to spread replicas across nodes or availability zones for high availability.`,
        code: [
          {
            lang: "yaml",
            label: "Pod Anti-Affinity for HA",
            code: `spec:
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - web-app
        topologyKey: kubernetes.io/hostname  # One pod per node
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        preference:
          matchExpressions:
          - key: topology.kubernetes.io/zone
            operator: In
            values:
            - us-east-1a
            - us-east-1b`
          }
        ]
      }
    ]
  },
  {
    id: 18,
    title: "Multi-Cluster & Federation",
    difficulty: "advanced",
    emoji: "🌍",
    description: "Design and operate multi-cluster architectures for high availability, disaster recovery, and geographic distribution.",
    topics: ["Multi-Cluster Architecture", "Federation Concepts", "Cross-Cluster Communication"],
    sections: [
      {
        title: "Multi-Cluster Architecture Patterns",
        content: `Multi-cluster Kubernetes architectures address limitations of single clusters: blast radius isolation, regulatory compliance (data sovereignty), geographic distribution for latency, and independent upgrade cycles. Common patterns include:

**Hub-and-Spoke**: A central management cluster (hub) manages multiple workload clusters (spokes). Tools like Argo CD, Rancher, and Cluster API implement this pattern. **Active-Active**: Multiple clusters serve production traffic simultaneously, with traffic distributed by a global load balancer. **Active-Passive**: One cluster serves traffic while another is on standby for disaster recovery.`,
      },
      {
        title: "Cross-Cluster Communication",
        content: `Enabling services to communicate across clusters requires solving service discovery and network connectivity. **Submariner** creates secure tunnels between cluster networks. **Istio multi-cluster** extends the service mesh across clusters, enabling transparent cross-cluster service calls with mTLS. **Skupper** provides a Layer 7 service interconnect without requiring VPN or direct network connectivity.

**Cluster API (CAPI)** is the Kubernetes-native way to provision and manage clusters, treating clusters as Kubernetes resources. It supports multiple infrastructure providers (AWS, GCP, Azure, vSphere) and enables GitOps-driven cluster lifecycle management.`,
      }
    ]
  },
  {
    id: 19,
    title: "Kubernetes API & Extensibility",
    difficulty: "advanced",
    emoji: "🔌",
    description: "Extend Kubernetes with Custom Resource Definitions, Operators, and custom controllers.",
    topics: ["Kubernetes API Fundamentals", "Custom Resource Definitions (CRDs)", "Operators Pattern", "Building Controllers"],
    sections: [
      {
        title: "Custom Resource Definitions (CRDs)",
        content: `**Custom Resource Definitions (CRDs)** allow you to extend the Kubernetes API with your own resource types. Once a CRD is created, you can create, read, update, and delete instances of the custom resource using kubectl and the Kubernetes API, just like built-in resources.

CRDs are the foundation of the Operator pattern. Popular software that ships as CRDs includes Prometheus (PrometheusRule, ServiceMonitor), Argo CD (Application, AppProject), Cert-Manager (Certificate, Issuer), and Istio (VirtualService, DestinationRule).`,
        code: [
          {
            lang: "yaml",
            label: "Custom Resource Definition",
            code: `apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: databases.example.com
spec:
  group: example.com
  versions:
  - name: v1
    served: true
    storage: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              engine:
                type: string
                enum: [postgres, mysql, mongodb]
              version:
                type: string
              replicas:
                type: integer
                minimum: 1
                maximum: 5
              storage:
                type: string
  scope: Namespaced
  names:
    plural: databases
    singular: database
    kind: Database
    shortNames:
    - db`
          }
        ]
      },
      {
        title: "The Operator Pattern",
        content: `An **Operator** is a method of packaging, deploying, and managing a Kubernetes application using CRDs and custom controllers. Operators encode operational knowledge (how to install, configure, upgrade, backup, and recover an application) into software.

The **Operator SDK** (part of the Operator Framework) provides tools for building operators in Go, Ansible, or Helm. The **OperatorHub.io** marketplace hosts hundreds of community and vendor operators. Mature operators implement the full lifecycle: install, upgrade, backup/restore, scaling, and failure recovery.`,
        code: [
          {
            lang: "go",
            label: "Operator Controller Reconcile Loop (Go)",
            code: `// Reconcile is the main controller loop
func (r *DatabaseReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    log := log.FromContext(ctx)
    
    // Fetch the Database instance
    db := &examplev1.Database{}
    if err := r.Get(ctx, req.NamespacedName, db); err != nil {
        return ctrl.Result{}, client.IgnoreNotFound(err)
    }
    
    // Check if StatefulSet exists, create if not
    found := &appsv1.StatefulSet{}
    err := r.Get(ctx, types.NamespacedName{Name: db.Name, Namespace: db.Namespace}, found)
    if err != nil && errors.IsNotFound(err) {
        sts := r.statefulSetForDatabase(db)
        log.Info("Creating StatefulSet", "name", sts.Name)
        return ctrl.Result{}, r.Create(ctx, sts)
    }
    
    // Update status
    db.Status.Phase = "Running"
    r.Status().Update(ctx, db)
    
    return ctrl.Result{RequeueAfter: time.Minute * 5}, nil
}`
          }
        ]
      }
    ]
  },
  {
    id: 20,
    title: "Performance Optimization",
    difficulty: "expert",
    emoji: "⚡",
    description: "Tune cluster performance, optimize resource utilization, and reduce cloud costs.",
    topics: ["Cluster Performance Tuning", "Resource Optimization", "Cost Optimization Strategies"],
    sections: [
      {
        title: "Cluster Performance Tuning",
        content: `Kubernetes cluster performance optimization involves tuning at multiple layers: the control plane (API Server, etcd), the data plane (node configuration, CNI), and the workload level (pod configuration, resource requests).

**etcd performance** is critical — use SSDs, monitor disk I/O latency (should be under 10ms), and defragment etcd regularly. **API Server** performance can be improved by tuning request rate limits, enabling API priority and fairness (APF), and caching. **Node performance** benefits from using the correct kubelet configuration for your workload type (latency-sensitive vs throughput-oriented).`,
      },
      {
        title: "Cost Optimization",
        content: `Kubernetes cost optimization focuses on eliminating waste and improving utilization. Key strategies include:

**Right-sizing**: Use VPA recommendations to set accurate resource requests. Oversized requests waste capacity; undersized requests cause performance issues. **Spot/Preemptible instances**: Run fault-tolerant workloads on spot instances (up to 90% cheaper). Use Karpenter or Cluster Autoscaler with spot instance support. **Namespace-level budgets**: Use LimitRange and ResourceQuota to prevent resource sprawl. **Idle resource cleanup**: Automatically scale down or delete unused deployments, namespaces, and PVCs in non-production environments using tools like Kube-Downscaler.`,
        code: [
          {
            lang: "yaml",
            label: "ResourceQuota for Cost Control",
            code: `apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-quota
  namespace: team-alpha
spec:
  hard:
    requests.cpu: "20"
    requests.memory: 40Gi
    limits.cpu: "40"
    limits.memory: 80Gi
    persistentvolumeclaims: "10"
    requests.storage: 500Gi
    count/deployments.apps: "20"
    count/services: "10"

---
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: team-alpha
spec:
  limits:
  - default:
      cpu: "500m"
      memory: "256Mi"
    defaultRequest:
      cpu: "100m"
      memory: "128Mi"
    type: Container`
          }
        ]
      }
    ]
  },
  {
    id: 21,
    title: "Troubleshooting & Debugging",
    difficulty: "expert",
    emoji: "🔍",
    description: "Diagnose and resolve common Kubernetes failures: CrashLoopBackOff, OOMKilled, network issues, and more.",
    topics: ["Common Failure Scenarios", "Debugging Pods & Nodes", "CrashLoopBackOff Analysis", "Network Troubleshooting"],
    sections: [
      {
        title: "Pod Failure Scenarios",
        content: `Understanding pod status and conditions is the first step in troubleshooting. Key statuses to know:

**CrashLoopBackOff**: The container starts, crashes, and Kubernetes keeps restarting it with exponential backoff. Causes include application errors, missing environment variables, misconfigured probes, or insufficient resources. Check logs from the previous container instance with \`kubectl logs --previous\`.

**OOMKilled**: The container exceeded its memory limit and was killed by the OOM killer. Increase memory limits or fix memory leaks. **ImagePullBackOff**: Cannot pull the container image — check image name/tag, registry credentials, and network connectivity. **Pending**: Pod cannot be scheduled — check resource availability, node selectors, taints, and PVC binding.`,
        code: [
          {
            lang: "bash",
            label: "Systematic Pod Debugging",
            code: `# Step 1: Check pod status and events
kubectl describe pod <pod-name> -n <namespace>

# Step 2: Check current and previous logs
kubectl logs <pod-name> --previous
kubectl logs <pod-name> --tail=200

# Step 3: Check resource usage
kubectl top pod <pod-name>

# Step 4: Exec into pod (if running)
kubectl exec -it <pod-name> -- /bin/sh

# Step 5: Run debug container
kubectl debug -it <pod-name> --image=nicolaka/netshoot --copy-to=debug-pod

# Step 6: Check node conditions
kubectl describe node <node-name> | grep -A 10 Conditions

# Step 7: Check cluster events
kubectl get events --sort-by='.lastTimestamp' -n <namespace>
kubectl get events --field-selector reason=BackOff`
          }
        ]
      },
      {
        title: "Network Troubleshooting",
        content: `Network issues in Kubernetes can be complex due to the multiple layers involved: pod networking, service routing, DNS, and ingress. A systematic approach is essential.

Use **netshoot** (a network troubleshooting container with tools like curl, dig, nslookup, tcpdump, netstat, and traceroute) for in-cluster debugging. Test DNS resolution, service reachability, and network policy enforcement step by step.`,
        code: [
          {
            lang: "bash",
            label: "Network Debugging Commands",
            code: `# Run netshoot debug pod
kubectl run netshoot --image=nicolaka/netshoot -it --rm -- /bin/bash

# Inside netshoot: test DNS
nslookup kubernetes.default.svc.cluster.local
dig +short my-service.my-namespace.svc.cluster.local

# Test service connectivity
curl -v http://my-service.my-namespace.svc.cluster.local

# Check kube-proxy rules
kubectl get svc my-service -o yaml
iptables -t nat -L KUBE-SERVICES | grep my-service

# Check CNI plugin logs
kubectl logs -n kube-system -l k8s-app=calico-node --tail=50

# Test network policy
# Deploy test pods in different namespaces and test connectivity
kubectl run test-client --image=busybox -it --rm -- \
  wget -qO- http://backend-service.production.svc.cluster.local`
          }
        ]
      }
    ]
  },
  {
    id: 22,
    title: "Production Best Practices",
    difficulty: "expert",
    emoji: "🏭",
    description: "Build and operate highly available, resilient Kubernetes clusters with proper backup, upgrade, and compliance strategies.",
    topics: ["High Availability Clusters", "Backup & Disaster Recovery", "Upgrade Strategies", "Logging & Compliance"],
    sections: [
      {
        title: "High Availability",
        content: `A production-grade Kubernetes cluster requires high availability at every layer. The **control plane** should have 3 or 5 replicas across availability zones, with an external load balancer in front of the API Servers. **etcd** should run as a 3 or 5-node cluster with dedicated nodes and SSD storage.

**Worker nodes** should be distributed across multiple availability zones. Use **Pod Disruption Budgets (PDBs)** to ensure a minimum number of replicas remain available during node drains and upgrades. Use **topology spread constraints** to distribute pods evenly across zones.`,
        code: [
          {
            lang: "yaml",
            label: "Pod Disruption Budget",
            code: `apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: web-app-pdb
spec:
  minAvailable: 2    # At least 2 pods must be available
  # OR: maxUnavailable: 1  # At most 1 pod can be unavailable
  selector:
    matchLabels:
      app: web-app`
          }
        ]
      },
      {
        title: "Cluster Upgrades",
        content: `Kubernetes releases a new minor version approximately every 4 months, and each version is supported for about 14 months. Staying within the supported version range is critical for security patches.

Upgrade order: control plane first (one minor version at a time), then worker nodes. For managed clusters (EKS, GKE, AKS), use the cloud provider's upgrade tooling. For self-managed clusters, use kubeadm. Always upgrade in a staging environment first, test application compatibility, and have a rollback plan.

**Karpenter** and **Cluster Autoscaler** can facilitate node upgrades by draining old nodes and provisioning new ones with the updated Kubernetes version.`,
      }
    ]
  },
  {
    id: 23,
    title: "Cloud-Native Ecosystem",
    difficulty: "expert",
    emoji: "☁️",
    description: "Navigate the CNCF landscape, understand key tools, and apply platform engineering principles.",
    topics: ["CNCF Landscape Overview", "Key Tools & Integrations", "Platform Engineering"],
    sections: [
      {
        title: "CNCF Landscape",
        content: `The **Cloud Native Computing Foundation (CNCF)** hosts over 200 projects across the cloud-native landscape. Projects are categorized by maturity: **Sandbox** (early stage), **Incubating** (growing adoption), and **Graduated** (production-proven). Notable graduated projects include Kubernetes, Prometheus, Envoy, Fluentd, Jaeger, Vitess, Argo, Flux, Cilium, and Helm.

The CNCF landscape is organized into categories: Provisioning, Runtime, Orchestration & Management, App Definition & Development, Observability & Analysis, Serverless, and Platform. Understanding which tools solve which problems is essential for building a coherent cloud-native platform.`,
      },
      {
        title: "Platform Engineering",
        content: `**Platform Engineering** is the discipline of building and operating internal developer platforms (IDPs) that provide self-service capabilities to development teams. Rather than each team managing their own Kubernetes configuration, a platform team provides golden paths — opinionated, pre-configured workflows that encode best practices.

Tools like **Backstage** (developer portal), **Crossplane** (infrastructure as code via Kubernetes), **Port** (internal developer portal), and **Kratix** (platform-as-a-service framework) enable platform engineering on Kubernetes. The goal is to reduce cognitive load on developers while maintaining governance and security standards.`,
      }
    ]
  },
  {
    id: 24,
    title: "Kubernetes for AI/ML",
    difficulty: "expert",
    emoji: "🤖",
    description: "Run ML workloads, schedule GPUs, and use Kubeflow for end-to-end machine learning pipelines on Kubernetes.",
    topics: ["Running ML Workloads", "GPU Scheduling", "Kubeflow", "MLOps on Kubernetes"],
    sections: [
      {
        title: "GPU Scheduling in Kubernetes",
        content: `Kubernetes 1.33 introduced significant improvements for AI/ML workloads, making it the preferred platform for training and serving machine learning models. GPU scheduling requires the **NVIDIA GPU Operator** (or AMD equivalent), which installs the necessary drivers, device plugins, and monitoring components as a DaemonSet.

Pods request GPUs using the \`nvidia.com/gpu\` resource. Kubernetes 1.29+ supports **fractional GPU allocation** via the Dynamic Resource Allocation (DRA) API, allowing multiple pods to share a single GPU — critical for cost efficiency in inference workloads.`,
        code: [
          {
            lang: "yaml",
            label: "GPU Pod Specification",
            code: `apiVersion: v1
kind: Pod
metadata:
  name: gpu-training-job
spec:
  tolerations:
  - key: nvidia.com/gpu
    operator: Exists
    effect: NoSchedule
  containers:
  - name: trainer
    image: nvcr.io/nvidia/pytorch:24.01-py3
    command: ["python", "train.py"]
    resources:
      limits:
        nvidia.com/gpu: 4      # Request 4 GPUs
        memory: "64Gi"
        cpu: "16"
      requests:
        nvidia.com/gpu: 4
        memory: "64Gi"
        cpu: "16"
    env:
    - name: NCCL_DEBUG
      value: "INFO"
  nodeSelector:
    accelerator: nvidia-a100`
          }
        ]
      },
      {
        title: "Kubeflow",
        content: `**Kubeflow** is the machine learning toolkit for Kubernetes. It provides a set of tools for each stage of the ML lifecycle: **Kubeflow Pipelines** (workflow orchestration), **Katib** (hyperparameter tuning), **KServe** (model serving), **Training Operator** (distributed training with PyTorch, TensorFlow, JAX), and **Notebooks** (JupyterHub on Kubernetes).

Kubeflow 1.9 (2025) introduced improved multi-user isolation, better GPU scheduling integration, and native support for LLM fine-tuning workflows. For simpler use cases, **MLflow** on Kubernetes provides experiment tracking and model registry capabilities without the full Kubeflow stack.`,
      }
    ]
  },
  {
    id: 25,
    title: "Building Your Own Platform",
    difficulty: "expert",
    emoji: "🏗️",
    description: "Design and build Internal Developer Platforms (IDPs) on Kubernetes with self-service capabilities.",
    topics: ["Internal Developer Platforms", "Platform Engineering Principles", "Self-Service Kubernetes"],
    sections: [
      {
        title: "Internal Developer Platform Design",
        content: `An **Internal Developer Platform (IDP)** abstracts the complexity of Kubernetes from application developers, providing a self-service interface for deploying and managing applications. A well-designed IDP reduces the cognitive load on developers, enforces organizational standards, and accelerates time-to-production.

Key components of an IDP include: a developer portal (Backstage), a service catalog (defining available services and templates), a deployment interface (Argo CD, Flux), an infrastructure provisioning layer (Crossplane, Terraform), and an observability platform (Prometheus, Grafana, Loki).

The **Platform Engineering Maturity Model** defines five levels: reactive (ad-hoc), repeatable (documented processes), scalable (self-service), optimizing (data-driven), and innovating (platform as a product).`,
      }
    ]
  },
  {
    id: 26,
    title: "Hands-On Projects",
    difficulty: "expert",
    emoji: "🎓",
    description: "Apply your knowledge with real-world projects: microservices deployment, CI/CD pipeline, cluster security, and multi-region setup.",
    topics: ["Deploy a Microservices App", "Build CI/CD Pipeline", "Secure a Cluster", "Monitor Production Workloads", "Multi-Region Deployment"],
    sections: [
      {
        title: "Project 1: Microservices Application",
        content: `Deploy a complete microservices application with a frontend, backend API, database, and message queue. This project covers: writing Kubernetes manifests for each service, configuring Services and Ingress for routing, managing configuration with ConfigMaps and Secrets, setting up persistent storage for the database, and implementing health checks and resource limits.

A good starter project is the **Online Boutique** (Google's microservices demo) or **Sock Shop** (Weaveworks' e-commerce demo), both available on GitHub with complete Kubernetes manifests.`,
        code: [
          {
            lang: "bash",
            label: "Deploy Online Boutique Demo",
            code: `# Clone the demo
git clone https://github.com/GoogleCloudPlatform/microservices-demo

# Deploy to Kubernetes
kubectl apply -f ./release/kubernetes-manifests.yaml

# Watch pods come up
kubectl get pods -w

# Get the frontend service IP
kubectl get service frontend-external

# Access the application
kubectl port-forward service/frontend 8080:80`
          }
        ]
      },
      {
        title: "Project 2: Production-Ready CI/CD",
        content: `Build a complete GitOps pipeline: application code in one repository, Kubernetes manifests in another. Set up GitHub Actions to build, test, scan, and push images. Configure Argo CD to watch the manifests repository and automatically deploy changes. Implement branch-based environments (feature branches deploy to preview namespaces, main deploys to staging, tags deploy to production).`,
      },
      {
        title: "Project 3: Cluster Security Hardening",
        content: `Implement a security-hardened cluster configuration: enable Pod Security Standards (restricted mode) for all application namespaces, configure RBAC with least-privilege roles for all service accounts, implement Network Policies to enforce zero-trust networking, set up Falco for runtime security monitoring, configure image scanning in CI/CD, and enable etcd encryption at rest.`,
      }
    ]
  },
  {
    id: 27,
    title: "Certification Preparation",
    difficulty: "expert",
    emoji: "🎯",
    description: "Prepare for CKA, CKAD, and CKS certifications with exam tips, practice labs, and study resources.",
    topics: ["CKA", "CKAD", "CKS", "Exam Tips & Labs"],
    sections: [
      {
        title: "Certification Overview",
        content: `The Linux Foundation and CNCF offer three Kubernetes certifications, each targeting a different role and skill level.

**CKA (Certified Kubernetes Administrator)**: Focuses on cluster administration — installation, configuration, networking, storage, troubleshooting, and security. The exam is 2 hours, performance-based (hands-on in a live cluster), and covers Kubernetes 1.31+.

**CKAD (Certified Kubernetes Application Developer)**: Focuses on application development — designing, building, and deploying applications on Kubernetes. Covers pods, deployments, services, configuration, and observability from a developer perspective.

**CKS (Certified Kubernetes Security Specialist)**: The most advanced certification, requiring a valid CKA first. Covers cluster hardening, system hardening, supply chain security, monitoring, logging, and runtime security.`,
      },
      {
        title: "Exam Tips & Study Strategy",
        content: `All three exams are performance-based — you work in a real Kubernetes environment. Key tips:

**Master kubectl**: Practice imperative commands for speed. Use \`--dry-run=client -o yaml\` to generate YAML quickly. Set up aliases: \`alias k=kubectl\`, \`export do="--dry-run=client -o yaml"\`.

**Use the official documentation**: The exam allows access to kubernetes.io/docs. Know how to quickly find what you need. Bookmark key pages: kubectl cheat sheet, API reference, task pages.

**Time management**: Skip hard questions and return to them. Each question shows its weight — prioritize high-value questions. Practice with time limits using killer.sh (the official exam simulator).

**Practice environments**: Use killer.sh (included with exam purchase), KodeKloud, or A Cloud Guru for hands-on practice labs.`,
        code: [
          {
            lang: "bash",
            label: "Essential CKA/CKAD Aliases",
            code: `# Add to ~/.bashrc for exam
alias k=kubectl
alias kn='kubectl config set-context --current --namespace'
export do='--dry-run=client -o yaml'
export now='--force --grace-period 0'

# Quick pod creation
k run nginx --image=nginx $do > pod.yaml

# Quick deployment
k create deploy web --image=nginx --replicas=3 $do > deploy.yaml

# Quick service exposure
k expose deploy web --port=80 --target-port=8080 $do > svc.yaml

# Force delete a stuck pod
k delete pod stuck-pod $now

# Check all resources in namespace
k get all -n kube-system`
          }
        ]
      }
    ]
  }
];

export const chapterGroups = [
  {
    label: "Beginner",
    color: "badge-beginner",
    textColor: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    chapters: chapters.filter(c => c.difficulty === 'beginner'),
  },
  {
    label: "Intermediate",
    color: "badge-intermediate",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    chapters: chapters.filter(c => c.difficulty === 'intermediate'),
  },
  {
    label: "Advanced",
    color: "badge-advanced",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    chapters: chapters.filter(c => c.difficulty === 'advanced'),
  },
  {
    label: "Expert",
    color: "badge-expert",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    chapters: chapters.filter(c => c.difficulty === 'expert'),
  },
];
