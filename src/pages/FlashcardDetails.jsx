import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  FiArrowLeft,
  FiChevronRight,
  FiChevronLeft,
  FiLayers,
  FiCalendar,
  FiImage
} from 'react-icons/fi'
import { TbCards } from 'react-icons/tb'
import { selectAllFlashcards } from '../redux/flashcardSlice'

export default function FlashcardDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const flashcards = useSelector(selectAllFlashcards)

  // Find current deck by URL parameter
  const deck = flashcards.find((item) => item.id === id)

  // Active selected term index (defaults to first term 0)
  const [activeTermIndex, setActiveTermIndex] = useState(0)

  // Reset active term if deck changes or term count reduces
  useEffect(() => {
    setActiveTermIndex(0)
  }, [id])

  // If deck does not exist, show friendly missing state
  if (!deck) {
    return (
      <div className="space-y-6 max-w-lg mx-auto py-12 text-center">
        <div className="apple-card p-10 bg-white space-y-4">
          <div className="w-14 h-14 rounded-apple-md bg-apple-surface flex items-center justify-center mx-auto text-apple-muted">
            <TbCards className="w-7 h-7 text-apple-danger" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display text-xl font-semibold text-apple-ink">
              Flashcard Deck Not Found
            </h2>
            <p className="text-sm text-apple-muted leading-relaxed">
              The requested flashcard deck could not be located or may have been deleted.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/my-flashcards" className="btn-apple-primary">
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to My Flashcards</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const terms = deck.terms || []
  const activeTerm = terms[activeTermIndex] || terms[0]
  const formattedDate = deck.createdAt
    ? new Date(deck.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null

  // Navigation helpers between terms
  const handlePrevTerm = () => {
    setActiveTermIndex((prev) => (prev > 0 ? prev - 1 : terms.length - 1))
  }

  const handleNextTerm = () => {
    setActiveTermIndex((prev) => (prev < terms.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Navigation & Deck Overview */}
      <div className="space-y-4">
        {/* Back Link */}
        <div>
          <button
            type="button"
            onClick={() => navigate('/my-flashcards')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-apple-muted hover:text-apple-blue transition-colors group"
          >
            <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to My Flashcards</span>
          </button>
        </div>

        {/* Deck Header Card */}
        <div className="apple-card p-6 sm:p-8 bg-white border border-apple-border/80">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="apple-badge apple-badge-accent">
                  <FiLayers className="w-3.5 h-3.5" />
                  {terms.length} {terms.length === 1 ? 'Card' : 'Cards'}
                </span>

                {formattedDate && (
                  <span className="apple-badge">
                    <FiCalendar className="w-3.5 h-3.5 text-apple-muted" />
                    {formattedDate}
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-apple-ink tracking-tight">
                {deck.groupName}
              </h1>

              <p className="text-sm sm:text-base text-apple-muted leading-relaxed max-w-3xl">
                {deck.groupDescription}
              </p>
            </div>

            {/* Optional Deck Cover Thumbnail */}
            {deck.groupImage && (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-apple-md overflow-hidden border border-apple-border flex-shrink-0 shadow-sm">
                <img
                  src={deck.groupImage}
                  alt={deck.groupName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Details Grid: Left Terms Sidebar + Center Term Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: List of Terms */}
        <div className="lg:col-span-4 space-y-3">
          <div className="apple-card bg-white p-4 sm:p-5 border border-apple-border/80 space-y-3">
            <div className="flex items-center justify-between border-b border-apple-border/50 pb-3">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-apple-ink">
                Flashcards
              </h2>
              <span className="text-xs font-medium text-apple-muted">
                {terms.length} Total
              </span>
            </div>

            {/* Scrollable list of terms */}
            <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
              {terms.map((item, index) => {
                const isActive = index === activeTermIndex
                return (
                  <button
                    key={item.id || index}
                    type="button"
                    onClick={() => setActiveTermIndex(index)}
                    className={`w-full text-left p-3 rounded-apple-sm text-sm font-medium transition-all duration-150 flex items-center justify-between group ${
                      isActive
                        ? 'bg-apple-blue text-white shadow-sm font-semibold'
                        : 'text-apple-ink hover:bg-apple-surface/80 border border-transparent hover:border-apple-border/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-mono ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-apple-surface text-apple-muted group-hover:bg-white group-hover:text-apple-ink'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="truncate">{item.term || `Term ${index + 1}`}</span>
                    </div>

                    <FiChevronRight
                      className={`w-4 h-4 flex-shrink-0 transition-transform ${
                        isActive ? 'text-white' : 'text-apple-muted group-hover:translate-x-0.5'
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Center / Right: Active Term Card & Viewer Preview */}
        <div className="lg:col-span-8 space-y-4">
          {activeTerm ? (
            <div className="apple-card bg-white p-6 sm:p-8 border border-apple-border/80 space-y-6 min-h-[380px] flex flex-col justify-between shadow-sm">
              {/* Term Header & Index */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-apple-border/40 pb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-apple-blue">
                    Card {activeTermIndex + 1} of {terms.length}
                  </span>
                  <span className="apple-badge">
                    Term {activeTermIndex + 1}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Term Title */}
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-apple-ink">
                    {activeTerm.term}
                  </h3>

                  {/* Optional Term Image */}
                  {activeTerm.image && (
                    <div className="max-w-md max-h-64 overflow-hidden rounded-apple-sm border border-apple-border my-3">
                      <img
                        src={activeTerm.image}
                        alt={activeTerm.term}
                        className="w-full h-full object-contain bg-apple-surface"
                      />
                    </div>
                  )}

                  {/* Term Definition */}
                  <div className="pt-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-apple-muted mb-1.5">
                      Definition
                    </h4>
                    <p className="text-apple-ink text-base sm:text-lg leading-relaxed whitespace-pre-line">
                      {activeTerm.definition}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Controls between terms */}
              <div className="pt-6 border-t border-apple-border/50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevTerm}
                  className="btn-apple-secondary text-xs sm:text-sm px-4 py-2"
                  title="Previous term"
                >
                  <FiChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="text-xs text-apple-muted font-medium">
                  {activeTermIndex + 1} / {terms.length}
                </div>

                <button
                  type="button"
                  onClick={handleNextTerm}
                  className="btn-apple-primary text-xs sm:text-sm px-4 py-2"
                  title="Next term"
                >
                  <span>Next</span>
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="apple-card p-12 text-center bg-white">
              <p className="text-apple-muted text-sm">No term selected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
