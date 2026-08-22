import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  FiSearch,
  FiTrash2,
  FiArrowRight,
  FiPlus,
  FiX,
  FiAlertTriangle
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

  const [query, setQuery] = useState(reduxSearchTerm || '')
  const [deckToDelete, setDeckToDelete] = useState(null)

  const handleSearchChange = (e) => {
    const value = e.target.value
    setQuery(value)
    dispatch(setSearchTerm(value))
  }

  const clearSearch = () => {
    setQuery('')
    dispatch(setSearchTerm(''))
  }

  const totalTermsCount = useMemo(() => {
    return flashcards.reduce((acc, deck) => acc + (deck.terms?.length || 0), 0)
  }, [flashcards])

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

  const handleConfirmDelete = () => {
    if (deckToDelete) {
      dispatch(deleteFlashcard(deckToDelete.id))
      setDeckToDelete(null)
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Dark Hero & Metric Ribbon */}
      <div className="card-dark p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle decorative background gradient accent */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gradient-to-br from-brand-orange/10 via-brand-magenta/10 to-brand-periwinkle/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-brand-mint bg-surface-dark-soft px-2 py-0.5 rounded-xs border border-hairline-dark">
                DATABASE // REPOSITORY
              </span>
              <span className="font-mono text-[11px] text-ink-light">LOCAL CACHE</span>
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-medium tracking-tight text-white">
              Flashcard Library
            </h1>
            <p className="text-xs sm:text-sm text-ink-light max-w-xl leading-relaxed">
              Explore your organized card decks, track vocabulary retention, and launch active study sessions.
            </p>
          </div>

          {/* Key Metrics Cluster */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-surface-dark-soft border border-hairline-dark p-3 rounded-sm flex-1 sm:flex-initial sm:min-w-[110px]">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-ink-light mb-1">
                Decks
              </span>
              <span className="font-mono text-xl sm:text-2xl font-semibold text-white">
                {String(flashcards.length).padStart(2, '0')}
              </span>
            </div>

            <div className="bg-brand-mint p-3 rounded-sm flex-1 sm:flex-initial sm:min-w-[110px] border border-[#a8edf2]">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-ink font-semibold mb-1">
                Cards
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-ink">
                {String(totalTermsCount).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Create Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        {/* Search Input */}
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-muted">
            <FiSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            placeholder="Search decks by keyword or term..."
            className="input-field pl-9 pr-8 text-xs font-mono"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-muted hover:text-ink"
              title="Clear search"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Create Deck CTA */}
        <Link to="/" className="btn-primary w-full sm:w-auto justify-center">
          <FiPlus className="w-3.5 h-3.5" />
          <span>New Flashcard Deck</span>
        </Link>
      </div>

      {/* Empty State */}
      {flashcards.length === 0 ? (
        <div className="card-surface p-12 text-center max-w-md mx-auto space-y-4 my-8">
          <div className="w-12 h-12 rounded-sm bg-canvas-dark flex items-center justify-center mx-auto text-white">
            <TbCards className="w-6 h-6 text-brand-mint" />
          </div>
          <div className="space-y-1">
            <h3 className="font-sans text-lg font-medium text-ink">
              No Flashcard Decks Found
            </h3>
            <p className="text-xs text-ink-muted max-w-xs mx-auto">
              Get started by creating your first deck with custom terms, definitions, and images.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/" className="btn-primary text-xs">
              <FiPlus className="w-3.5 h-3.5" />
              <span>Create Initial Deck</span>
            </Link>
          </div>
        </div>
      ) : filteredDecks.length === 0 ? (
        /* No search results found */
        <div className="card-surface p-10 text-center max-w-md mx-auto space-y-4 my-8">
          <div className="w-10 h-10 rounded-sm bg-canvas-soft border border-hairline flex items-center justify-center mx-auto text-ink-muted">
            <FiSearch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans text-base font-medium text-ink">
              No Matching Decks
            </h3>
            <p className="text-xs text-ink-muted mt-1 font-mono">
              No decks matched &ldquo;{query}&rdquo;
            </p>
          </div>
          <button
            type="button"
            onClick={clearSearch}
            className="btn-secondary-white text-xs"
          >
            Clear Search
          </button>
        </div>
      ) : (
        /* Deck Cards Grid */
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
                className="card-surface flex flex-col justify-between hover:border-ink transition-colors duration-150 group max-w-[500px] mx-auto w-full md:max-w-none"
              >
                <div>
                  {/* Deck Header Image or Pattern Banner */}
                  <Link
                    to={`/flashcard/${deck.id}`}
                    className="block focus:outline-none overflow-hidden"
                  >
                    {deck.groupImage ? (
                      <div className="h-36 w-full overflow-hidden bg-canvas-dark relative border-b border-hairline">
                        <img
                          src={deck.groupImage}
                          alt={deck.groupName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <span className="absolute top-2.5 right-2.5 badge-mono bg-canvas text-ink font-semibold shadow-sm">
                          {String(termCount).padStart(2, '0')} CARDS
                        </span>
                      </div>
                    ) : (
                      <div className="h-36 w-full bg-surface-dark p-5 flex items-center justify-between border-b border-hairline-dark relative overflow-hidden">
                        <div className="w-10 h-10 rounded-sm bg-surface-dark-soft border border-hairline-dark flex items-center justify-center text-white">
                          <TbCards className="w-5 h-5 text-brand-mint" />
                        </div>
                        <span className="absolute top-2.5 right-2.5 badge-mono badge-mint">
                          {String(termCount).padStart(2, '0')} CARDS
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Deck Card Content */}
                  <div className="p-5 space-y-2">
                    <h3
                      className="font-sans text-base font-medium text-ink line-clamp-1 transition-colors"
                      title={deck.groupName}
                    >
                      <Link
                        to={`/flashcard/${deck.id}`}
                        className="hover:underline text-ink"
                      >
                        {deck.groupName}
                      </Link>
                    </h3>

                    <p
                      className="text-xs text-ink-muted line-clamp-2 leading-relaxed"
                      title={deck.groupDescription}
                    >
                      {deck.groupDescription}
                    </p>

                    {formattedDate && (
                      <p className="font-mono text-[10px] text-ink-light pt-1 uppercase tracking-wider">
                        CREATED: {formattedDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Deck Card Action Footer */}
                <div className="px-5 py-3 bg-canvas-soft border-t border-hairline flex items-center justify-between">
                  <Link
                    to={`/flashcard/${deck.id}`}
                    className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider font-medium text-ink hover:underline"
                  >
                    <span>Study Deck</span>
                    <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setDeckToDelete(deck)}
                    className="p-1.5 text-ink-light hover:text-red-600 rounded-xs hover:bg-red-50 transition-colors"
                    title="Delete Deck"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deckToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="card-surface max-w-md w-full p-6 space-y-5 border border-hairline shadow-soft-drop">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-sm bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 border border-red-200">
                <FiAlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-sans text-base font-medium text-ink">
                  Delete Flashcard Deck?
                </h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Are you sure you want to permanently delete{' '}
                  <span className="font-medium text-ink font-mono">
                    &ldquo;{deckToDelete.groupName}&rdquo;
                  </span>
                  ? All {deckToDelete.terms?.length || 0} associated cards will be removed.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-hairline">
              <button
                type="button"
                onClick={() => setDeckToDelete(null)}
                className="btn-secondary-white text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="btn-primary bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700 text-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

