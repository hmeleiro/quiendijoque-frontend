import React, { useState, useEffect } from 'react'
import axios from 'axios'

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchEntities, setSearchEntities] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isQuote, setIsQuote] = useState(false) // Toggle switch state
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

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
          end_date: endDate
        })
        setSearchResults(response.data)
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
        }
      }, delay)
    }

    debounceSearch()

    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchTerm, searchEntities, isQuote, startDate, endDate]) // Include startDate and endDate in the dependency array

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleEntitiesChange = (event) => {
    setSearchEntities(event.target.value)
  }

  const handleToggleChange = () => {
    setIsQuote(!isQuote) // Toggle the isQuote value
  }

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value)
  }

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value)
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
      <ul>
        {searchResults.map((result) => {
          console.log(result)
          const headline = result.headline
          {
            /* const source = result.source */
          }
          const source = 'El País'
          const date = new Date(result.date)
          const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
          return result.sentences.map((sentence, i) => {
            const entities_text = sentence.entities.map((entity) => {
              return (
                <span className="bg-red-500 text-white mr-2 pt-1 pb-1 pl-2 pr-2 rounded-md">
                  {' '}
                  {entity[0]}{' '}
                </span>
              )
            })
            console.log(formattedDate)
            return (
              <div
                key={i}
                className="bg-slate-300 mb-5 p-4 rounded-lg text-left"
              >
                <p className="text-lg font-bold"> {headline} </p>
                <p className="font-light">
                  {' '}
                  <span>{source}</span> <span>({formattedDate})</span>{' '}
                </p>
                <p className="mb-3">{sentence.text}</p>
                <p className="mb-3">{entities_text} </p>
              </div>
            )
          })
        })}
      </ul>
    </div>
  )
}

export default SearchBar
