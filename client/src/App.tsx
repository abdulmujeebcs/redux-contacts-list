import { RouterProvider } from 'react-router-dom'
import './App.css'
import appRouter from './routes'
import { useAppSelector } from './store/hooks'
import { selectApiCallInProgress } from './store/contactsSlice'
import Loader from './components/Loader'

function App() {
  const isLoading = useAppSelector(selectApiCallInProgress);
  return <>
    {isLoading &&
      <div className='z-20 bg-black/75 fixed w-screen h-screen flex items-center justify-center'>
        <Loader />
      </div>
    }
    <RouterProvider router={appRouter} />
  </>
}

export default App
