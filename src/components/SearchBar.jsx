import React, { useState, useEffect } from 'react'
import axios from 'axios'

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    const delay = 500 // debounce delay in milliseconds
    let timeoutId

    const fetchData = async () => {
      try {
        const response = await axios.post('/api/search', {
          search_terms: searchTerm
        })
        setSearchResults(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    const debounceSearch = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (searchTerm) {
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
  }, [searchTerm])

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search..."
      />
      <ul>
        {searchResults.map((result) => {
          return result.sentences.map((sentence, i) => {
            const entities_text = sentence.entities.map((entity) => {
              return <span> {entity[0]} </span>
            })
            return (
              <div key={i}>
                <p>{sentence.text}</p>
                <p>{entities_text} </p>
              </div>
            )
          })
        })}
      </ul>
    </div>
  )
}

export default SearchBar
