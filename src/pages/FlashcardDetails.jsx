import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  FiArrowLeft,
  FiChevronRight,
  FiChevronLeft,
  FiShare2,
  FiPrinter,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiX,
  FiLayers,
  FiCalendar,
  FiPlus,
  FiAlertTriangle
} from 'react-icons/fi'
import {
  FaWhatsapp,
  FaTwitter,
  FaLinkedin,
  FaEnvelope
} from 'react-icons/fa'
import { TbCards } from 'react-icons/tb'
import { selectAllFlashcards, deleteFlashcard } from '../redux/flashcardSlice'

export default function FlashcardDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const flashcards = useSelector(selectAllFlashcards)

  const deck = flashcards.find((item) => item.id === id)

  const [activeTermIndex, setActiveTermIndex] = useState(0)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [copiedToast, setCopiedToast] = useState(false)

  const terms = deck?.terms || []
  const activeTerm = terms[activeTermIndex] || terms[0]

  useEffect(() => {
    setActiveTermIndex(0)
  }, [id])

  const handlePrevTerm = useCallback(() => {
    if (terms.length <= 1) return
    setActiveTermIndex((prev) => (prev > 0 ? prev - 1 : terms.length - 1))
  }, [terms.length])

  const handleNextTerm = useCallback(() => {
    if (terms.length <= 1) return
    setActiveTermIndex((prev) => (prev < terms.length - 1 ? prev + 1 : 0))
  }, [terms.length])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrevTerm()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNextTerm()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePrevTerm, handleNextTerm])

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setCopiedToast(true)
      setTimeout(() => setCopiedToast(false), 2000)
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleConfirmDelete = () => {
    if (deck) {
      dispatch(deleteFlashcard(deck.id))
      navigate('/my-flashcards')
    }
  }

  if (!deck) {
    return (
      <div className="space-y-6 max-w-lg mx-auto py-12 text-center no-print">
        <div className="card-surface p-10 space-y-4">
          <div className="w-12 h-12 rounded-sm bg-canvas-dark flex items-center justify-center mx-auto text-white">
            <TbCards className="w-6 h-6 text-brand-orange" />
          </div>
          <div className="space-y-1">
            <h2 className="font-sans text-xl font-medium text-ink">
              Flashcard Deck Not Found
            </h2>
            <p className="text-xs text-ink-muted leading-relaxed">
              The requested collection could not be located or may have been deleted.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/my-flashcards" className="btn-primary">
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to Library</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const shareUrl = window.location.href
  const shareText = `Check out this flashcard deck: "${deck.groupName}" on Flashcard Platform!`
  const formattedDate = deck.createdAt
    ? new Date(deck.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null

  return (
    <div className="space-y-8 pb-16">
      {/* Header Overview Bar */}
      <div className="space-y-4 no-print">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/my-flashcards')}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-ink transition-colors group"
          >
            <FiArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Library</span>
          </button>

          <span className="badge-mono">ACTIVE DECK</span>
        </div>

        <div className="card-surface p-4 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-mono badge-mint">
                  <FiLayers className="w-3 h-3" />
                  {terms.length} {terms.length === 1 ? 'CARD' : 'CARDS'}
                </span>

                {formattedDate && (
                  <span className="badge-mono">
                    <FiCalendar className="w-3 h-3 text-ink-muted" />
                    {formattedDate}
                  </span>
                )}
              </div>

              <h1 className="font-sans text-2xl sm:text-3xl font-medium text-ink tracking-tight">
                {deck.groupName}
              </h1>

              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-3xl">
                {deck.groupDescription}
              </p>
            </div>

            {deck.groupImage && (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-sm overflow-hidden border border-hairline flex-shrink-0">
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

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start no-print">
        {/* Left Column: Terms Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-3 order-2 lg:order-1 sidebar-nav">
          <div className="card-surface p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-ink">
                Cards Index
              </h2>
              <span className="badge-mono">
                {String(terms.length).padStart(2, '0')} TOTAL
              </span>
            </div>

            {/* Terms List */}
            <div className="space-y-1 max-h-[460px] overflow-y-auto pr-1">
              {terms.map((item, index) => {
                const isActive = index === activeTermIndex
                return (
                  <button
                    key={item.id || index}
                    type="button"
                    onClick={() => setActiveTermIndex(index)}
                    className={`w-full text-left p-2.5 rounded-sm text-xs font-mono transition-all flex items-center justify-between group ${
                      isActive
                        ? 'bg-canvas-dark text-white border border-canvas-dark'
                        : 'text-ink hover:bg-canvas-soft border border-transparent hover:border-hairline'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-xs flex-shrink-0 ${
                          isActive
                            ? 'bg-surface-dark-soft text-brand-mint'
                            : 'bg-hairline text-ink-muted'
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="truncate font-sans text-xs">
                        {item.term || `Term ${index + 1}`}
                      </span>
                    </div>

                    <FiChevronRight
                      className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${
                        isActive ? 'text-brand-mint' : 'text-ink-light group-hover:translate-x-0.5'
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Center Column: Interactive Flashcard Carousel Viewer */}
        <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
          {activeTerm ? (
            <div className="card-surface p-4 sm:p-8 gradient-border-top space-y-6 min-h-[400px] sm:min-h-[440px] flex flex-col justify-between shadow-soft-drop animate-fade-in relative">
              {/* Card Meta Top */}
              <div>
                <div className="flex items-center justify-between border-b border-hairline pb-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink">
                      CARD {String(activeTermIndex + 1).padStart(2, '0')} / {String(terms.length).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Stepper Progress Bar */}
                  <div className="flex items-center gap-1 max-w-[140px] overflow-hidden">
                    {terms.map((_, dotIdx) => (
                      <span
                        key={dotIdx}
                        className={`h-1 rounded-xs transition-all duration-150 ${
                          dotIdx === activeTermIndex
                            ? 'w-5 bg-ink'
                            : 'w-2 bg-hairline'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Term Content */}
                <div className="space-y-5">
                  <h3 className="font-sans text-2xl sm:text-3xl font-medium text-ink tracking-tight">
                    {activeTerm.term}
                  </h3>

                  {/* Illustrative Image */}
                  {activeTerm.image && (
                    <div className="max-h-60 overflow-hidden rounded-sm border border-hairline bg-canvas-soft flex items-center justify-center">
                      <img
                        src={activeTerm.image}
                        alt={activeTerm.term}
                        className="max-h-60 w-full object-contain p-2"
                      />
                    </div>
                  )}

                  {/* Definition */}
                  <div className="pt-2">
                    <h4 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-2">
                      Definition
                    </h4>
                    <p className="text-ink text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
                      {activeTerm.definition}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Carousel Controls & Keyboard Hint */}
              <div className="pt-6 border-t border-hairline space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrevTerm}
                    disabled={terms.length <= 1}
                    className="btn-secondary-white text-xs px-2.5 sm:px-3.5 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Previous Card (Left Arrow)"
                  >
                    <FiChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <span className="font-mono text-xs text-ink-muted font-medium">
                    {String(activeTermIndex + 1).padStart(2, '0')} / {String(terms.length).padStart(2, '0')}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextTerm}
                    disabled={terms.length <= 1}
                    className="btn-primary text-xs px-2.5 sm:px-3.5 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Next Card (Right Arrow)"
                  >
                    <span>Next</span>
                    <FiChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="font-mono text-[10px] text-center text-ink-light uppercase tracking-wider">
                  Tip: Navigate cards via <kbd className="px-1.5 py-0.5 bg-canvas-soft rounded-xs text-ink font-mono text-[10px] border border-hairline">←</kbd> and <kbd className="px-1.5 py-0.5 bg-canvas-soft rounded-xs text-ink font-mono text-[10px] border border-hairline">→</kbd> keys
                </p>
              </div>
            </div>
          ) : (
            <div className="card-surface p-12 text-center">
              <p className="text-ink-muted text-xs font-mono">NO CARDS AVAILABLE</p>
            </div>
          )}
        </div>

        {/* Right Side: Actions Panel */}
        <div className="lg:col-span-3 space-y-4 order-3 action-panel">
          <div className="card-surface p-5 space-y-3">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-ink border-b border-hairline pb-2.5">
              Actions
            </h3>

            <div className="space-y-2">
              {/* Share Button */}
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-mono uppercase tracking-wider bg-canvas-soft hover:bg-canvas text-ink border border-hairline hover:border-ink transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FiShare2 className="w-3.5 h-3.5 text-ink" />
                  <span>Share</span>
                </div>
                <FiChevronRight className="w-3.5 h-3.5 text-ink-muted" />
              </button>

              {/* Download / Print PDF Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-mono uppercase tracking-wider bg-canvas-soft hover:bg-canvas text-ink border border-hairline hover:border-ink transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FiPrinter className="w-3.5 h-3.5 text-ink" />
                  <span>Print / Download</span>
                </div>
                <FiChevronRight className="w-3.5 h-3.5 text-ink-muted" />
              </button>

              {/* Create New Deck Shortcut */}
              <Link
                to="/"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-mono uppercase tracking-wider bg-canvas-soft hover:bg-canvas text-ink border border-hairline hover:border-ink transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FiPlus className="w-3.5 h-3.5 text-ink" />
                  <span>New Deck</span>
                </div>
                <FiChevronRight className="w-3.5 h-3.5 text-ink-muted" />
              </Link>

              {/* Delete Deck Button */}
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-mono uppercase tracking-wider bg-white hover:bg-red-50 text-red-600 border border-red-200 transition-colors mt-2"
              >
                <div className="flex items-center gap-2">
                  <FiTrash2 className="w-3.5 h-3.5 text-red-600" />
                  <span>Delete Deck</span>
                </div>
                <FiChevronRight className="w-3.5 h-3.5 text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Print View */}
      <div className="print-only space-y-6">
        <div className="border-b-2 border-black pb-4 mb-6">
          <h1 className="text-2xl font-bold text-black mb-1">{deck.groupName}</h1>
          <p className="text-sm text-gray-800 mb-2">{deck.groupDescription}</p>
          <div className="text-xs text-gray-500 font-mono">
            TOTAL CARDS: {terms.length} | EXPORTED: {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="space-y-4">
          {terms.map((item, idx) => (
            <div key={item.id || idx} className="print-card border border-black p-4 mb-4">
              <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-2">
                <span className="font-bold text-base text-black">
                  {idx + 1}. {item.term}
                </span>
                <span className="text-xs text-gray-600 font-mono">
                  CARD {idx + 1} OF {terms.length}
                </span>
              </div>

              {item.image && (
                <div className="my-2 max-h-40 overflow-hidden">
                  <img src={item.image} alt={item.term} className="max-h-40 object-contain" />
                </div>
              )}

              <div className="text-sm text-gray-900 whitespace-pre-line mt-2">
                <strong>DEFINITION:</strong> {item.definition}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*  Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in no-print">
          <div className="card-surface max-w-md w-full p-6 space-y-5 border border-hairline shadow-soft-drop relative">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-ink-muted hover:text-ink rounded-xs hover:bg-canvas-soft transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="badge-mono">SHARE</span>
                <span className="font-mono text-xs text-ink-muted uppercase">COLLABORATE</span>
              </div>
              <h3 className="font-sans text-lg font-medium text-ink">
                Share Flashcard Deck
              </h3>
              <p className="text-xs text-ink-muted">
                Copy link or broadcast deck directly to external platforms.
              </p>
            </div>

            {/* URL Copy Box */}
            <div className="space-y-1.5">
              <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-ink">
                Direct Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  className="input-field text-xs font-mono bg-canvas-soft select-all truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`btn-primary text-xs px-3.5 py-2 flex-shrink-0 flex items-center gap-1.5 ${
                    copiedToast ? 'bg-brand-mint text-ink border-brand-mint' : ''
                  }`}
                >
                  {copiedToast ? (
                    <>
                      <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <FiCopy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social Share Grid */}
            <div className="space-y-2 pt-2 border-t border-hairline">
              <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                Broadcast via
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    shareText + ' ' + shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2.5 rounded-sm bg-canvas-soft hover:bg-canvas text-ink border border-hairline hover:border-ink transition-colors gap-1"
                >
                  <FaWhatsapp className="w-4 h-4 text-green-600" />
                  <span className="text-[11px] uppercase">WhatsApp</span>
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    shareText
                  )}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2.5 rounded-sm bg-canvas-soft hover:bg-canvas text-ink border border-hairline hover:border-ink transition-colors gap-1"
                >
                  <FaTwitter className="w-4 h-4 text-sky-500" />
                  <span className="text-[11px] uppercase">Twitter</span>
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2.5 rounded-sm bg-canvas-soft hover:bg-canvas text-ink border border-hairline hover:border-ink transition-colors gap-1"
                >
                  <FaLinkedin className="w-4 h-4 text-blue-600" />
                  <span className="text-[11px] uppercase">LinkedIn</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(
                    deck.groupName
                  )}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`}
                  className="flex flex-col items-center justify-center p-2.5 rounded-sm bg-canvas-soft hover:bg-canvas text-ink border border-hairline hover:border-ink transition-colors gap-1"
                >
                  <FaEnvelope className="w-4 h-4 text-ink-muted" />
                  <span className="text-[11px] uppercase">Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in no-print">
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
                  Are you sure you want to delete{' '}
                  <span className="font-medium text-ink font-mono">
                    &ldquo;{deck.groupName}&rdquo;
                  </span>
                  ? All {terms.length} cards will be permanently removed.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-hairline">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
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

