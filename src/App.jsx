import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import { Home } from './components/Home'
import Navbar from './components/Navbar'
import Movies from './components/movies/Movies'
import MovieDetails from './components/movies/details/MovieDetails'
import TVSeries from './components/tvseries/TVSeries'
import TVSeriesDetails from './components/tvseries/details/TVSeriesDetails'
import MoviesByGenre from './components/movies/MoviesByGenre'
import TVSeriesByGenre from './components/tvseries/TVSeriesByGenre'
import { ToTop } from '../../OmniShop/src/components/ToTop'
import { ToastContainer } from 'react-toastify'

import './App.css'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div>
      <ToastContainer />
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/movies' element={<Movies />} />
          <Route path='/movie/:movieId' element={<MovieDetails />} />
          <Route path='/tv-series' element={<TVSeries />} />
          <Route path='/tv/:tvSeriesId' element={<TVSeriesDetails />} />

          <Route path="/movies/genre/:genreId" element={<MoviesByGenre />} />
          <Route path="/tv/genre/:genreId" element={<TVSeriesByGenre />} />
        </Routes>
        <Footer />
        <ToTop />
      </Router>
    </div>
  )
}

export default App
