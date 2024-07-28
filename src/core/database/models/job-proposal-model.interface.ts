export abstract class IJobProposalModel {
  id: string;

  jobId: string;

  proposedTo: string;

  comment: string | null;

  proposedBy: string | null;

  status: string;

  createdAt: Date;
}
