import { Box, Button, Flex, Input } from '@chakra-ui/react';
import { useState } from 'react';
import * as uuid from 'uuid';

import todoApi from '../../../api/todoApi';

function AddTodoForm({ onTodoAdded }) {
  const [taskName, setTaskName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);

    if (taskName.trim().length === 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      await todoApi.post('/todos', {
        id: uuid.v4(),
        name: taskName,
        completed: false,
      }); // invalidates old data
      setTaskName('');
      onTodoAdded(); // notify that data has changed
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box bg="white" h="min-content" p={7}>
      <form onSubmit={handleSubmit}>
        <Flex flexDirection="column" gap={2}>
          <Input
            value={taskName}
            borderRadius={0}
            placeholder="Task Name"
            onChange={(event) => setTaskName(event.target.value.toUpperCase())}
          />
          <Button
            isDisabled={isSubmitting}
            borderRadius={0}
            bg="yellow.400"
            _hover={{ bg: 'yellow.500' }}
            _active={{ bg: 'yellow.400' }}
          >
            Add Task
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
export default AddTodoForm;

{/* <Parent>
// data (refresh/query this data onDataChanged) 
{/* <Page data>
// // displays data
//   // notify
// </Page>

// <Page onDataChanged>
// // children
//   // changes (mutates data) -> onDataChanged()
// </Page> */}
//</Parent> */}

