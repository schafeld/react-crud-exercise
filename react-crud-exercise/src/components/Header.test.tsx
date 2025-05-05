import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from './Header'

describe('Header component', () => {
  it('renders the header with correct text', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    const headerText = screen.getByRole('heading', { level: 1 })
    expect(headerText).toHaveTextContent('"Ollis Flohmarkt" CRUD App')
  })

  it('contains a link to the home page', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    const homeLink = screen.getByRole('link')
    expect(homeLink).toHaveAttribute('href', '/')
  })
})