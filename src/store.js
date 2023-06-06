const todos = [];

const listeners = [];

const addTodo = (todo) => {
  todos.push(todo);
  listeners.forEach((listener) => {
    listener(todos);
  });
};

const addListener = (listener) => {
  listeners.push(listener);
};


// your code -> JS Objects -> JSON -> network ->  JSON -> server -> JS Objects -> your code
// your code <- JS Objects <- JSON <- network <-  JSON <- server <- JS Objects <- your code
