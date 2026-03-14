import { describe, it, expect } from 'vitest'
import { createAsset } from '../lib/sandbox.js'
import { placeAsset } from '../lib/sandbox.js'
import { removeAsset } from '../lib/sandbox.js'

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

describe('placeAsset', () => {
  it('adds asset to state', () => {
    const state = { assets_placed: [] }
    const asset = createAsset('a1', 'shark', '🦈', 100, 100)
    const next  = placeAsset(state, asset)
    expect(next.assets_placed).toHaveLength(1)
  })

  it('does not mutate original state', () => {
    const state = { assets_placed: [] }
    const asset = createAsset('a1', 'shark', '🦈', 100, 100)
    placeAsset(state, asset)
    expect(state.assets_placed).toHaveLength(0)
  })
})

describe('removeAsset', () => {
  it('removes asset by id', () => {
    const state = { assets_placed: [createAsset('a1', 'shark', '🦈', 0, 0)] }
    const next  = removeAsset(state, 'a1')
    expect(next.assets_placed).toHaveLength(0)
  })

  it('leaves other assets intact', () => {
    const state = {
      assets_placed: [
        createAsset('a1', 'shark', '🦈', 0, 0),
        createAsset('a2', 'coral', '🪸', 50, 50)
      ]
    }
    const next = removeAsset(state, 'a1')
    expect(next.assets_placed[0].id).toBe('a2')
  })

  it('does not mutate original state', () => {
    const state = { assets_placed: [createAsset('a1', 'shark', '🦈', 0, 0)] }
    removeAsset(state, 'a1')
    expect(state.assets_placed).toHaveLength(1)
  })
})