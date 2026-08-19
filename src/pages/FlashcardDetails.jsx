import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

export default function FlashcardDetails() {
  const { id } = useParams()

  return (
    <div className="space-y-4 apple-fade-in">
      <Link
        to="/my-flashcards"
        className="inline-flex items-center gap-2 text-sm font-medium text-apple-muted hover:text-apple-blue transition-colors"
      >
        <FaArrowLeft className="w-3.5 h-3.5" /> Back to My Flashcards
      </Link>
      <div className="apple-card p-6 sm:p-8">
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-apple-ink mb-2">
          Flashcard Details
        </h2>
        <p className="text-apple-muted text-sm sm:text-base leading-relaxed">
          Deck ID: <span className="font-mono text-apple-ink bg-apple-surface px-2 py-0.5 rounded-apple-xs border border-apple-border/60">{id}</span>
        </p>
      </div>
    </div>
  )
}

