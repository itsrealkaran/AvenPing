import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { Node, Edge } from "@xyflow/react";
import { useUser } from "./user-context";

// Define the Flow type based on the existing structure
export interface Flow {
  id: string;
  name: string;
  status: string;
  date: string;
  triggers: string[];
  steps: any[];
  isDisabled?: boolean;
}

// Database Flow type (matches Prisma schema)
export interface DatabaseFlow {
  id: string;
  name: string;
  triggers: string[];
  automationJson: any[];
  recipientArray: any[];
  status: string;
  isDisabled?: boolean;
  createdAt: string;
  updatedAt: string;
  accountId: string;
}

interface FlowContextType {
  flows: Flow[];
  isLoading: boolean;
  error: string | null;

  // CRUD Operations
  createFlow: (flow: Omit<Flow, "id" | "date">) => Promise<Flow>;
  updateFlow: (id: string, flow: Partial<Flow>) => Promise<Flow>;
  deleteFlow: (id: string) => Promise<void>;
  toggleFlowStatus: (id: string) => Promise<void>;
  toggleFlowDisabled: (id: string) => Promise<void>;

  // Flow Builder Operations
  saveFlowFromBuilder: (flow: Flow) => Promise<Flow>;

  // Utility Functions
  getFlowById: (id: string) => Flow | undefined;
  reconstructFlowData: (flow: Flow) => { nodes: Node[]; edges: Edge[] };

  // Refresh Operations
  refreshFlows: () => Promise<void>;
  isRefreshing: boolean;

  // State Management
  setError: (error: string | null) => void;
  clearError: () => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export const FlowProvider = ({ children }: { children: ReactNode }) => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userInfo } = useUser();

  // Convert database flow to frontend flow format
  const convertDatabaseFlowToFlow = (dbFlow: DatabaseFlow): Flow => {
    return {
      id: dbFlow.id,
      name: dbFlow.name,
      status: dbFlow.status,
      date: dbFlow.createdAt,
      isDisabled: dbFlow.isDisabled || false,
      triggers:
        Array.isArray(dbFlow.automationJson) && dbFlow.automationJson.length > 0
          ? dbFlow.automationJson[0]?.triggers || []
          : [],
      steps:
        Array.isArray(dbFlow.automationJson) && dbFlow.automationJson.length > 0
          ? dbFlow.automationJson[0]?.steps || []
          : [],
    };
  };

  // Convert frontend flow to database format
  const convertFlowToDatabaseFormat = (flow: Flow): Partial<DatabaseFlow> => {
    return {
      name: flow.name,
      triggers: flow.triggers,
      automationJson: [
        {
          triggers: flow.triggers,
          steps: flow.steps,
        },
      ],
      status: flow.status,
    };
  };

  // Fetch all flows
  const fetchFlows = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get("/api/whatsapp/flow");

      if (response.data && Array.isArray(response.data)) {
        const convertedFlows = response.data.map(convertDatabaseFlowToFlow);
        setFlows(convertedFlows);
      } else if (response.data) {
        // Single flow response
        const convertedFlow = convertDatabaseFlowToFlow(response.data);
        setFlows([convertedFlow]);
      } else {
        setFlows([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch flows");
      setFlows([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new flow
  const createFlow = useCallback(
    async (flow: Omit<Flow, "id" | "date">): Promise<Flow> => {
      try {
        setError(null);
        const dbFlow = convertFlowToDatabaseFormat(flow as Flow);

        const response = await axios.post("/api/whatsapp/flow", dbFlow);

        const newFlow = convertDatabaseFlowToFlow(response.data);
        setFlows((prev) => [...prev, newFlow]);

        return newFlow;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || "Failed to create flow";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  // Update an existing flow
  const updateFlow = useCallback(
    async (id: string, flow: Partial<Flow>): Promise<Flow> => {
      try {
        setError(null);
        const dbFlow = convertFlowToDatabaseFormat(flow as Flow);

        const response = await axios.put("/api/whatsapp/flow", {
          id,
          ...dbFlow,
        });

        const updatedFlow = convertDatabaseFlowToFlow(response.data);
        setFlows((prev) => prev.map((f) => (f.id === id ? updatedFlow : f)));

        return updatedFlow;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || "Failed to update flow";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  // Delete a flow
  const deleteFlow = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await axios.delete("/api/whatsapp/flow", { data: { id } });

      setFlows((prev) => prev.filter((f) => f.id !== id));
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to delete flow";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Toggle flow status
  const toggleFlowStatus = useCallback(
    async (id: string): Promise<void> => {
      try {
        setError(null);
        const flow = flows.find((f) => f.id === id);
        if (!flow) throw new Error("Flow not found");

        const newStatus = flow.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

        const response = await axios.put("/api/whatsapp/flow", {
          id,
          status: newStatus,
        });

        const updatedFlow = convertDatabaseFlowToFlow(response.data);
        setFlows((prev) => prev.map((f) => (f.id === id ? updatedFlow : f)));
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || "Failed to toggle flow status";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [flows]
  );

  // Toggle flow disabled status
  const toggleFlowDisabled = useCallback(
    async (id: string): Promise<void> => {
      try {
        setError(null);
        const flow = flows.find((f) => f.id === id);
        if (!flow) throw new Error("Flow not found");

        const response = await axios.put("/api/whatsapp/flow/toggle-status", {
          flowId: id,
        });

        const updatedFlow = convertDatabaseFlowToFlow(response.data.flow);
        setFlows((prev) => prev.map((f) => (f.id === id ? updatedFlow : f)));
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || "Failed to toggle flow disabled status";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [flows]
  );

  // Save flow from builder (create or update)
  const saveFlowFromBuilder = useCallback(
    async (flow: Flow): Promise<Flow> => {
      try {
        setError(null);

        if (flow.id && flows.find((f) => f.id === flow.id)) {
          // Update existing flow
          return await updateFlow(flow.id, flow);
        } else {
          // Create new flow
          const { id, date, ...newFlow } = flow;
          return await createFlow(newFlow);
        }
      } catch (err: any) {
        const errorMessage = err || "Failed to save flow";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [flows, createFlow, updateFlow]
  );

  // Get flow by ID
  const getFlowById = useCallback(
    (id: string): Flow | undefined => {
      return flows.find((f) => f.id === id);
    },
    [flows]
  );

  // Reconstruct flow data for builder (from existing flow page)
  const reconstructFlowData = useCallback(
    (flow: Flow): { nodes: Node[]; edges: Edge[] } => {
      const nodes: Node[] = [];
      const edges: Edge[] = [];

      // Add start node
      nodes.push({
        id: "1",
        type: "custom",
        position: { x: 250, y: 100 },
        data: {
          label: "Start",
          isStartNode: true,
          nodeType: "Start",
          startKeywords: flow.triggers || [],
          currentFlowId: flow.id, // Add current flow ID
        },
      });

      // Add other nodes from steps
      flow.steps.forEach((step, index) => {
        const nodeId = step.id;
        const nodeType = step.type;
        // Use saved position if available, else fallback to grid
        const x = step.position?.x ?? 250 + (index + 1) * 200;
        const y = step.position?.y ?? 100 + (index % 2) * 150;

        const nodeData: any = {
          label: nodeType.replace(/([A-Z])/g, " $1").trim(),
          nodeType,
          category: nodeType.includes("Message") ? "message" : "action",
        };

        // Add step-specific data
        if (nodeType === "MessageAction") {
          nodeData.message = step.message || "";
          nodeData.link = step.link || "";
          nodeData.header = step.header || "";
          nodeData.headerType = step.headerType || "none";
          nodeData.replyButtons =
            step.buttons?.map((btn: any) => btn.label) || [];
        } else if (
          [
            "ImageMessage",
            "VideoMessage",
            "AudioMessage",
            "DocumentMessage",
          ].includes(nodeType)
        ) {
          nodeData.file = step.file || "";
          nodeData.caption = step.message || "";
        } else if (nodeType === "ConnectFlowAction") {
          nodeData.flowId = step.flowId || "";
        } else if (
          nodeType === "CallSupport" ||
          nodeType === "WhatsAppSupport"
        ) {
          nodeData.phoneNumber = step.phoneNumber || "";
        }

        nodes.push({
          id: nodeId,
          type: "custom",
          position: { x, y },
          data: {
            ...nodeData,
            currentFlowId: flow.id, // Add current flow ID for Connect Flow nodes
          },
        });

        // Add edges
        if (nodeType === "MessageAction") {
          if (step.buttons && step.buttons.length > 0) {
            // Add button-specific edges
            step.buttons.forEach((button: any, buttonIndex: number) => {
              if (button.next) {
                edges.push({
                  id: `${nodeId}-${buttonIndex}`,
                  source: nodeId,
                  target: button.next,
                  sourceHandle: `reply-${buttonIndex}`,
                });
              }
            });
          }

          // Add default outgoing edge (for when no buttons or as fallback)
          if (step.next) {
            edges.push({
              id: `${nodeId}-next`,
              source: nodeId,
              target: step.next,
              sourceHandle:
                step.buttons && step.buttons.length > 0 ? "normal" : undefined,
            });
          }
        } else if (step.next) {
          edges.push({
            id: `${nodeId}-next`,
            source: nodeId,
            target: step.next,
          });
        }
      });

      // Connect start node to the first step node if there are steps
      if (flow.steps.length > 0) {
        const firstStepId = flow.steps[0].id;
        edges.push({
          id: "start-to-first",
          source: "1", // Start node ID
          target: firstStepId,
        });
      }

      return { nodes, edges };
    },
    []
  );

  // Refresh flows
  const refreshFlows = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchFlows();
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchFlows]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load flows on mount and when user changes
  useEffect(() => {
    if (userInfo?.whatsappAccount?.id) {
      console.log("FlowProvider: User account available, fetching flows");
      fetchFlows();
    } else {
      console.log("FlowProvider: No user account, clearing flows");
      setFlows([]);
    }
  }, [fetchFlows, userInfo?.whatsappAccount?.id]);

  const value: FlowContextType = {
    flows,
    isLoading,
    error,
    createFlow,
    updateFlow,
    deleteFlow,
    toggleFlowStatus,
    toggleFlowDisabled,
    saveFlowFromBuilder,
    getFlowById,
    reconstructFlowData,
    refreshFlows,
    isRefreshing,
    setError,
    clearError,
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
};

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error("useFlow must be used within a FlowProvider");
  }
  return context;
};
