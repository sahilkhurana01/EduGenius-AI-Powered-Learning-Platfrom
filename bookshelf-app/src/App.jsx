"use client"

import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import BookshelfPage from "./pages/BookshelfPage"
import SavedBooksPage from "./pages/SavedBooksPage"
import PdfViewerPage from "./pages/PdfViewerPage"
import { supabase } from "./supabaseClient"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./App.css"

function App() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  async function fetchBooks() {
    try {
      setLoading(true)
      setError(null)

      // Get books from Supabase storage
      const { data, error } = await supabase.storage.from("books").list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      })

      if (error) {
        throw error
      }

      // Only include PDF files
      const pdfFiles = data.filter((file) => file.name.toLowerCase().endsWith(".pdf"))

      // Get metadata for each book if you have a separate table for book metadata
      const booksWithMetadata = await Promise.all(
        pdfFiles.map(async (file) => {
          try {
            // Get metadata from Supabase database if available
            const { data: metadata, error: metadataError } = await supabase
              .from("book_metadata")
              .select("*")
              .eq("filename", file.name)
              .single()

            if (metadataError && metadataError.code !== "PGRST116") {
              console.warn(`Metadata error for ${file.name}:`, metadataError)
            }

            // Create public URL for the book
            const { data: publicURL } = await supabase.storage.from("books").getPublicUrl(file.name)

            return {
              id: file.id,
              name: file.name,
              title: metadata?.title || file.name.replace(".pdf", ""),
              author: metadata?.author || "Unknown",
              cover: metadata?.cover_url || "/placeholder-book-cover.jpg",
              url: publicURL.publicUrl,
              size: file.metadata?.size || 0,
              created_at: file.created_at,
            }
          } catch (err) {
            console.error(`Error processing file ${file.name}:`, err)
            return null
          }
        }),
      )

      // Filter out any null entries from errors
      setBooks(booksWithMetadata.filter(Boolean))
    } catch (error) {
      console.error("Error fetching books:", error.message)
      setError(error.message)
      toast.error(`Failed to load books: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Navbar />
      <div className="container">
        {error && !loading && (
          <div className="error-container">
            <p>Error loading books: {error}</p>
            <button onClick={fetchBooks} className="retry-button">
              Retry
            </button>
          </div>
        )}
        <Routes>
          <Route path="/" element={<BookshelfPage books={books} loading={loading} />} />
          <Route path="/saved" element={<SavedBooksPage />} />
          <Route path="/view/:bookId" element={<PdfViewerPage books={books} />} />
        </Routes>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  )
}

export default App

