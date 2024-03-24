import { useState, useEffect } from 'react'
import md5 from 'crypto-js/md5'; 
import './App.css'
import SideNav from "./components/SideNav.jsx";

function App() {
  const PUBLIC_API_KEY = '1942995fed9e571bce369e5ecc4d58c8'; 
  const PRIVATE_API_KEY = '79b9f67acb0f34b3d643c5567381913e8a01086f'; 
  const [data, setData] = useState(null);
  const [filteredData, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [isEmptyResult, setIsEmptyResult] = useState(false);
  const [searchLimit, setSearchLimit] = useState();
  const [totalAvailableStories, setTotalAvailableStories] = useState();
  const [totalAvailableComics, setTotalAvailableComics] = useState();
  const [sortedData, setSortedData] = useState([]);


  useEffect(() => {
    // Initialize sortedData with filteredData when component mounts or when filteredData changes
    setSortedData(filteredData);
  }, [filteredData]);

  const handleSort = (option) => {
    let sortedResult = [...filteredData]; // Make a copy of the filtered data

    switch (option) {
        case 'newest':
            sortedResult.sort((a, b) => new Date(b.modified) - new Date(a.modified));
            break;
        case 'oldest':
            sortedResult.sort((a, b) => new Date(a.modified) - new Date(b.modified));
            break;
        case 'comics':
            sortedResult.sort((a, b) => b.comics.available - a.comics.available);
            break;
        case 'stories':
            sortedResult.sort((a, b) => b.stories.available - a.stories.available);
            break;
        case 'alphabetical':
            sortedResult = [...filteredData].sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            sortedResult = filteredData;
            break;
    }
    setSortedData(sortedResult);
};


  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };


  useEffect(() => {
    const ts = new Date().getTime().toString();
    const hash = md5(ts + PRIVATE_API_KEY + PUBLIC_API_KEY);

    const fetchAllHeroesData = async () => {
      try {
        const response = await fetch(
          `https://gateway.marvel.com:443/v1/public/characters?apikey=${PUBLIC_API_KEY}&ts=${ts}&hash=${hash}&limit=100`
        );
        const json = await response.json();
        setData(json);
        console.log(json);
        
        setSearchLimit(json.data.results.length);
        setTotalAvailableStories(json.data.results.reduce((total, hero) => total + hero.stories.available, 0));
        setTotalAvailableComics(json.data.results.reduce((total, hero) => total + hero.comics.available, 0));

        setFilteredResults(json.data.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllHeroesData();
  }, []);


  const searchItems = () => {
    let totalAvailableStories = 0;
    let totalAvailableComics = 0;
  
    if (searchInput !== "") {
      const filteredData = data.data.results.filter((hero) => 
        hero.name.toLowerCase().includes(searchInput.toLowerCase())
      );
  
      // Calculate total available stories count for filtered data
      totalAvailableStories = filteredData.reduce((total, hero) => total + hero.stories.available, 0);
      totalAvailableComics = filteredData.reduce((total, hero) => total + hero.comics.available, 0);

      setSearchLimit(filteredData.length);
      setFilteredResults(filteredData);
      setIsEmptyResult(filteredData.length === 0);
      setSearchInput('');
    } else {
      setFilteredResults(data.data.results);
      setIsEmptyResult(false);
      // Calculate total available stories count for all heroes
      setSearchLimit(data.data.results.length);
      totalAvailableStories = data.data.results.reduce((total, hero) => total + hero.stories.available, 0);
      totalAvailableComics = data.data.results.reduce((total, hero) => total + hero.comics.available, 0);
    }
  
    // Set the total available stories count
    setTotalAvailableStories(totalAvailableStories);
    setTotalAvailableComics(totalAvailableComics);
  };

  return (
  <>
    <div className='main-block'>
      <h1 className='main-header'>🦸 Marvel Heroes 🦸‍♀️</h1>
      <div className="search-container">
        <input 
          type="text" 
          placeholder='Find your hero!'           
          value={searchInput}
          onChange={handleInputChange}
        /> 
        <button className='button' onClick={searchItems}>Search!</button>
      </div>

      <div className="card">
          {isEmptyResult === false ? (
        <table className="hero-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Stories available</th>
              <th>Comics available</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((hero) => (
              <tr key={hero.id}>
                <td>{hero.name}</td>
                <td>
                  <img
                    src={`${hero.thumbnail.path}.${hero.thumbnail.extension}`}
                    alt={hero.name}
                    className="hero-image"
                  />
                </td>
                <td>{hero.stories.available}</td>
                <td>{hero.comics.available}</td>
                <td>{hero.modified.split("T")[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
    ) : (
      <h2>Sorry, we couldn't find any hero with that name.</h2>
    )}
    </div>

    </div>

    <SideNav 
      searchLimit={searchLimit}
      totalAvailableStories = {totalAvailableStories}
      totalAvailableComics = {totalAvailableComics}
      handleSort={handleSort}
      />

  </>
  );
}

export default App;