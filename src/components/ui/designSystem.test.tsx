import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { Button } from './Button'
import { Badge } from './Badge'
import { PropertyStatusBadge, VisitStatusBadge, TransactionBadge } from './StatusBadge'
import { Input } from './Input'
import { Container } from './Container'

// Configure react act environment for React 19 testing in jsdom
// @ts-expect-error global flag for react testing
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('UI Primitives - Design System', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => {
      root.unmount()
    })
    container.remove()
  })

  it('renders Button with variants and handles disabled/loading state', async () => {
    await act(async () => {
      root.render(
        <Button variant="cyan" size="lg" isLoading={true}>
          Réserver
        </Button>
      )
    })

    const button = container.querySelector('button')
    expect(button).not.toBeNull()
    expect(button?.getAttribute('disabled')).not.toBeNull()
    expect(button?.getAttribute('aria-busy')).toBe('true')
    expect(button?.textContent).toContain('Réserver')
    expect(container.querySelector('.animate-spin')).not.toBeNull()
  })

  it('renders Badge with dot indicator and custom variants', async () => {
    await act(async () => {
      root.render(
        <Badge variant="cyan" dot={true}>
          Dakar Plateau
        </Badge>
      )
    })

    const badge = container.querySelector('span')
    expect(badge).not.toBeNull()
    expect(badge?.textContent).toContain('Dakar Plateau')
    expect(container.querySelector('.rounded-full')).not.toBeNull()
  })

  it('renders StatusBadge for properties, visits and transactions correctly', async () => {
    await act(async () => {
      root.render(
        <div>
          <PropertyStatusBadge status="published" />
          <VisitStatusBadge status="new" />
          <TransactionBadge type="sale" />
        </div>
      )
    })

    const text = container.textContent
    expect(text).toContain('Publié')
    expect(text).toMatch(/Nouveau|Nouvelle/)
    expect(text).toContain('À Vendre')
  })

  it('renders Input with accessible error state and helper text', async () => {
    await act(async () => {
      root.render(
        <Input
          label="Nom complet"
          error="Le nom est requis"
          helperText="Format: Prénom Nom"
          value=""
          onChange={() => {}}
        />
      )
    })

    const input = container.querySelector('input')
    expect(input).not.toBeNull()
    expect(input?.getAttribute('aria-invalid')).toBe('true')
    expect(container.textContent).toContain('Le nom est requis')
    expect(container.textContent).toContain('Nom complet')
  })

  it('renders Container with standardized responsive bounds', async () => {
    await act(async () => {
      root.render(
        <Container size="lg">
          <p>Contenu principal</p>
        </Container>
      )
    })

    const wrapper = container.firstElementChild
    expect(wrapper?.className).toContain('max-w-7xl')
    expect(wrapper?.className).toContain('mx-auto')
  })
})
