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