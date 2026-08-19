import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import CreateFlashcard from './pages/CreateFlashcard'
import MyFlashcards from './pages/MyFlashcards'
import FlashcardDetails from './pages/FlashcardDetails'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<CreateFlashcard />} />
          <Route path="/create" element={<Navigate to="/" replace />} />
          <Route path="/my-flashcards" element={<MyFlashcards />} />
          <Route path="/flashcard/:id" element={<FlashcardDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
