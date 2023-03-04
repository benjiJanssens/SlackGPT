import Bolt from '@slack/bolt';
import prismaService from '../services/prisma.service.js';

export default async function openaiMiddleware({
  event,
  client,
  next,
}: Bolt.SlackEventMiddlewareArgs<'app_mention'> & Bolt.AllMiddlewareArgs) {
  const workspace = await prismaService.workspace.findUnique({
    where: { id: event.team },
  });

  if (!workspace) {
    client.chat.postEphemeral({
      text: 'SlackGPT is not configured for this workspace yet. Please contact your workspace administrator.',
      channel: event.channel,
      user: event.user as string,
      thread_ts: event.thread_ts,
    });
  }

  next();
}