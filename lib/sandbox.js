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