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
import * as uuid from 'uuid';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import todoApi from '../../api/todoApi';
import { useContext } from 'react';
import { TitleContext } from '../../main';

const todoSchema = z.object({
  taskName: z.string().trim().nonempty('Task name required').toUpperCase(),
});

function App() {
  const {
    register,
    reset,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(todoSchema) });

  const title = useContext(TitleContext);

  const queryClient = useQueryClient();

  const todosQuery = useQuery('todos', () =>
    todoApi.get('/todos').then((response) => response.data)
  );

  const addTodoMutation = useMutation((todo) => todoApi.post(`/todos`, todo), {
    onSuccess() {
      reset();
      queryClient.invalidateQueries(['todos']);
    },
  });

  const deleteTodoMutation = useMutation(
    (id) => todoApi.delete(`/todos/${id}`),
    {
      onSuccess() {
        queryClient.invalidateQueries(['todos']);
      },
    }
  );

  const handleSubmit = ({ taskName }) => {
    const newTodo = {
      id: uuid.v4(),
      completed: false,
      name: taskName,
    };
    addTodoMutation.mutate(newTodo);
  };

  const handleDelete = (id) => {
    deleteTodoMutation.mutate(id);
  };

  return (
    <Flex minH="100vh" bg="gray.300" py={12}>
      <Container maxW="3xl">
        {todosQuery.isError && (
          <Box bg="red.400" color="white" p={1}>
            Something went wrong
          </Box>
        )}
        <Box>
          <Heading p={4} color="whiteAlpha.800" bg="gray.500">
            TASK ATTACK ({title})
          </Heading>
          <form onSubmit={hookFormSubmit(handleSubmit)}>
            <Input
              border={0}
              bg="whiteAlpha.700"
              borderRadius={0}
              p={7}
              placeholder="ENTER A TASK TO ATTACK"
              {...register('taskName')}
            />
            {errors.taskName && (
              <Box bg="red.400" color="white" p={1}>
                {errors.taskName.message}
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
              isDisabled={addTodoMutation.isLoading}
            >
              {addTodoMutation.isLoading ? <Spinner size='sm' /> : '+'}
            </Button>
          </form>
          <List fontSize={20}>
            {todosQuery.data?.map((todo) => (
              <ListItem
                key={todo.id}
                bg="whiteAlpha.700"
                px={2}
                py={4}
                borderBottom="3px solid"
                borderColor="gray.400"
              >
                <Flex gap={5}>
                  <Checkbox borderColor="gray.400" />
                  <Text flex={1}>{todo.name.toUpperCase()}</Text>
                  <Button
                    variant="outline"
                    size="xs"
                    borderColor="gray.400"
                    onClick={() => handleDelete(todo.id)}
                  >
                    {deleteTodoMutation.variables === todo.id ? (
                      <Spinner />
                    ) : (
                      'DELETE TASK'
                    )}
                    {/* DELETE TASK */}
                  </Button>
                </Flex>
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </Flex>
  );
}
export default App;
