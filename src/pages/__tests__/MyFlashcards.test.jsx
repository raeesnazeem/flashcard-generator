import React from 'react'
import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../test-utils'
import MyFlashcards from '../MyFlashcards'

const sampleDecks = [
  {
    id: 'deck-1',
    groupName: 'React Fundamentals',
    groupDescription: 'Core React concepts including state and props',
    groupImage: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    terms: [
      { id: 't-1', term: 'Virtual DOM', definition: 'In-memory representation of DOM', image: null },
      { id: 't-2', term: 'useState', definition: 'State hook', image: null }
    ]
  },
  {
    id: 'deck-2',
    groupName: 'Data Structures',
    groupDescription: 'Binary trees, heaps, graphs and hash maps',
    groupImage: null,
    createdAt: '2026-01-02T00:00:00.000Z',
    terms: [
      { id: 't-3', term: 'Binary Tree', definition: 'Tree data structure where each node has up to 2 children', image: null }
    ]
  }
]

describe('MyFlashcards component', () => {
  it('renders empty state when there are no flashcards in store', () => {
    renderWithProviders(<MyFlashcards />, {
      preloadedState: {
        flashcards: {
          flashcards: [],
          searchTerm: ''
        }
      }
    })

    expect(screen.getByText(/no flashcard decks found/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /create initial deck/i })).toBeInTheDocument()
  })

  it('renders flashcard decks with correct metrics cluster', () => {
    renderWithProviders(<MyFlashcards />, {
      preloadedState: {
        flashcards: {
          flashcards: sampleDecks,
          searchTerm: ''
        }
      }
    })

    // Metrics
    expect(screen.getByText('02')).toBeInTheDocument() // 2 decks
    expect(screen.getByText('03')).toBeInTheDocument() // 3 total terms (2 + 1)

    // Deck titles
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument()
    expect(screen.getByText('Data Structures')).toBeInTheDocument()

    // Descriptions
    expect(screen.getByText(/core react concepts/i)).toBeInTheDocument()
    expect(screen.getByText(/binary trees, heaps/i)).toBeInTheDocument()

    // Study links
    const studyLinks = screen.getAllByRole('link', { name: /study deck/i })
    expect(studyLinks).toHaveLength(2)
    expect(studyLinks[0]).toHaveAttribute('href', '/flashcard/deck-1')
    expect(studyLinks[1]).toHaveAttribute('href', '/flashcard/deck-2')
  })

  it('filters decks based on search query', async () => {
    const { user, store } = renderWithProviders(<MyFlashcards />, {
      preloadedState: {
        flashcards: {
          flashcards: sampleDecks,
          searchTerm: ''
        }
      }
    })

    const searchInput = screen.getByPlaceholderText(/search decks by keyword/i)
    await user.type(searchInput, 'React')

    // Only React Fundamentals should be visible
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument()
    expect(screen.queryByText('Data Structures')).not.toBeInTheDocument()

    // Store search term is updated
    expect(store.getState().flashcards.searchTerm).toBe('React')
  })

  it('filters decks by term keyword match', async () => {
    const { user } = renderWithProviders(<MyFlashcards />, {
      preloadedState: {
        flashcards: {
          flashcards: sampleDecks,
          searchTerm: ''
        }
      }
    })

    const searchInput = screen.getByPlaceholderText(/search decks by keyword/i)
    await user.type(searchInput, 'useState')

    // Deck 1 contains 'useState' term
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument()
    expect(screen.queryByText('Data Structures')).not.toBeInTheDocument()
  })

  it('displays "No Matching Decks" when search query has no results and allows clearing', async () => {
    const { user } = renderWithProviders(<MyFlashcards />, {
      preloadedState: {
        flashcards: {
          flashcards: sampleDecks,
          searchTerm: ''
        }
      }
    })

    const searchInput = screen.getByPlaceholderText(/search decks by keyword/i)
    await user.type(searchInput, 'NonExistentTopic123')

    expect(screen.getByText(/no matching decks/i)).toBeInTheDocument()
    expect(screen.getByText(/no decks matched “NonExistentTopic123”/i)).toBeInTheDocument()

    // Click Clear Search icon button in search bar
    const clearIconBtn = screen.getByTitle('Clear search')
    await user.click(clearIconBtn)

    // Both decks should be visible again
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument()
    expect(screen.getByText('Data Structures')).toBeInTheDocument()
    expect(searchInput).toHaveValue('')
  })

  it('opens delete confirmation modal and confirms deletion of a deck', async () => {
    const { user, store } = renderWithProviders(<MyFlashcards />, {
      preloadedState: {
        flashcards: {
          flashcards: sampleDecks,
          searchTerm: ''
        }
      }
    })

    const deleteButtons = screen.getAllByTitle('Delete Deck')
    expect(deleteButtons).toHaveLength(2)

    // Click delete on first deck
    await user.click(deleteButtons[0])

    // Modal should appear
    expect(screen.getByText(/delete flashcard deck\?/i)).toBeInTheDocument()
    expect(screen.getByText(/“React Fundamentals”/i)).toBeInTheDocument()

    // Confirm deletion
    const confirmBtn = screen.getByRole('button', { name: /confirm delete/i })
    await user.click(confirmBtn)

    // Deck should be removed from DOM and store
    await waitFor(() => {
      expect(screen.queryByText('React Fundamentals')).not.toBeInTheDocument()
      expect(screen.getByText('Data Structures')).toBeInTheDocument()
    })

    expect(store.getState().flashcards.flashcards).toHaveLength(1)
    expect(store.getState().flashcards.flashcards[0].id).toBe('deck-2')
  })

  it('cancels deletion when clicking Cancel in modal', async () => {
    const { user, store } = renderWithProviders(<MyFlashcards />, {
      preloadedState: {
        flashcards: {
          flashcards: sampleDecks,
          searchTerm: ''
        }
      }
    })

    const deleteButtons = screen.getAllByTitle('Delete Deck')
    await user.click(deleteButtons[0])

    // Cancel deletion
    const cancelBtn = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelBtn)

    // Modal closes and deck remains
    expect(screen.queryByText(/delete flashcard deck\?/i)).not.toBeInTheDocument()
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument()
    expect(store.getState().flashcards.flashcards).toHaveLength(2)
  })
})
