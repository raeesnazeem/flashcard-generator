import React from 'react'
import { describe, it, expect } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import { renderWithProviders } from '../../test-utils'
import FlashcardDetails from '../FlashcardDetails'

const sampleDeck = {
  id: 'deck-101',
  groupName: 'System Design Patterns',
  groupDescription: 'Key concepts in distributed systems and scalability',
  groupImage: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  terms: [
    {
      id: 'term-1',
      term: 'Load Balancer',
      definition: 'Distributes incoming network traffic across multiple servers.',
      image: null
    },
    {
      id: 'term-2',
      term: 'Cache Invalidation',
      definition: 'The process of removing stale data from a cache.',
      image: null
    },
    {
      id: 'term-3',
      term: 'CAP Theorem',
      definition: 'States that a distributed system can guarantee at most two of Consistency, Availability, and Partition tolerance.',
      image: null
    }
  ]
}

const renderFlashcardDetails = (deckId = 'deck-101', customDecks = [sampleDeck]) => {
  return renderWithProviders(
    <Routes>
      <Route path="/flashcard/:id" element={<FlashcardDetails />} />
      <Route path="/my-flashcards" element={<div data-testid="library-page">Library Page</div>} />
    </Routes>,
    {
      initialEntries: [`/flashcard/${deckId}`],
      preloadedState: {
        flashcards: {
          flashcards: customDecks,
          searchTerm: ''
        }
      }
    }
  )
}

describe('FlashcardDetails component', () => {
  it('renders "Deck Not Found" when invalid ID is provided', () => {
    renderFlashcardDetails('non-existent-id')

    expect(screen.getByText(/flashcard deck not found/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to library/i })).toHaveAttribute('href', '/my-flashcards')
  })

  it('renders deck information and initial active term', () => {
    renderFlashcardDetails('deck-101')

    // Deck info
    const headings = screen.getAllByRole('heading', { name: 'System Design Patterns' })
    expect(headings.length).toBeGreaterThanOrEqual(1)
    expect(headings[0]).toBeInTheDocument()

    expect(screen.getAllByText(/key concepts in distributed systems/i)[0]).toBeInTheDocument()
    expect(screen.getByText(/3 CARDS/i)).toBeInTheDocument()

    // Active card 1
    expect(screen.getByText('CARD 01 / 03')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Load Balancer' })).toBeInTheDocument()
    expect(screen.getAllByText(/distributes incoming network traffic/i)[0]).toBeInTheDocument()
  })

  it('navigates to next and previous terms using buttons', async () => {
    const { user } = renderFlashcardDetails('deck-101')

    const nextBtn = screen.getByRole('button', { name: /next/i })
    const prevBtn = screen.getByRole('button', { name: /previous/i })

    // Click Next -> Card 2
    await user.click(nextBtn)
    expect(screen.getByText('CARD 02 / 03')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Cache Invalidation' })).toBeInTheDocument()
    expect(screen.getAllByText(/process of removing stale data/i)[0]).toBeInTheDocument()

    // Click Next -> Card 3
    await user.click(nextBtn)
    expect(screen.getByText('CARD 03 / 03')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'CAP Theorem' })).toBeInTheDocument()

    // Click Next at the end wraps around to Card 1
    await user.click(nextBtn)
    expect(screen.getByText('CARD 01 / 03')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Load Balancer' })).toBeInTheDocument()

    // Click Previous wraps to Card 3
    await user.click(prevBtn)
    expect(screen.getByText('CARD 03 / 03')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'CAP Theorem' })).toBeInTheDocument()
  })

  it('selects active term by clicking in the sidebar index', async () => {
    const { user } = renderFlashcardDetails('deck-101')

    // Click on Card 3 from the sidebar index
    const term3SidebarBtn = screen.getByRole('button', { name: /cap theorem/i })
    await user.click(term3SidebarBtn)

    expect(screen.getByText('CARD 03 / 03')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'CAP Theorem' })).toBeInTheDocument()
  })

  it('navigates cards using keyboard arrow keys', () => {
    renderFlashcardDetails('deck-101')

    expect(screen.getByText('CARD 01 / 03')).toBeInTheDocument()

    // Press ArrowRight
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText('CARD 02 / 03')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Cache Invalidation' })).toBeInTheDocument()

    // Press ArrowLeft
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByText('CARD 01 / 03')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Load Balancer' })).toBeInTheDocument()
  })

  it('opens share modal and copies link to clipboard', async () => {
    const { user } = renderFlashcardDetails('deck-101')

    const shareBtn = screen.getByRole('button', { name: /^share/i })
    await user.click(shareBtn)

    // Share modal is displayed
    expect(screen.getByRole('heading', { name: /share flashcard deck/i })).toBeInTheDocument()
    expect(screen.getByText(/broadcast via/i)).toBeInTheDocument()

    // Click Copy button
    const copyBtn = screen.getByRole('button', { name: /copy/i })
    await user.click(copyBtn)

    await waitFor(() => {
      expect(screen.getByText(/copied/i)).toBeInTheDocument()
    })
  })

  it('triggers window.print when clicking Print / Download button', async () => {
    const { user } = renderFlashcardDetails('deck-101')

    const printBtn = screen.getByRole('button', { name: /print \/ download/i })
    await user.click(printBtn)

    expect(window.print).toHaveBeenCalled()
  })

  it('opens delete modal and confirms deletion of deck', async () => {
    const { user, store } = renderFlashcardDetails('deck-101')

    const deleteBtn = screen.getByRole('button', { name: /delete deck/i })
    await user.click(deleteBtn)

    // Delete modal opens
    expect(screen.getByRole('heading', { name: /delete flashcard deck\?/i })).toBeInTheDocument()
    expect(screen.getByText(/“System Design Patterns”/i)).toBeInTheDocument()

    // Confirm deletion
    const confirmBtn = screen.getByRole('button', { name: /confirm delete/i })
    await user.click(confirmBtn)

    // Verify deleted in Redux store
    expect(store.getState().flashcards.flashcards).toHaveLength(0)

    // Navigates to library
    await waitFor(() => {
      expect(screen.getByTestId('library-page')).toBeInTheDocument()
    })
  })
})
