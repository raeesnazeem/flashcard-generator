import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../Navbar'

describe('Navbar component', () => {
  const renderNavbar = (initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Navbar />
      </MemoryRouter>
    )
  }

  it('renders brand logo and title correctly', () => {
    renderNavbar('/')

    expect(screen.getAllByText(/Flashcard/i)[0]).toBeInTheDocument()
    expect(screen.getByText(/Platform/i)).toBeInTheDocument()
    expect(screen.getByText(/STUDY • MEMORIZE • REPEAT/i)).toBeInTheDocument()
  })

  it('renders navigation links to Create Deck and My Flashcards', () => {
    renderNavbar('/')

    const createLink = screen.getByRole('link', { name: /create/i })
    const libraryLink = screen.getByRole('link', { name: /flashcards/i })

    expect(createLink).toBeInTheDocument()
    expect(createLink).toHaveAttribute('href', '/')

    expect(libraryLink).toBeInTheDocument()
    expect(libraryLink).toHaveAttribute('href', '/my-flashcards')
  })

  it('highlights Create Deck link as active when on "/" route', () => {
    renderNavbar('/')

    const createLink = screen.getByRole('link', { name: /create/i })
    const libraryLink = screen.getByRole('link', { name: /flashcards/i })

    expect(createLink).toHaveClass('bg-surface-dark-soft')
    expect(libraryLink).not.toHaveClass('bg-surface-dark-soft')
  })

  it('highlights My Flashcards link as active when on "/my-flashcards" route', () => {
    renderNavbar('/my-flashcards')

    const createLink = screen.getByRole('link', { name: /create/i })
    const libraryLink = screen.getByRole('link', { name: /flashcards/i })

    expect(libraryLink).toHaveClass('bg-surface-dark-soft')
    expect(createLink).not.toHaveClass('bg-surface-dark-soft')
  })
})
