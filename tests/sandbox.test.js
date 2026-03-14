import { describe, it, expect, vi } from 'vitest'
import { createAsset } from '../lib/sandbox.js'
import { placeAsset } from '../lib/sandbox.js'
import { removeAsset } from '../lib/sandbox.js'
import { buildJSON } from '../lib/sandbox.js'

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

describe('buildJSON', () => {

  it('should always have version 1.0', () => {
    const fakeCanvas = { width: 800, height: 600 }
    const json = buildJSON({ assets_placed: [] }, fakeCanvas)
    expect(json.version).toBe('1.0')
  })

  it('should save the current canvas dimensions', () => {
    const mySize = { width: 1024, height: 768 }
    const json = buildJSON({ assets_placed: [] }, mySize)
    expect(json.canvas).toEqual(mySize)
  })

  it('should have a timestamp for the export date', () => {
    vi.useFakeTimers()
    const mockTime = new Date('2026-03-15T10:00:00Z')
    vi.setSystemTime(mockTime)
    const json = buildJSON({ assets_placed: [] }, { width: 800, height: 600 })
    
    expect(json.exported).toBe(mockTime.toISOString())

    vi.useRealTimers()
  })

  it('should return an empty assets list if the sandbox is empty', () => {
    const json = buildJSON({ assets_placed: [] }, { width: 800, height: 600 })
    expect(json.assets).toEqual([])
  })

  it('should include the shark in the right place', () => {
    const singleShark = createAsset('a1', 'shark', '🦈', 120, 250)
    const state = { assets_placed: [singleShark] }
    
    const json = buildJSON(state, { width: 800, height: 600 })
    
    expect(json.assets[0]).toEqual({
      id: 'a1',
      type: 'shark',
      emoji: '🦈',
      x: 120,
      y: 250
    })
  })

  it('should include all animals placed in the ocean', () => {
    const state = {
      assets_placed: [
        createAsset('1', 'shark', '🦈', 10, 10),
        createAsset('2', 'coral', '🪸', 20, 20),
        createAsset('3', 'turtle', '🐢', 30, 30)
      ]
    }
    const json = buildJSON(state, { width: 800, height: 600 })
    
    expect(json.assets.length).toBe(3)
  })

  it('should not leak internal app state into the exported file', () => {
    const assetWithExtraFields = { 
      id: 'test-id', 
      type: 'fish', 
      emoji: '🐠', 
      x: 5, 
      y: 10, 
      isSelected: true, 
      dragging: false 
    }
    
    const state = { assets_placed: [assetWithExtraFields] }
    const json = buildJSON(state, { width: 800, height: 600 })
    expect(json.assets[0]).not.toHaveProperty('isSelected')
    expect(json.assets[0]).not.toHaveProperty('dragging')
  })

})