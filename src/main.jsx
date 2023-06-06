import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import SimpleApp from './apps/simple-app/App';
import QueryApp from './apps/react-query-app/App';

const simpleApp = <SimpleApp />;

const queryClient = new QueryClient();

export const TitleContext = createContext();

const queryApp = (
  <TitleContext.Provider value='Fauzia is a coder'>
    <QueryClientProvider client={queryClient}>
      <QueryApp />
    </QueryClientProvider>
  </TitleContext.Provider>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>{queryApp}</ChakraProvider>
  </React.StrictMode>
);
