import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Heading,
  Input,
  List,
  ListItem,
  Spinner,
  Text,
} from '@chakra-ui/react';
import {} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import * as uuid from 'uuid';
import AddTodoForm from './components/AddTodoForm';
import todoApi from '../../api/todoApi';



function App() {
  const [taskName, setTaskName] = useState(''); // for tracking value in input field
  const [todos, setTodos] = useState([]); // for tracking list of todos displayed to user
  const [taskNameError, setTaskNameError] = useState(''); // for form errors
  const [isSubmitting, setIsSubmitting] = useState(false); // for tracking when form submission is in progress
  const [isDeleting, setIsDeleting] = useState(null); // for tracking when deleting is in progress
  const [isLoadingTodos, setIsLoadingTodos] = useState(false); // for tracking when loading todos is in progress
  const [isFirstLoad, setIsFirstLoad] = useState(true); // for tracking when we are loading data for the first time

  
  const fetchAllTodos = async () => {
    setIsLoadingTodos(true); // signal that loading todos is in progress
    try {
      const { data: todos } = await todoApi.get('/todos');
      setTodos(todos);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingTodos(false); // signal that we are no longer loading todos
    }
  };

  /**
   * first time loading
   */
  useEffect(() => {
    fetchAllTodos();
    setIsFirstLoad(false);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true); // signal that the submission process has started
    setTaskNameError(''); // clear any errors from before

    // validation
    if (taskName.trim().length === 0) {
      setIsSubmitting(false);
      setTaskNameError('Task name required');
      return;
    }

    // adding the todo
    const data = { id: uuid.v4(), name: taskName.trim(), completed: false };
    try {
     await todoApi.post('/todos', data); // this [mutation] invalidates(makes stale) all previously requested data
      // setTodos([...todos, response.data]) // get back todo with id and add to todos array
      await fetchAllTodos(); // refetch the latest data
      setTaskName(''); // clear input
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setIsDeleting(id);

    try {
      await todoApi.delete(`/todos/${id}`);
      await fetchAllTodos();
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleTodoStatus = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  // useState

  return (
    <Flex minH="100vh" bg="gray.300" py={12}>
      <Container maxW="3xl">
        <Box>
          <Heading p={4} color="whiteAlpha.800" bg="gray.500">
            TASK ATTACK
          </Heading>
          <form onSubmit={handleSubmit}>
            <Input
              value={taskName}
              border={0}
              bg="whiteAlpha.700"
              borderRadius={0}
              p={7}
              placeholder="ENTER A TASK TO ATTACK"
              onChange={(event) => {
                setTaskNameError(''); // clear input when user types
                setTaskName(event.target.value.toUpperCase());
              }}
            />
            {/* display error, if any */}
            {taskNameError && (
              <Box bg="red.400" color="white" p={1}>
                {taskNameError}
              </Box>
            )}
            <Button
              type="submit"
              w="full"
              borderRadius={0}
              bg="yellow.400"
              fontSize={24}
              py={7}
              _hover={{ bg: 'yellow.500' }}
              _active={{ bg: 'yellow.400' }}
              isDisabled={isSubmitting || isDeleting || isLoadingTodos}
            >
              +
            </Button>
          </form>
          {isLoadingTodos && isFirstLoad && (
            <Flex
              fontSize={26}
              fontWeight="thin"
              h={150}
              justifyContent="center"
              alignItems="center"
              bg="whiteAlpha.700"
            >
              LOADING YOUR TASKS...
            </Flex>
          )}
          {!isLoadingTodos && todos.length === 0 && (
            <Flex
              fontSize={26}
              fontWeight="thin"
              h={150}
              justifyContent="center"
              alignItems="center"
              bg="whiteAlpha.700"
            >
              OOOHHH, SUCH EMPTY
            </Flex>
          )}

          <List fontSize={20}>
            {todos.map((todo) => (
              <ListItem
                key={todo.id}
                bg="whiteAlpha.700"
                px={2}
                py={4}
                borderBottom="3px solid"
                borderColor="gray.400"
              >
                <Flex gap={5}>
                  <Checkbox
                    borderColor="gray.400"
                    isChecked={todo.completed}
                    onChange={() => toggleTodoStatus(todo.id)}
                  />
                  <Text
                    flex={1}
                    textDecorationLine={
                      todo.completed ? 'line-through' : 'none'
                    }
                  >
                    {todo.name.toUpperCase()}
                  </Text>
                  <Button
                    variant="outline"
                    size="xs"
                    borderColor="gray.400"
                    isDisabled={isSubmitting || isDeleting || isLoadingTodos}
                    onClick={() => handleDelete(todo.id)}
                  >
                    {isDeleting === todo.id ? <Spinner size='xs' /> : 'DELETE TASK'}
                  </Button>
                </Flex>
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
      <AddTodoForm onTodoAdded={fetchAllTodos} />
    </Flex>
  );
}
export default App;
