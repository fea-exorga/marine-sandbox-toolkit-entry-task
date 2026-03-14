import { describe, it, expect } from 'vitest'
import { createAsset } from '../lib/sandbox.js'

describe('createAsset', () => {
  it('returns asset with correct fields', () => {
    const a = createAsset('a1', 'shark', '🦈', 120, 80)
    expect(a).toEqual({ id: 'a1', type: 'shark', emoji: '🦈', x: 120, y: 80 })
  })

  it('rounds float coordinates', () => {
    const a = createAsset('a1', 'shark', '🦈', 120.7, 80.3)
    expect(a.x).toBe(121)
    expect(a.y).toBe(80)
  })
})