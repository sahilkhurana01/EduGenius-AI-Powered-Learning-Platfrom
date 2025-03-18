"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getSavedBookData, saveBookToLocalStorage } from "../utils/localStorageUtils"
import { toast } from "react-toastify"
import * as pdfjsLib from "pdfjs-dist"

// Set the PDF.js worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

function PdfViewerPage({ books }) {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [pdfDoc, setPdfDoc] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingError, setLoadingError] = useState(null)
  const [scale, setScale] = useState(1.2)
  const [saving, setSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    loadBook()
  }, [bookId])

  const loadBook = async () => {
    setLoading(true)
    setLoadingError(null)

    try {
      // Check if the book is in saved books first
      const savedBook = await getSavedBookData(bookId)

      if (savedBook) {
        // Load from localStorage/IndexedDB
        setBook(savedBook)
        setIsSaved(true)
        await loadPdf(savedBook.pdfData)
      } else {
        // Load from Supabase
        const supabaseBook = books.find((b) => b.id === bookId)

        if (supabaseBook) {
          setBook(supabaseBook)
          setIsSaved(false)
          await loadPdf(supabaseBook.url)
        } else {
          setLoadingError("Book not found")
          toast.error("Book not found")
          navigate("/")
        }
      }
    } catch (error) {
      console.error("Error loading book:", error)
      setLoadingError(`Failed to load book: ${error.message}`)
      toast.error(`Error loading book: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const loadPdf = async (source) => {
    try {
      let pdfData

      if (typeof source === "string" && source.startsWith("data:")) {
        // It's a base64 string from localStorage
        const base64 = source.split(",")[1]
        const binary = atob(base64)
        const array = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i)
        }
        pdfData = array
      } else if (source instanceof Blob) {
        // It's a Blob from IndexedDB
        const arrayBuffer = await source.arrayBuffer()
        pdfData = new Uint8Array(arrayBuffer)
      } else {
        // It's a URL from Supabase
        const response = await fetch(source)
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.statusText}`)
        }
        const arrayBuffer = await response.arrayBuffer()
        pdfData = new Uint8Array(arrayBuffer)
      }

      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({ data: pdfData })
      const pdf = await loadingTask.promise

      setPdfDoc(pdf)
      setTotalPages(pdf.numPages)
      setCurrentPage(1)

      renderPage(1, pdf)
    } catch (error) {
      console.error("Error loading PDF:", error)
      setLoadingError(`Error loading PDF: ${error.message}`)
      toast.error("Error loading PDF")
    }
  }

  const renderPage = async (pageNum, pdf = pdfDoc) => {
    if (!pdf) return

    try {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale })

      const canvas = canvasRef.current
      if (!canvas) return

      const context = canvas.getContext("2d")

      canvas.height = viewport.height
      canvas.width = viewport.width

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      }

      await page.render(renderContext).promise
    } catch (error) {
      console.error("Error rendering page:", error)
      toast.error(`Error rendering page ${pageNum}`)
    }
  }

  const changePage = (delta) => {
    const newPage = currentPage + delta

    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      renderPage(newPage)
    }
  }

  const handleSaveBook = async () => {
    if (!book) return

    try {
      setSaving(true)
      const result = await saveBookToLocalStorage(book)

      if (result.success) {
        setIsSaved(true)
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

  const handleZoom = (delta) => {
    const newScale = scale + delta
    if (newScale >= 0.5 && newScale <= 3) {
      setScale(newScale)
      renderPage(currentPage)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading book...</p>
      </div>
    )
  }

  if (loadingError) {
    return (
      <div className="error-container">
        <p>{loadingError}</p>
        <button onClick={loadBook} className="retry-button">
          Retry
        </button>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="pdf-viewer-page">
      <div className="pdf-viewer-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; Back
        </button>

        <div className="book-title-container">
          <h2>{book?.title}</h2>
          <p className="book-author">{book?.author}</p>
        </div>

        <div className="pdf-controls">
          <button onClick={() => handleZoom(-0.1)} className="zoom-button">
            -
          </button>
          <span className="zoom-level">{Math.round(scale * 100)}%</span>
          <button onClick={() => handleZoom(0.1)} className="zoom-button">
            +
          </button>

          {!isSaved && (
            <button onClick={handleSaveBook} className="save-book-button" disabled={saving}>
              {saving ? "Saving..." : "Save Offline"}
            </button>
          )}

          {isSaved && <span className="saved-indicator">✓ Saved Offline</span>}
        </div>
      </div>

      <div className="pdf-container">
        <canvas ref={canvasRef}></canvas>
      </div>

      <div className="page-controls">
        <button onClick={() => changePage(-1)} disabled={currentPage <= 1} className="page-button">
          Previous
        </button>

        <div className="page-info">
          Page {currentPage} of {totalPages}
        </div>

        <button onClick={() => changePage(1)} disabled={currentPage >= totalPages} className="page-button">
          Next
        </button>
      </div>
    </div>
  )
}

export default PdfViewerPage

