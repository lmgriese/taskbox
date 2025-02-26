
import InboxScreen from './InboxScreen';

import store from '../lib/store';

import { http, HttpResponse } from 'msw';

import { MockedState } from './TaskList.stories';

import { Provider } from 'react-redux';

 import {
  expect,
  findByRole,
  fireEvent,
  userEvent,
  waitFor,
  within,
  waitForElementToBeRemoved
 } from '@storybook/test';
import { title } from 'process';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  tags: ['autodocs'],
};

export const Default = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
          return HttpResponse.json(MockedState.tasks);
        }),
      ],
    },
  },
 play: async ({ canvasElement }) => {
   const canvas = within(canvasElement);
   // Waits for the component to transition from the loading state
   await waitForElementToBeRemoved(await canvas.findByTestId('loading'));
   // Waits for the component to be updated based on the store
   await waitFor(async () => {
     // Simulates pinning the first task
     await fireEvent.click(canvas.getByLabelText('pinTask-1'));
     // Simulates pinning the third task
     await fireEvent.click(canvas.getByLabelText('pinTask-3'));
   });
 },
};

export const PinTask = {
  parameters: {
    ...Default.parameters,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Waits for the component to transition from the loading state
    await waitForElementToBeRemoved(await canvas.findByTestId('loading'));
    // Simulates pinning the third task
    await fireEvent.click(canvas.getByLabelText('pinTask-3'));
    // Check that the pin button is now a unpin button
    const unpinButton = canvas.getByLabelText('pinTask-3')
    await expect(unpinButton).toBeInTheDocument();
  },
};

export const Error = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
          return new HttpResponse(null, {
            status: 403,
          });
        }),
      ],
    },
  },
};

export const ArchiveTask = {
  parameters: {
    ...Default.parameters,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const getTask = (id) => canvas.findByRole('listitem', { name: id });

    const itemToArchive = await getTask('task-2');
    const archiveButton = await findByRole(itemToArchive, 'button', {
      name: 'archiveButton-2',
    });
    await userEvent.click(archiveButton);
  },
};

export const EditTask = {
  parameters: {
    ...Default.parameters,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const getTask = (id) => canvas.findByRole('list-items', { name: title });

    const itemToEdit = await getTask('task-5');
    const taskInput = await findByRole(itemToEdit, 'textbox');
    await userEvent.type(taskInput, ' and disabled state');
    await expect(taskInput.value).toBe(
      'Fix bug in input error state and disabled state'
    );
  },
};