/* ============================================================
   DESIGN: Blueprint Engineering
   Page: Cheat Sheet — Quick kubectl & K8s reference
   ============================================================ */

import { useState } from "react";
import Layout from "@/components/Layout";
import { Copy, Check, Terminal } from "lucide-react";

interface CommandGroup {
  title: string;
  emoji: string;
  color: string;
  commands: { cmd: string; desc: string }[];
}

const commandGroups: CommandGroup[] = [
  {
    title: "Cluster Info",
    emoji: "🏗️",
    color: "#3b82f6",
    commands: [
      { cmd: "kubectl cluster-info", desc: "Display cluster info" },
      { cmd: "kubectl get nodes", desc: "List all nodes" },
      { cmd: "kubectl get nodes -o wide", desc: "List nodes with extra info" },
      { cmd: "kubectl describe node <node>", desc: "Describe a specific node" },
      { cmd: "kubectl version --short", desc: "Show client/server version" },
      { cmd: "kubectl config get-contexts", desc: "List all contexts" },
      { cmd: "kubectl config use-context <ctx>", desc: "Switch context" },
    ],
  },
  {
    title: "Pod Operations",
    emoji: "📦",
    color: "#10b981",
    commands: [
      { cmd: "kubectl get pods", desc: "List pods in current namespace" },
      { cmd: "kubectl get pods -A", desc: "List pods in all namespaces" },
      { cmd: "kubectl get pods -o wide", desc: "List pods with node info" },
      { cmd: "kubectl describe pod <pod>", desc: "Describe a pod" },
      { cmd: "kubectl logs <pod>", desc: "View pod logs" },
      { cmd: "kubectl logs <pod> -f", desc: "Follow pod logs" },
      { cmd: "kubectl logs <pod> -c <container>", desc: "Logs from specific container" },
      { cmd: "kubectl exec -it <pod> -- bash", desc: "Shell into a pod" },
      { cmd: "kubectl delete pod <pod>", desc: "Delete a pod" },
      { cmd: "kubectl run nginx --image=nginx", desc: "Run a quick pod" },
    ],
  },
  {
    title: "Deployments",
    emoji: "🚀",
    color: "#f59e0b",
    commands: [
      { cmd: "kubectl get deployments", desc: "List deployments" },
      { cmd: "kubectl create deployment nginx --image=nginx", desc: "Create deployment" },
      { cmd: "kubectl scale deployment <name> --replicas=3", desc: "Scale deployment" },
      { cmd: "kubectl rollout status deployment/<name>", desc: "Check rollout status" },
      { cmd: "kubectl rollout history deployment/<name>", desc: "View rollout history" },
      { cmd: "kubectl rollout undo deployment/<name>", desc: "Rollback deployment" },
      { cmd: "kubectl set image deployment/<name> <c>=<img>", desc: "Update container image" },
      { cmd: "kubectl expose deployment <name> --port=80", desc: "Expose as service" },
    ],
  },
  {
    title: "Services & Networking",
    emoji: "🌐",
    color: "#8b5cf6",
    commands: [
      { cmd: "kubectl get services", desc: "List services" },
      { cmd: "kubectl get svc -A", desc: "List all services" },
      { cmd: "kubectl describe svc <name>", desc: "Describe a service" },
      { cmd: "kubectl port-forward svc/<name> 8080:80", desc: "Port-forward to service" },
      { cmd: "kubectl get ingress", desc: "List ingress resources" },
      { cmd: "kubectl get networkpolicies", desc: "List network policies" },
    ],
  },
  {
    title: "Config & Secrets",
    emoji: "🔧",
    color: "#ef4444",
    commands: [
      { cmd: "kubectl get configmaps", desc: "List ConfigMaps" },
      { cmd: "kubectl get secrets", desc: "List Secrets" },
      { cmd: "kubectl create configmap <name> --from-literal=key=val", desc: "Create ConfigMap" },
      { cmd: "kubectl create secret generic <name> --from-literal=key=val", desc: "Create Secret" },
      { cmd: "kubectl get secret <name> -o jsonpath='{.data.key}' | base64 -d", desc: "Decode secret value" },
    ],
  },
  {
    title: "Namespaces",
    emoji: "📁",
    color: "#06b6d4",
    commands: [
      { cmd: "kubectl get namespaces", desc: "List namespaces" },
      { cmd: "kubectl create namespace <name>", desc: "Create namespace" },
      { cmd: "kubectl config set-context --current --namespace=<ns>", desc: "Set default namespace" },
      { cmd: "kubectl get all -n <namespace>", desc: "Get all resources in namespace" },
      { cmd: "kubectl delete namespace <name>", desc: "Delete namespace" },
    ],
  },
  {
    title: "RBAC",
    emoji: "🔐",
    color: "#f97316",
    commands: [
      { cmd: "kubectl get roles", desc: "List roles" },
      { cmd: "kubectl get clusterroles", desc: "List cluster roles" },
      { cmd: "kubectl get rolebindings", desc: "List role bindings" },
      { cmd: "kubectl auth can-i create pods", desc: "Check permissions" },
      { cmd: "kubectl auth can-i create pods --as=user", desc: "Check permissions as user" },
      { cmd: "kubectl create serviceaccount <name>", desc: "Create service account" },
    ],
  },
  {
    title: "Debugging",
    emoji: "🔍",
    color: "#64748b",
    commands: [
      { cmd: "kubectl get events --sort-by=.metadata.creationTimestamp", desc: "View events sorted by time" },
      { cmd: "kubectl get events -n <ns>", desc: "Events in namespace" },
      { cmd: "kubectl top nodes", desc: "Node resource usage" },
      { cmd: "kubectl top pods", desc: "Pod resource usage" },
      { cmd: "kubectl debug -it <pod> --image=busybox", desc: "Debug with ephemeral container" },
      { cmd: "kubectl get pod <pod> -o yaml", desc: "Get pod YAML" },
      { cmd: "kubectl explain pod.spec", desc: "Explain resource fields" },
    ],
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
      style={{
        background: copied ? "oklch(0.52 0.22 259 / 0.2)" : "oklch(0.22 0.025 250)",
        color: copied ? "oklch(0.75 0.18 259)" : "oklch(0.6 0.01 250)",
      }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
    </button>
  );
}

export default function CheatSheet() {
  const [search, setSearch] = useState("");

  const filtered = commandGroups
    .map((g) => ({
      ...g,
      commands: g.commands.filter(
        (c) =>
          !search ||
          c.cmd.toLowerCase().includes(search.toLowerCase()) ||
          c.desc.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((g) => g.commands.length > 0);

  return (
    <Layout>
      <div className="min-h-screen" style={{ background: "oklch(0.985 0.002 85)" }}>
        {/* Header */}
        <div
          className="px-6 lg:px-10 py-10"
          style={{ background: "oklch(0.16 0.025 250)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.52 0.22 259 / 0.2)" }}
            >
              <Terminal size={20} style={{ color: "oklch(0.75 0.18 259)" }} />
            </div>
            <div>
              <div
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "oklch(0.75 0.18 259)", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Quick Reference
              </div>
              <h1
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
              >
                kubectl Cheat Sheet
              </h1>
            </div>
          </div>
          <p
            className="text-sm mb-6 max-w-xl"
            style={{ color: "oklch(0.7 0.01 250)", fontFamily: "'Source Serif 4', serif" }}
          >
            Essential kubectl commands and Kubernetes operations for daily use. Hover any command to copy it.
          </p>
          <input
            type="text"
            placeholder="Search commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm px-4 py-2.5 rounded-lg text-sm outline-none"
            style={{
              background: "oklch(0.22 0.025 250)",
              color: "oklch(0.88 0.01 250)",
              border: "1px solid oklch(0.35 0.02 250)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          />
        </div>

        {/* Commands Grid */}
        <div className="px-6 lg:px-10 py-8">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((group) => (
              <div
                key={group.title}
                className="rounded-xl overflow-hidden border"
                style={{
                  background: "white",
                  borderColor: "oklch(0.88 0.008 250)",
                }}
              >
                {/* Group header */}
                <div
                  className="px-4 py-3 flex items-center gap-2"
                  style={{
                    background: `${group.color}10`,
                    borderBottom: `2px solid ${group.color}30`,
                  }}
                >
                  <span className="text-lg">{group.emoji}</span>
                  <h3
                    className="font-semibold text-sm"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: group.color,
                    }}
                  >
                    {group.title}
                  </h3>
                  <span
                    className="ml-auto text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: `${group.color}15`,
                      color: group.color,
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {group.commands.length}
                  </span>
                </div>

                {/* Commands */}
                <div className="divide-y" style={{ borderColor: "oklch(0.93 0.005 250)" }}>
                  {group.commands.map((cmd, idx) => (
                    <div
                      key={idx}
                      className="group px-4 py-2.5 flex items-center gap-2 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <code
                          className="text-xs block truncate mb-0.5"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            color: "oklch(0.25 0.18 259)",
                          }}
                        >
                          {cmd.cmd}
                        </code>
                        <span
                          className="text-xs"
                          style={{
                            color: "oklch(0.55 0.02 250)",
                            fontFamily: "'Source Serif 4', serif",
                          }}
                        >
                          {cmd.desc}
                        </span>
                      </div>
                      <CopyButton text={cmd.cmd} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
