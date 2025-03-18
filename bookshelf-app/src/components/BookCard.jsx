"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { saveBookToLocalStorage } from "../utils/localStorageUtils"
import { toast } from "react-toastify"

function BookCard({ book, isSaved, onRemove }) {
  const [saving, setSaving] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      setSaving(true)
      const result = await saveBookToLocalStorage(book)

      if (result.success) {
        toast.success(`"${book.title}" saved to your library`)
      } else {
        toast.info(result.message || "Book already in your library")
      }
    } catch (error) {
      toast.error(`Error saving book: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onRemove(book.id)
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size"
    const units = ["B", "KB", "MB", "GB"]
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  return (
    <Link to={`/view/${book.id}`} className="book-card">
      <div className="book-cover-container">
        <img
          src={imageError ? "/placeholder-book-cover.jpg" : book.cover}
          alt={book.title}
          className="book-cover"
          onError={() => setImageError(true)}
        />
        <div className="book-overlay">
          {!isSaved ? (
            <button onClick={handleSave} className={`save-button ${saving ? "saving" : ""}`} disabled={saving}>
              {saving ? "Saving..." : "Save Offline"}
            </button>
          ) : (
            <button onClick={handleRemove} className="remove-button">
              Remove
            </button>
          )}
        </div>
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        {book.size && <p className="book-size">{formatFileSize(book.size)}</p>}
        {isSaved && <div className="saved-badge">Saved</div>}
      </div>
    </Link>
  )
}

export default BookCard

