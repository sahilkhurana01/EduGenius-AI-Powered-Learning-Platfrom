"use client"

import { useState, useEffect } from "react"
import BookCard from "../components/BookCard"
import { getSavedBooks, removeBookFromLocalStorage } from "../utils/localStorageUtils"
import { toast } from "react-toastify"

function SavedBooksPage() {
  const [savedBooks, setSavedBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSavedBooks()
  }, [])

  const loadSavedBooks = async () => {
    setLoading(true)
    try {
      const books = await getSavedBooks()
      setSavedBooks(books)
    } catch (error) {
      toast.error(`Error loading saved books: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveBook = async (bookId) => {
    try {
      const result = await removeBookFromLocalStorage(bookId)

      if (result.success) {
        toast.success("Book removed from your library")
        loadSavedBooks()
      } else {
        toast.error(`Error removing book: ${result.message}`)
      }
    } catch (error) {
      toast.error(`Error removing book: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your library...</p>
      </div>
    )
  }

  return (
    <div className="saved-books-page">
      <h1>My Library</h1>

      {savedBooks.length === 0 ? (
        <div className="no-books">
          <p>You haven't saved any books yet.</p>
          <p className="text-muted">Browse the bookshelf and save books to read offline.</p>
        </div>
      ) : (
        <div className="books-grid">
          {savedBooks.map((book) => (
            <BookCard key={book.id} book={book} isSaved={true} onRemove={handleRemoveBook} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedBooksPage

