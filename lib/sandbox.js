// lib/sandbox.js
export function createAsset(id, type, emoji, x, y) {
    return {
        id: id,
        type: type,
        emoji: emoji,
        x: Math.round(x),
        y: Math.round(y)
    };
}
export function placeAsset(state, asset) {
    return { 
        ...state, 
        assets_placed: [...state.assets_placed, asset] }
}
export function removeAsset(state, idToRemove) {
    return {
        ...state,
        assets_placed: state.assets_placed.filter(asset => asset.id !== idToRemove)
    };
}
export function buildJSON(state, canvasSize) {
    const exportData = {
      version: '1.0',
      exported: new Date().toISOString(),
      canvas: canvasSize,
      assets: state.assets_placed.map(asset => {
        return {
          id: asset.id,
          type: asset.type,
          emoji: asset.emoji,
          x: asset.x,
          y: asset.y
        };
      })
    };
    return exportData;
  }