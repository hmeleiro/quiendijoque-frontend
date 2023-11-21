import React, { useState, useEffect } from 'react'
import axios from 'axios'

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

  //   useEffect(() => {
  //     const testAPI = async () => {
  //       try {
  //         const response = await axios.get(`/api/test`)
  //         console.log(response.data)
  //       } catch (error) {
  //         console.error(error)
  //       }
  //     }
  //     testAPI()
  //   }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/search?q=${searchTerm}`)
        setSearchResults(response.data)
        console.log(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    if (searchTerm) {
      fetchData()
    } else {
      setSearchResults([])
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
