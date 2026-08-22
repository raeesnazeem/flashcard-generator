import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { TbCards } from 'react-icons/tb'
import { FiPlus, FiGrid } from 'react-icons/fi'

export default function Navbar() {

  return (
    <header className="bg-canvas-dark border-b border-hairline-dark text-white sticky top-0 z-50">
      {/* Top Brand & Global Navigation Bar */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 rounded-sm bg-gradient-to-tr from-brand-orange via-brand-magenta to-brand-periwinkle p-[1px]">
              <div className="w-full h-full bg-canvas-dark rounded-[3px] flex items-center justify-center transition-transform group-hover:scale-95">
                <TbCards className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-sm font-semibold tracking-tight text-white flex items-center gap-2">
                Flashcard Platform
                <span className="font-mono text-[10px] uppercase tracking-wider text-brand-mint bg-surface-dark-soft px-1.5 py-0.5 rounded-xs border border-hairline-dark">
                  v2.0
                </span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted hidden sm:inline-block">
                STUDY &bull; MEMORIZE &bull; REPEAT
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2" aria-label="Main Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `font-mono text-xs uppercase tracking-wider px-3.5 py-2 rounded-sm transition-all duration-150 flex items-center gap-2 ${
                  isActive
                    ? 'bg-surface-dark-soft text-white border border-hairline-dark shadow-sm'
                    : 'text-ink-muted hover:text-white hover:bg-surface-dark-soft/50 border border-transparent'
                }`
              }
            >
              <FiPlus className="w-3.5 h-3.5" />
              <span>Create Deck</span>
            </NavLink>

            <NavLink
              to="/my-flashcards"
              className={({ isActive }) =>
                `font-mono text-xs uppercase tracking-wider px-3.5 py-2 rounded-sm transition-all duration-150 flex items-center gap-2 ${
                  isActive
                    ? 'bg-surface-dark-soft text-white border border-hairline-dark shadow-sm'
                    : 'text-ink-muted hover:text-white hover:bg-surface-dark-soft/50 border border-transparent'
                }`
              }
            >
              <FiGrid className="w-3.5 h-3.5" />
              <span>My Flashcards</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Decorative gradient*/}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-brand-magenta/40 to-transparent" />
    </header>
  )
}


