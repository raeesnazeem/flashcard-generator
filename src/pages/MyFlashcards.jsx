import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  FiSearch,
  FiTrash2,
  FiArrowRight,
  FiPlus,
  FiX,
  FiAlertTriangle,
  FiBookOpen
} from 'react-icons/fi'
import { TbCards } from 'react-icons/tb'
import {
  selectAllFlashcards,
  deleteFlashcard,
  selectSearchTerm,
  setSearchTerm
} from '../redux/flashcardSlice'

export default function MyFlashcards() {
  const dispatch = useDispatch()
  const flashcards = useSelector(selectAllFlashcards)
  const reduxSearchTerm = useSelector(selectSearchTerm)

  // Local state for search query and modal confirmation
  const [query, setQuery] = useState(reduxSearchTerm || '')
  const [deckToDelete, setDeckToDelete] = useState(null)

  // Sync search query changes
  const handleSearchChange = (e) => {
    const value = e.target.value
    setQuery(value)
    dispatch(setSearchTerm(value))
  }

  const clearSearch = () => {
    setQuery('')
    dispatch(setSearchTerm(''))
  }

  // Filter decks based on search keyword (matches group title, description, or term titles)
  const filteredDecks = useMemo(() => {
    if (!query.trim()) return flashcards

    const lowerQuery = query.toLowerCase().trim()
    return flashcards.filter((deck) => {
      const matchName = deck.groupName?.toLowerCase().includes(lowerQuery)
      const matchDesc = deck.groupDescription?.toLowerCase().includes(lowerQuery)
      const matchTerms = deck.terms?.some(
        (t) =>
          t.term?.toLowerCase().includes(lowerQuery) ||
          t.definition?.toLowerCase().includes(lowerQuery)
      )
      return matchName || matchDesc || matchTerms
    })
  }, [flashcards, query])

  // Confirm and execute deck deletion
  const handleConfirmDelete = () => {
    if (deckToDelete) {
      dispatch(deleteFlashcard(deckToDelete.id))
      setDeckToDelete(null)
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Search and Library Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-apple-ink tracking-tight">
            My Flashcard Decks
          </h2>
          <p className="text-sm text-apple-muted mt-1">
            Browse, manage, and study your saved flashcard collections.
          </p>
        </div>

        {/* Create Deck CTA */}
        {flashcards.length > 0 && (
          <Link
            to="/"
            className="btn-apple-primary self-start sm:self-auto shadow-sm"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create New Deck</span>
          </Link>
        )}
      </div>

      {/* Search / Filter Input */}
      {flashcards.length > 0 && (
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-apple-muted">
            <FiSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search decks by title, description, or terms..."
            className="apple-input pl-10 pr-10 text-sm bg-white shadow-sm"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-apple-muted hover:text-apple-ink"
              title="Clear search"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Case 1: Empty Collection (No decks created yet) */}
      {flashcards.length === 0 ? (
        <div className="apple-card p-12 text-center bg-white max-w-lg mx-auto space-y-5 my-8">
          <div className="w-16 h-16 rounded-apple-lg bg-apple-surface flex items-center justify-center mx-auto text-apple-muted border border-apple-border/60 shadow-sm">
            <TbCards className="w-8 h-8 text-apple-blue" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-xl font-semibold text-apple-ink">
              No Flashcard Decks Yet
            </h3>
            <p className="text-sm text-apple-muted max-w-sm mx-auto leading-relaxed">
              Create your first deck with custom terms, detailed definitions, and images to begin studying.
            </p>
          </div>
          <div>
            <Link to="/" className="btn-apple-primary px-6 py-2.5 font-semibold">
              <FiPlus className="w-4 h-4" />
              <span>Create Your First Deck</span>
            </Link>
          </div>
        </div>
      ) : filteredDecks.length === 0 ? (
        /* Case 2: No search results found */
        <div className="apple-card p-10 text-center bg-white max-w-md mx-auto space-y-4 my-8">
          <div className="w-12 h-12 rounded-full bg-apple-surface flex items-center justify-center mx-auto text-apple-muted">
            <FiSearch className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-apple-ink">
              No Matching Decks Found
            </h3>
            <p className="text-sm text-apple-muted mt-1">
              No flashcard decks match &ldquo;{query}&rdquo;.
            </p>
          </div>
          <button
            type="button"
            onClick={clearSearch}
            className="btn-apple-secondary text-xs px-4 py-2"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        /* Case 3: Display Deck Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDecks.map((deck) => {
            const termCount = deck.terms?.length || 0
            const formattedDate = deck.createdAt
              ? new Date(deck.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : null

            return (
              <div
                key={deck.id}
                className="apple-card bg-white overflow-hidden flex flex-col justify-between hover:shadow-apple-raised transition-all duration-200 group border border-apple-border/80"
              >
                <div>
                  {/* Deck Header Image or Fallback Banner */}
                  {deck.groupImage ? (
                    <div className="h-40 w-full overflow-hidden bg-apple-surface border-b border-apple-border/50 relative">
                      <img
                        src={deck.groupImage}
                        alt={deck.groupName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 right-3 apple-badge bg-white/90 backdrop-blur text-apple-ink font-medium shadow-sm">
                        {termCount} {termCount === 1 ? 'Card' : 'Cards'}
                      </span>
                    </div>
                  ) : (
                    <div className="h-28 w-full bg-gradient-to-br from-apple-surface to-apple-border-soft/60 border-b border-apple-border/50 p-4 flex items-center justify-between">
                      <div className="w-12 h-12 rounded-apple-md bg-white shadow-sm border border-apple-border/60 flex items-center justify-center text-apple-ink">
                        <TbCards className="w-6 h-6 text-apple-blue" />
                      </div>
                      <span className="apple-badge apple-badge-accent font-medium shadow-sm">
                        {termCount} {termCount === 1 ? 'Card' : 'Cards'}
                      </span>
                    </div>
                  )}

                  {/* Deck Content Info */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className="font-display text-lg font-semibold text-apple-ink line-clamp-1 group-hover:text-apple-blue transition-colors"
                        title={deck.groupName}
                      >
                        {deck.groupName}
                      </h3>
                    </div>

                    <p
                      className="text-xs sm:text-sm text-apple-muted line-clamp-2 leading-relaxed"
                      title={deck.groupDescription}
                    >
                      {deck.groupDescription}
                    </p>

                    {formattedDate && (
                      <p className="text-[11px] text-apple-meta pt-1">
                        Created on {formattedDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Deck Card Action Footer */}
                <div className="px-5 py-3.5 bg-apple-surface/40 border-t border-apple-border/50 flex items-center justify-between">
                  <Link
                    to={`/flashcard/${deck.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-apple-blue hover:text-apple-blue-hover transition-colors"
                  >
                    <span>View Cards</span>
                    <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setDeckToDelete(deck)}
                    className="p-1.5 text-apple-muted hover:text-apple-danger hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Deck"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deckToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="apple-card bg-white max-w-md w-full p-6 space-y-5 shadow-apple-raised border border-apple-border animate-scale-in">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 text-apple-danger flex items-center justify-center flex-shrink-0">
                <FiAlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-lg font-semibold text-apple-ink">
                  Delete Flashcard Deck?
                </h4>
                <p className="text-xs sm:text-sm text-apple-muted leading-relaxed">
                  Are you sure you want to delete{' '}
                  <span className="font-medium text-apple-ink">
                    &ldquo;{deckToDelete.groupName}&rdquo;
                  </span>
                  ? This will permanently remove all associated terms.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeckToDelete(null)}
                className="btn-apple-secondary text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="bg-apple-danger hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-apple-pill transition-colors shadow-sm"
              >
                Delete Deck
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
