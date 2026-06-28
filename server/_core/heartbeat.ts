export type HeartbeatJob = {
  name: string;
  cron: string;
  path: string;
  description?: string;
};

export async function createHeartbeatJob(job: HeartbeatJob): Promise<void> {
  console.log(`[Heartbeat] Would create job: ${job.name} at ${job.cron} -> ${job.path}`);
}

export async function deleteHeartbeatJob(taskUid: string): Promise<void> {
  console.log(`[Heartbeat] Would delete job: ${taskUid}`);
}

export async function listHeartbeatJobs(): Promise<{ jobs: any[] }> {
  return { jobs: [] };
}
