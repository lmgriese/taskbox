import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import TaskList from './TaskList';

// Define MockedState
export const MockedState = {
  tasks: [
    { id: '1', title: 'Task 1', state: 'TASK_INBOX' },
    { id: '2', title: 'Task 2', state: 'TASK_INBOX' },
    { id: '3', title: 'Task 3', state: 'TASK_INBOX' },
    { id: '4', title: 'Task 4', state: 'TASK_INBOX' },
    { id: '5', title: 'Task 5', state: 'TASK_INBOX' },
    { id: '6', title: 'Task 6', state: 'TASK_INBOX' },
  ],
};

// A super-simple mock of the state of the store
const Mockstore = ({ taskboxState, children }) => (
  <Provider
    store={configureStore({
      reducer: {
        taskbox: createSlice({
          name: 'taskbox',
          initialState: taskboxState,
          reducers: {
            updateTaskState: (state, action) => {
              const { id, newState } = action.payload;
              const task = state.tasks.findIndex((task) => task.id === id);
              if (task >= 0) {
                state.tasks[task].state = newState;
              }
            },
          },
        }).reducer,
      },
    })}
  >
    {children}
  </Provider>
);

Mockstore.propTypes = {
  taskboxState: PropTypes.shape({
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [(story) => <Mockstore taskboxState={MockedState}>{story()}</Mockstore>],
  //   excludeStories is a Storybook configuration field that prevents our mocked state to be treated as a story. 
  //   You can read more about this field in the Storybook documentation (https://storybook.js.org/docs/api/csf).
  excludeStories: /.*MockedState$/,
};

const Template = (args) => <TaskList {...args} />;

export const Default = Template.bind({});
Default.args = {
  tasks: MockedState.tasks,
};

export const PinnedTasks = Template.bind({});
PinnedTasks.args = {
  tasks: [
    ...Default.args.tasks.slice(0, 5),
    { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
  ],
};

export const Loading = Template.bind({});
Loading.args = {
  tasks: [],
  status: 'loading',
};

export const Empty = Template.bind({});
Empty.decorators = [
  (story) => (
    <Mockstore
      taskboxState={{
        ...MockedState,
        tasks: [],
      }}
    >
      {story()}
    </Mockstore>
  ),
];
Empty.args = {
  tasks: [],
};