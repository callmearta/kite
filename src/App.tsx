import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { handleSession } from './Agent';
import './App.scss';
import Feed from './pages/feed';
import Routes from './router/routes';

const queryClient = new QueryClient();

const Router = createBrowserRouter(Routes);

function App() {

  useEffect(() => {
    handleSession();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <RouterProvider router={Router} />
      </div>
    </QueryClientProvider>
  )
}

export default App
