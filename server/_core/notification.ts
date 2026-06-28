export type NotificationPayload = {
  title: string;
  content: string;
};

export async function notifyOwner(payload: NotificationPayload): Promise<boolean> {
  console.log(`[Notification] Would notify owner: ${payload.title} - ${payload.content}`);
  return true;
}
