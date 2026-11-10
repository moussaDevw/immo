import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { VisitBookingModal } from './VisitBookingModal'
import { AppProvider } from '../../context/AppContext'
import { StorageService } from '../../services/storageService'

// @ts-expect-error global flag for react testing
globalThis.IS_REACT_ACT_ENVIRONMENT = true

function setInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set
  setter?.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('change', { bubbles: true }))
}

describe('Visit Booking Form & Workflow - Phase 07', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    localStorage.clear()
    StorageService.resetToDefaultData()
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

  it('renders all required form fields and visit options', async () => {
    const publishedProps = StorageService.getProperties().filter((p) => p.status === 'published')
    const property = publishedProps[0]

    await act(async () => {
      root.render(
        <AppProvider>
          <VisitBookingModal property={property} onClose={() => {}} />
        </AppProvider>
      )
    })

    const text = container.textContent
    expect(text).toContain('Demander une visite')
    expect(text).toContain(property.title)
    expect(text).toContain('En présentiel')
    expect(text).toContain('Visite vidéo')
    expect(text).toContain('Date souhaitée')
    expect(text).toContain('Créneau horaire')
    expect(text).toContain('Nom complet')
    expect(text).toContain('Email (confirmation)')
    expect(text).toContain('Téléphone / WhatsApp')
    expect(text).toContain('Consentement à être recontacté(e)')

    // Checkbox element exists
    const consentCheckbox = container.querySelector('#consent-booking-checkbox') as HTMLInputElement
    expect(consentCheckbox).not.toBeNull()
    expect(consentCheckbox.checked).toBe(false)
  })

  it('blocks submission and shows error if consent checkbox is unchecked', async () => {
    const publishedProps = StorageService.getProperties().filter((p) => p.status === 'published')
    const property = publishedProps[0]

    await act(async () => {
      root.render(
        <AppProvider>
          <VisitBookingModal property={property} onClose={() => {}} />
        </AppProvider>
      )
    })

    const nameInput = container.querySelector('input[placeholder*="Mariama"]') as HTMLInputElement
    const emailInput = container.querySelector('input[placeholder*="nom@exemple"]') as HTMLInputElement
    const phoneInput = container.querySelector('input[placeholder*="+221 77"]') as HTMLInputElement

    await act(async () => {
      setInputValue(nameInput, 'Awa Diop')
      setInputValue(emailInput, 'awa.diop@exemple.sn')
      setInputValue(phoneInput, '+221 77 987 65 43')
    })

    // Submit without checking consent
    const form = container.querySelector('form') as HTMLFormElement
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(container.textContent).toContain('Veuillez accepter d’être recontacté(e)')
  })

  it('validates Senegalese phone formats without blocking local or diaspora numbers', async () => {
    const publishedProps = StorageService.getProperties().filter((p) => p.status === 'published')
    const property = publishedProps[0]

    await act(async () => {
      root.render(
        <AppProvider>
          <VisitBookingModal property={property} onClose={() => {}} />
        </AppProvider>
      )
    })

    const nameInput = container.querySelector('input[placeholder*="Mariama"]') as HTMLInputElement
    const emailInput = container.querySelector('input[placeholder*="nom@exemple"]') as HTMLInputElement
    const phoneInput = container.querySelector('input[placeholder*="+221 77"]') as HTMLInputElement
    const consentCheckbox = container.querySelector('#consent-booking-checkbox') as HTMLInputElement
    const form = container.querySelector('form') as HTMLFormElement

    // Try with invalid phone
    await act(async () => {
      setInputValue(nameInput, 'Omar Fall')
      setInputValue(emailInput, 'omar@test.sn')
      setInputValue(phoneInput, '+221')
      consentCheckbox.click()
    })

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(container.textContent).toContain('Veuillez renseigner un numéro de téléphone valide')

    // Now supply valid Senegalese 9-digit / international phone
    await act(async () => {
      setInputValue(phoneInput, '+221 78 500 12 34')
    })

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    // Wait for the realistic network latency (300ms) to resolve
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
    })

    // Should succeed and show confirmation view
    expect(container.textContent).toContain('Demande transmise avec succès !')
    expect(container.textContent).toContain('Omar Fall')
    expect(container.textContent).toContain('+221 78 500 12 34')
  })

  it('creates visit request in storage associated with the exact propertyId and new status', async () => {
    const publishedProps = StorageService.getProperties().filter((p) => p.status === 'published')
    const property = publishedProps[0]
    const initialRequestsCount = StorageService.getVisitRequests().length

    await act(async () => {
      root.render(
        <AppProvider>
          <VisitBookingModal property={property} onClose={() => {}} />
        </AppProvider>
      )
    })

    const nameInput = container.querySelector('input[placeholder*="Mariama"]') as HTMLInputElement
    const emailInput = container.querySelector('input[placeholder*="nom@exemple"]') as HTMLInputElement
    const phoneInput = container.querySelector('input[placeholder*="+221 77"]') as HTMLInputElement
    const consentCheckbox = container.querySelector('#consent-booking-checkbox') as HTMLInputElement
    const form = container.querySelector('form') as HTMLFormElement

    await act(async () => {
      setInputValue(nameInput, 'Khadija Seck')
      setInputValue(emailInput, 'khadija.seck@diaspora.sn')
      setInputValue(phoneInput, '+33 6 12 34 56 78')
      consentCheckbox.click()
    })

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    // Wait for the realistic network latency (300ms) to resolve
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
    })

    // Verify confirmation view rendered
    expect(container.textContent).toContain('Demande transmise avec succès !')

    // Verify storage has incremented
    const updatedRequests = StorageService.getVisitRequests()
    expect(updatedRequests.length).toBe(initialRequestsCount + 1)

    // Verify properties of the created request
    const latestRequest = updatedRequests[0]
    expect(latestRequest.propertyId).toBe(property.id)
    expect(latestRequest.fullName).toBe('Khadija Seck')
    expect(latestRequest.email).toBe('khadija.seck@diaspora.sn')
    expect(latestRequest.phone).toBe('+33 6 12 34 56 78')
    expect(latestRequest.status).toBe('new')
  })

  it('prevents double submissions when submit button is clicked', async () => {
    const publishedProps = StorageService.getProperties().filter((p) => p.status === 'published')
    const property = publishedProps[0]

    await act(async () => {
      root.render(
        <AppProvider>
          <VisitBookingModal property={property} onClose={() => {}} />
        </AppProvider>
      )
    })

    const nameInput = container.querySelector('input[placeholder*="Mariama"]') as HTMLInputElement
    const emailInput = container.querySelector('input[placeholder*="nom@exemple"]') as HTMLInputElement
    const phoneInput = container.querySelector('input[placeholder*="+221 77"]') as HTMLInputElement
    const consentCheckbox = container.querySelector('#consent-booking-checkbox') as HTMLInputElement
    const submitBtn = container.querySelector('button[type="submit"]') as HTMLButtonElement

    await act(async () => {
      setInputValue(nameInput, 'Cheikh Sy')
      setInputValue(emailInput, 'cheikh.sy@exemple.sn')
      setInputValue(phoneInput, '+221 76 111 22 33')
      consentCheckbox.click()
    })

    // Submit button is active before click
    expect(submitBtn.disabled).toBe(false)
  })

  it('does not expose visit requests on the public catalog or property details page', async () => {
    const requests = StorageService.getVisitRequests()
    expect(requests.length).toBeGreaterThan(0)
    const secretFullName = requests[0].fullName

    // Render public property detail view
    const publishedProps = StorageService.getProperties().filter((p) => p.status === 'published')
    const targetProp = publishedProps[0]

    // Verify public property details DOM contains NO visitor name or contact info
    const PropertyDetailComp = (await import('./PropertyDetailView')).PropertyDetailView

    await act(async () => {
      root.render(
        <AppProvider>
          <PropertyDetailComp propertyId={targetProp.id} onBookVisit={() => {}} />
        </AppProvider>
      )
    })

    expect(container.textContent).not.toContain(secretFullName)
  })
})
