import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ResultCard from './ResultCard'

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchEntities, setSearchEntities] = useState('')
  const [searchResultsCount, setSearchResultsCount] = useState(0)
  const [searchResults, setSearchResults] = useState([])
  const [isQuote, setIsQuote] = useState(false) // Toggle switch state
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(10)

  useEffect(() => {
    const delay = 500 // debounce delay in milliseconds
    let timeoutId

    const fetchData = async () => {
      try {
        const response = await axios.post('/api/search', {
          search_terms: searchTerm,
          entities: searchEntities.split(',').map((entity) => entity.trim()),
          is_quote: isQuote, // Pass isQuote value to the API
          start_date: startDate,
          end_date: endDate,
          page: currentPage,
          limit: resultsPerPage
        })
        setSearchResults(response.data.results)
        setSearchResultsCount(response.data.totalCount)
      } catch (error) {
        console.error(error)
      }
    }

    const debounceSearch = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (searchTerm || searchEntities) {
          fetchData()
        } else {
          setSearchResults([])
          setSearchResultsCount(0)
        }
      }, delay)
    }

    debounceSearch()

    return () => {
      clearTimeout(timeoutId)
    }
  }, [
    searchTerm,
    searchEntities,
    isQuote,
    startDate,
    endDate,
    currentPage,
    resultsPerPage
  ]) // Include currentPage and resultsPerPage in the dependency array

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
    setSearchResults([])
    setSearchResultsCount(0)
  }

  const handleEntitiesChange = (event) => {
    setSearchEntities(event.target.value)
    setCurrentPage(1)
    setSearchResults([])
    setSearchResultsCount(0)
  }

  const handleToggleChange = () => {
    setIsQuote(!isQuote) // Toggle the isQuote value
    setCurrentPage(1)
    setSearchResults([])
    setSearchResultsCount(0)
  }

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value)
    setCurrentPage(1)
    setSearchResults([])
    setSearchResultsCount(0)
  }

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value)
    setCurrentPage(1)
    setSearchResults([])
    setSearchResultsCount(0)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleResultsPerPageChange = (event) => {
    setResultsPerPage(event.target.value)
    setCurrentPage(1)
    setSearchResults([])
    setSearchResultsCount(0)
  }

  return (
    <div>
      <div className="mb-8">
        <input
          className="bg-slate-300 p-2 rounded-lg mr-2"
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search..."
        />
        <input
          className="bg-slate-300 p-2 rounded-lg"
          type="text"
          value={searchEntities}
          onChange={handleEntitiesChange}
          placeholder="Search Entities (comma-separated)..."
        />
      </div>
      <div className="mb-8">
        <label className="mr-2">Is Quote:</label>
        <input
          className="mr-2"
          type="checkbox"
          checked={isQuote}
          onChange={handleToggleChange}
        />
      </div>
      <div className="mb-8">
        <label className="mr-2">Start Date:</label>
        <input
          className="bg-slate-300 p-2 rounded-lg mr-2"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          placeholder="Start Date..."
        />
        <label className="mr-2">End Date:</label>
        <input
          className="bg-slate-300 p-2 rounded-lg"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          placeholder="End Date..."
        />
      </div>
      <div className="mb-8">
        <label className="mr-2 ">Resultados por página:</label>
        <select
          className="bg-slate-300 p-2 rounded-lg"
          value={resultsPerPage}
          onChange={handleResultsPerPageChange}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>
      <div className=" mb-4 mt-4">
        {
          /* Pagination */
          searchResults.length > 0 ? (
            <>
              {currentPage == 1 ? (
                ''
              ) : (
                <button
                  className="bg-slate-500 rounded-lg pb-2 pt-2 pl-3 pr-3 text-white"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
              )}

              <span className="m-4"> {searchResultsCount} resultados </span>
              <span className="m-4"> {currentPage} </span>

              {searchResults.length < 10 ? (
                ''
              ) : (
                <button
                  className="bg-slate-500 rounded-lg pb-2 pt-2 pl-3 pr-3 text-white"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Siguiente
                </button>
              )}
            </>
          ) : (
            ''
          )
        }
      </div>
      <ul>
        {searchResults.map((result, i) => {
          return <ResultCard key={i} result={result} />
        })}
      </ul>
      {
        /* Pagination */
        searchResults.length > 0 ? (
          <div>
            <button
              className="bg-slate-500 rounded-lg pb-2 pt-2 pl-3 pr-3 text-white m-4"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <button
              className="bg-slate-500 rounded-lg pb-2 pt-2 pl-3 pr-3 text-white"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Siguiente
            </button>
          </div>
        ) : (
          ''
        )
      }
    </div>
  )
}

export default SearchBar
