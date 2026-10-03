import React from 'react'
import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../test-utils'
import CreateFlashcard from '../CreateFlashcard'

describe('CreateFlashcard component', () => {
  it('renders all form input fields and default card row', () => {
    renderWithProviders(<CreateFlashcard />)

    // Heading
    expect(screen.getByRole('heading', { name: /create flashcard deck/i })).toBeInTheDocument()

    // Group Details
    expect(screen.getByLabelText(/group name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/group description/i)).toBeInTheDocument()

    // Initial Card Row
    expect(screen.getByLabelText(/^term/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^definition/i)).toBeInTheDocument()
    expect(screen.getByText('01')).toBeInTheDocument()

    // Action buttons
    expect(screen.getByRole('button', { name: /add card row/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset form/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create flashcard deck/i })).toBeInTheDocument()
  })

  it('displays validation error messages when submitting empty form', async () => {
    const { user } = renderWithProviders(<CreateFlashcard />)

    const submitBtn = screen.getByRole('button', { name: /create flashcard deck/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/group name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/group description is required/i)).toBeInTheDocument()
      expect(screen.getByText(/term title is required/i)).toBeInTheDocument()
      expect(screen.getByText(/definition is required/i)).toBeInTheDocument()
    })
  })

  it('displays validation error messages for short input values', async () => {
    const { user } = renderWithProviders(<CreateFlashcard />)

    const nameInput = screen.getByLabelText(/group name/i)
    const descInput = screen.getByLabelText(/group description/i)
    const defInput = screen.getByLabelText(/^definition/i)

    await user.type(nameInput, 'ab')
    await user.type(descInput, 'short')
    await user.type(defInput, 'no')

    const submitBtn = screen.getByRole('button', { name: /create flashcard deck/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/group title must be at least 3 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/description must be at least 10 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/definition must be at least 3 characters/i)).toBeInTheDocument()
    })
  })

  it('allows adding and removing card rows', async () => {
    const { user } = renderWithProviders(<CreateFlashcard />)

    // Initially 1 card
    expect(screen.getByText('1 CARD')).toBeInTheDocument()
    expect(screen.queryByTitle('Delete Card')).not.toBeInTheDocument()

    // Add a card row
    const addRowBtn = screen.getByRole('button', { name: /add card row/i })
    await user.click(addRowBtn)

    // Should now have 2 cards
    await waitFor(() => {
      expect(screen.getByText('2 CARDS')).toBeInTheDocument()
      expect(screen.getByText('02')).toBeInTheDocument()
    })

    // Delete buttons should now appear
    const deleteButtons = screen.getAllByTitle('Delete Card')
    expect(deleteButtons).toHaveLength(2)

    // Delete the second card
    await user.click(deleteButtons[1])

    await waitFor(() => {
      expect(screen.getByText('1 CARD')).toBeInTheDocument()
      expect(screen.queryByText('02')).not.toBeInTheDocument()
    })
  })

  it('resets form inputs when clicking Reset Form', async () => {
    const { user } = renderWithProviders(<CreateFlashcard />)

    const nameInput = screen.getByLabelText(/group name/i)
    const descInput = screen.getByLabelText(/group description/i)

    await user.type(nameInput, 'TypeScript Advanced')
    await user.type(descInput, 'A deep dive into TypeScript type system')

    expect(nameInput).toHaveValue('TypeScript Advanced')
    expect(descInput).toHaveValue('A deep dive into TypeScript type system')

    const resetBtn = screen.getByRole('button', { name: /reset form/i })
    await user.click(resetBtn)

    await waitFor(() => {
      expect(nameInput).toHaveValue('')
      expect(descInput).toHaveValue('')
    })
  })

  it('submits valid form, adds deck to Redux store, and shows success notification', async () => {
    const { user, store } = renderWithProviders(<CreateFlashcard />, {
      preloadedState: {
        flashcards: {
          flashcards: [],
          searchTerm: ''
        }
      }
    })

    const nameInput = screen.getByLabelText(/group name/i)
    const descInput = screen.getByLabelText(/group description/i)
    const termInput = screen.getByLabelText(/^term/i)
    const defInput = screen.getByLabelText(/^definition/i)

    await user.type(nameInput, 'Design Patterns')
    await user.type(descInput, 'Standard design patterns in modern software development')
    await user.type(termInput, 'Singleton')
    await user.type(defInput, 'Ensures a class has only one instance and provides a global access point')

    const submitBtn = screen.getByRole('button', { name: /create flashcard deck/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/deck saved successfully/i)).toBeInTheDocument()
    })

    // Verify Redux state contains the new deck
    const state = store.getState().flashcards
    expect(state.flashcards).toHaveLength(1)
    expect(state.flashcards[0].groupName).toBe('Design Patterns')
    expect(state.flashcards[0].groupDescription).toBe('Standard design patterns in modern software development')
    expect(state.flashcards[0].terms).toHaveLength(1)
    expect(state.flashcards[0].terms[0].term).toBe('Singleton')
  })
})
