import MovieList from "./movies/MovieList"
import TVSeriesList from "./tvseries/TVSeriesList"

export const Home = () => {
    return (
        <>
            <MovieList />
            <TVSeriesList />
        </>
    )
}