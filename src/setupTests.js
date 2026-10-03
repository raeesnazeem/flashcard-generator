import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Automatically clean up rendered DOM after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
  configurable: true
})

// Mock window.print
Object.defineProperty(window, 'print', {
  value: vi.fn(),
  writable: true,
  configurable: true
})

// Mock navigator.clipboard
const clipboardMock = {
  writeText: vi.fn().mockResolvedValue(undefined)
}

Object.defineProperty(navigator, 'clipboard', {
  value: clipboardMock,
  writable: true,
  configurable: true
})

Object.defineProperty(window.navigator, 'clipboard', {
  value: clipboardMock,
  writable: true,
  configurable: true
})
