// Check if IndexedDB is available (better for large files than localStorage)
const isIndexedDBAvailable = () => {
  return "indexedDB" in window
}

// Save book metadata to localStorage (without the PDF data)
const saveBookMetadataToLocalStorage = (book, savedAt) => {
  try {
    // Get existing saved books metadata
    const savedBooksMetadata = JSON.parse(localStorage.getItem("savedBooksMetadata")) || []

    // Check if book already exists
    const bookIndex = savedBooksMetadata.findIndex((savedBook) => savedBook.id === book.id)

    // Create metadata object (without the large PDF data)
    const bookMetadata = {
      ...book,
      savedAt,
      hasPdfData: true, // Flag indicating the PDF data is stored in IndexedDB
    }

    // Update or add the book metadata
    if (bookIndex >= 0) {
      savedBooksMetadata[bookIndex] = bookMetadata
    } else {
      savedBooksMetadata.push(bookMetadata)
    }

    // Save back to localStorage
    localStorage.setItem("savedBooksMetadata", JSON.stringify(savedBooksMetadata))

    return true
  } catch (error) {
    console.error("Error saving book metadata:", error)
    return false
  }
}

// Save PDF data to IndexedDB
const savePdfToIndexedDB = async (bookId, pdfData) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("BookshelfDB", 1)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains("pdfFiles")) {
        db.createObjectStore("pdfFiles", { keyPath: "id" })
      }
    }

    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(["pdfFiles"], "readwrite")
      const store = transaction.objectStore("pdfFiles")

      const storeRequest = store.put({ id: bookId, data: pdfData })

      storeRequest.onsuccess = () => resolve(true)
      storeRequest.onerror = (e) => reject(e.target.error)
    }

    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

// Get PDF data from IndexedDB
const getPdfFromIndexedDB = async (bookId) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("BookshelfDB", 1)

    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(["pdfFiles"], "readonly")
      const store = transaction.objectStore("pdfFiles")

      const getRequest = store.get(bookId)

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          resolve(getRequest.result.data)
        } else {
          resolve(null)
        }
      }

      getRequest.onerror = (e) => reject(e.target.error)
    }

    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

// Delete PDF data from IndexedDB
const deletePdfFromIndexedDB = async (bookId) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("BookshelfDB", 1)

    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(["pdfFiles"], "readwrite")
      const store = transaction.objectStore("pdfFiles")

      const deleteRequest = store.delete(bookId)

      deleteRequest.onsuccess = () => resolve(true)
      deleteRequest.onerror = (e) => reject(e.target.error)
    }

    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

// Main function to save a book
export const saveBookToLocalStorage = async (book) => {
  try {
    // Get existing saved books metadata
    const savedBooksMetadata = JSON.parse(localStorage.getItem("savedBooksMetadata")) || []

    // Check if book already exists in saved books
    const bookExists = savedBooksMetadata.some((savedBook) => savedBook.id === book.id)

    if (bookExists) {
      return { success: false, message: "Book already saved" }
    }

    // Fetch the PDF file
    const response = await fetch(book.url)
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.statusText}`)
    }

    const pdfBlob = await response.blob()

    // Create timestamp
    const savedAt = new Date().toISOString()

    if (isIndexedDBAvailable() && pdfBlob.size > 5 * 1024 * 1024) {
      // For large files, use IndexedDB
      await savePdfToIndexedDB(book.id, pdfBlob)
      saveBookMetadataToLocalStorage(book, savedAt)
    } else {
      // For smaller files or if IndexedDB is not available, use localStorage with base64
      const reader = new FileReader()

      const base64Promise = new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(pdfBlob)
      })

      const base64data = await base64Promise

      // Save book metadata and PDF data
      const bookToSave = {
        ...book,
        pdfData: base64data,
        savedAt,
      }

      // Add to saved books
      savedBooksMetadata.push(bookToSave)

      // Save back to localStorage
      localStorage.setItem("savedBooksMetadata", JSON.stringify(savedBooksMetadata))
    }

    return { success: true }
  } catch (error) {
    console.error("Error saving book:", error)
    return { success: false, message: error.message }
  }
}

export const getSavedBooks = async () => {
  try {
    const savedBooksMetadata = JSON.parse(localStorage.getItem("savedBooksMetadata")) || []

    // If using the old format, migrate to the new format
    const oldSavedBooks = JSON.parse(localStorage.getItem("savedBooks")) || []
    if (oldSavedBooks.length > 0 && savedBooksMetadata.length === 0) {
      localStorage.setItem("savedBooksMetadata", JSON.stringify(oldSavedBooks))
      localStorage.removeItem("savedBooks") // Clean up old data
      return oldSavedBooks
    }

    return savedBooksMetadata
  } catch (error) {
    console.error("Error getting saved books:", error)
    return []
  }
}

export const getSavedBookData = async (bookId) => {
  try {
    const savedBooksMetadata = await getSavedBooks()
    const book = savedBooksMetadata.find((book) => book.id === bookId)

    if (!book) {
      return null
    }

    // If the book has PDF data directly in the metadata
    if (book.pdfData) {
      return book
    }

    // Otherwise, try to get the PDF data from IndexedDB
    if (isIndexedDBAvailable() && book.hasPdfData) {
      const pdfData = await getPdfFromIndexedDB(bookId)
      if (pdfData) {
        // Convert Blob to base64 for consistency
        const reader = new FileReader()
        const base64Promise = new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(pdfData)
        })

        const base64data = await base64Promise
        return { ...book, pdfData: base64data }
      }
    }

    return book
  } catch (error) {
    console.error("Error getting saved book data:", error)
    return null
  }
}

export const removeBookFromLocalStorage = async (bookId) => {
  try {
    const savedBooksMetadata = JSON.parse(localStorage.getItem("savedBooksMetadata")) || []
    const updatedBooks = savedBooksMetadata.filter((book) => book.id !== bookId)
    localStorage.setItem("savedBooksMetadata", JSON.stringify(updatedBooks))

    // Also try to remove from IndexedDB if available
    if (isIndexedDBAvailable()) {
      await deletePdfFromIndexedDB(bookId)
    }

    return { success: true }
  } catch (error) {
    console.error("Error removing book:", error)
    return { success: false, message: error.message }
  }
}

