import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Layout from '../Layout'

describe('Layout component', () => {
  it('renders Navbar, child outlet content, and footer', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<div data-testid="child-content">Child Page Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    // Navbar should be present
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()

    // Outlet child content should be rendered
    expect(screen.getByTestId('child-content')).toHaveTextContent('Child Page Content')

    // Footer info and links should be present
    expect(screen.getByText(/Flashcard System/i)).toBeInTheDocument()
    expect(screen.getByText(/High-Retention Learning/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^Create$/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /^Library$/i })).toHaveAttribute('href', '/my-flashcards')
  })
})
