import { createSlice } from '@reduxjs/toolkit'
import { loadState } from './localStorage'

const initialState = {
  flashcards: loadState(),
  searchTerm: ''
}

const flashcardSlice = createSlice({
  name: 'flashcards',
  initialState,
  reducers: {
    // Add a newly created flashcard deck to the top of the collection
    addFlashcard: (state, action) => {
      state.flashcards.unshift(action.payload)
    },

    // Delete a flashcard deck by its unique ID
    deleteFlashcard: (state, action) => {
      const deckId = action.payload
      state.flashcards = state.flashcards.filter((deck) => deck.id !== deckId)
    },

    // Update an existing flashcard deck
    updateFlashcard: (state, action) => {
      const updatedDeck = action.payload
      const index = state.flashcards.findIndex((deck) => deck.id === updatedDeck.id)
      if (index !== -1) {
        state.flashcards[index] = updatedDeck
      }
    },

    // Update the search/filter query for library view
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
    },

    // Reset/clear all decks if needed
    clearAllFlashcards: (state) => {
      state.flashcards = []
    }
  }
})

// Export action creators
export const {
  addFlashcard,
  deleteFlashcard,
  updateFlashcard,
  setSearchTerm,
  clearAllFlashcards
} = flashcardSlice.actions

// Selector helpers
export const selectAllFlashcards = (state) => state.flashcards.flashcards
export const selectSearchTerm = (state) => state.flashcards.searchTerm
export const selectFlashcardById = (id) => (state) =>
  state.flashcards.flashcards.find((deck) => deck.id === id)

export default flashcardSlice.reducer
