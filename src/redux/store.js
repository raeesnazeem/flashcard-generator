import { configureStore } from '@reduxjs/toolkit'
import flashcardReducer from './flashcardSlice'
import { saveState } from './localStorage'

export const store = configureStore({
  reducer: {
    flashcards: flashcardReducer
  }
})

// Automatically synchronize flashcard collection to localStorage on every state change
store.subscribe(() => {
  const currentFlashcards = store.getState().flashcards.flashcards
  saveState(currentFlashcards)
})

export default store
