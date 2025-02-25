
import { fn } from "@storybook/test";

import Task from './Task';

export const ActionsData = {
  onArchiveTask: fn(),
  onPinTask: fn(),
};

export default {
  component: Task,
  title: 'Task',
  tags: ['autodocs'],
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  argTypes: {
    onArchiveTask: { action: 'onArchiveTask' },
    onTogglePinTask: { action: 'onTogglePinTask' },
    onEditTitle: { action: 'onEditTitle' },
  },
  args: {
    ...ActionsData,
  },
};

export const Default = {
  args: {
    task: {
      id: '1',
      title: 'Buy Milk',
      state: 'TASK_INBOX',
    },
  },
};

export const Pinned = {
  args: {
    task: {
      ...Default.args.task,
      state: 'TASK_PINNED',
    },
  },
};

// export const Pinned = {
//   args: {
//     task: {
//       id: '2',
//       title: 'QA dropdown',
//       state: 'TASK_PINNED',
//     },
//   },
// };

export const Archived = {
  args: {
    task: {
      ...Default.args.task,
      state: 'TASK_ARCHIVED',
    },
  },
};

// export const Archived = {
//   args: {
//     task: {
//       id: '3',
//       title: 'Write schema for account menu',
//       state: 'TASK_ARCHIVED',
//     },
//   },
// };

const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = {
  args: {
    task: {
      ...Default.args.task,
      title: longTitleString,
    },
  },
};

// export const LongTitle = {
//   args: {
//     task: {
//       id: '4',
//       title: longTitleString,
//       state: 'TASK_INBOX',
//     },
//   },
// };