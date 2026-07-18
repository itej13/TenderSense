import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DataProvider } from './lib/DataContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Sector from './pages/Sector'

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/sector/:id" element={<Sector />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  )
}
