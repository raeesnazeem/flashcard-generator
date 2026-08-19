import React from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { TbCards } from 'react-icons/tb'

export default function Navbar() {
  const location = useLocation()
  const isCreateActive = location.pathname === '/' || location.pathname === '/create'

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-apple-border/70 shadow-sm">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Header */}
        <div className="flex items-center justify-between h-14">
          <Link
            to="/"
            className="flex items-center gap-2.5 group opacity-100"
          >
            <div className="w-9 h-9 rounded-apple-sm bg-apple-ink flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105 opacity-100">
              <TbCards className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-1.5 opacity-100">
              <span className="font-display text-lg font-semibold tracking-tight text-apple-ink">
                Flashcard Generator
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-apple-xs text-apple-muted hidden sm:inline-block">
              Study Smarter
            </span>
          </div>
        </div>

        {/* Page Section & Navigation Bar */}
        <div className="pt-2 pb-0 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-apple-ink">
              {isCreateActive ? 'Create Flashcard' : 'Flashcard Library'}
            </h1>
          </div>

          <nav className="flex space-x-6 border-b border-apple-border/50 sm:border-b-0" aria-label="Tabs">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `pb-2.5 pt-1 px-1 border-b-2 font-sans font-medium text-sm transition-all duration-200 inline-block ${
                  isActive
                    ? 'border-apple-blue text-apple-blue font-semibold'
                    : 'border-transparent text-apple-muted hover:text-apple-ink hover:border-apple-border'
                }`
              }
            >
              Create New
            </NavLink>

            <NavLink
              to="/my-flashcards"
              className={({ isActive }) =>
                `pb-2.5 pt-1 px-1 border-b-2 font-sans font-medium text-sm transition-all duration-200 inline-block ${
                  isActive
                    ? 'border-apple-blue text-apple-blue font-semibold'
                    : 'border-transparent text-apple-muted hover:text-apple-ink hover:border-apple-border'
                }`
              }
            >
              My Flashcards
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}

