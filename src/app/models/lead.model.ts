export interface Lead {
    leadId: number;
    customerId: number;
    assignedTo: number;
    status: string;
    pipelineStage: string;
    dateCreated: string;
    lastUpdated: string;
  }