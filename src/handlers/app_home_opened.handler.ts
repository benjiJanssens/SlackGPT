import Bolt from '@slack/bolt';
import { getItem, Table, Workspace } from '../services/dynamodb/index.js';
import { configurationBlocks } from '../blocks/index.js';
import { Handler } from './index.js';

const appHomeOpenedHandler: Handler<'app_home_opened'> = {
  name: 'app_home_opened',
  type: 'event',
  handler: async ({ event, client, context }) => {
    const blocks: (Bolt.Block | Bolt.KnownBlock)[] = [];

    // Configuration
    const { user } = await client.users.info({ user: event.user });
    // TODO: Retrieve teamId from installation data
    const workspace = await getItem<Workspace>(Table.Workspace, {
      Id: context.teamId,
    });
    if (user?.is_admin)
      blocks.push(...configurationBlocks(!!workspace?.OpenAiApiKey));

    await client.views.publish({
      user_id: event.user,
      view: {
        type: 'home',
        blocks,
      },
    });
  },
};

export default appHomeOpenedHandler;
