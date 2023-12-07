import { useEffect, useState, Suspense, use } from "react";
import ErrorBoundary from "./ErrorBoundary";
import SpotifyGrid from "./components/spotifyGrid";

function App() {
  const CLIENT_ID = "0a0dbf4f17794edb93777202fbf771b1";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    // getToken()

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const searchArtists = async (e) => {
    e.preventDefault();
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: "artist",
      },
    });

    setArtists(data.artists.items);
  };

  const renderArtists = () => {
    return artists.map((artist) => (
      <div key={artist.id}>
        {artist.images.length ? (
          <img width={"100%"} src={artist.images[0].url} alt="" />
        ) : (
          <div>No Image</div>
        )}
        {artist.name}
      </div>
    ));
  };

  return (
    <ErrorBoundary fallback={<div>Error...</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="App">
          <header className="App-header">
            <h1>Spotify React</h1>
            {!token ? (
              <a
                href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
              >
                Login to Spotify
              </a>
            ) : (
              <button onClick={logout}>Logout</button>
            )}

            {token ? (
              <form onSubmit={searchArtists}>
                <input
                  type="text"
                  onChange={(e) => setSearchKey(e.target.value)}
                />
                <button type={"submit"}>Search</button>
              </form>
            ) : (
              <h2>Please login</h2>
            )}

            {renderArtists()}
          </header>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

//Suspense tags checks if any of the content is dependednt on asynchronous calls
//then returns promise if data is fulfilled, renders out "Loading..."

//spotify api gets (top) artists
