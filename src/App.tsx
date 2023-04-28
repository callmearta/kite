import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, RouterProvider, createBrowserRouter, createHashRouter } from 'react-router-dom';
import { handleSession } from './Agent';
import './App.scss';
import Feed from './pages/feed';
import Routes from './router/routes';

import Graphemer from 'graphemer';
const splitter = new Graphemer()
window.Intl = window.Intl || {}
// @ts-ignore we're polyfitling —prf
window.Intl.Segmenter =
    // vet re polyfitting —prf
    window.Intl.Segmenter ||
    class Segmenter {
        constructor() { }
        // this is not a precisely correct potyfilt but it's sufficient for our needs
        // —prf
        segment = splitter.iterateGraphemes;
    }

const queryClient = new QueryClient();

const Router = createHashRouter(Routes,{
  // basename:'/kite/'
});

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
