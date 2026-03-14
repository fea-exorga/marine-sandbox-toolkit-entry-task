import { createAsset, placeAsset, removeAsset, buildJSON } from './lib/sandbox.js'

const BASE_SIZE = 32;

const state = {
    assets_placed: [],
    nextId: 1,
    selectedId: null,
    dragging: null
};

const canvas = document.getElementById('canvas');
const hint = document.getElementById('hint');
const countBtn = document.getElementById('count-btn');

document.querySelectorAll('.asset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const rect = canvas.getBoundingClientRect();
        place(btn.dataset.type, btn.dataset.emoji,
            rect.width / 2 + (Math.random() - 0.5) * 100,
            rect.height / 2 + (Math.random() - 0.5) * 100
        );
    });
    btn.addEventListener('dragstart', e => {
        e.dataTransfer.setData('type', btn.dataset.type);
        e.dataTransfer.setData('emoji', btn.dataset.emoji);
    });
});

canvas.addEventListener('dragover', e => {
    e.preventDefault();
    console.log("Dragover has been triggered");
    canvas.classList.add('drag-over');
});
canvas.addEventListener('dragleave', () => {
    console.log("Dragleave has been triggered");
    canvas.classList.remove('drag-over')
});
canvas.addEventListener('drop', e => {
    e.preventDefault();
    console.log('Drop has been triggered');
    canvas.classList.remove('drag-over');
    const rect = canvas.getBoundingClientRect();
    place(e.dataTransfer.getData('type'), e.dataTransfer.getData('emoji'),
        e.clientX - rect.left, e.clientY - rect.top);
});

canvas.addEventListener('mousedown', e => { if (e.target === canvas) deselect(); });

function place(type, emoji, x, y) {
    const id = 'a' + state.nextId++;
    console.log(`Placing ${type} at X:${Math.round(x)}, Y:${Math.round(y)}`);
    const asset = createAsset(id, type, emoji, x, y)
    const next = placeAsset(state, asset)
    state.assets_placed = next.assets_placed
    render(id);
    select(id);
    hint.style.display = 'none';
    updateCount();
}

function render(id) {
    document.getElementById(id)?.remove();
    const asset = state.assets_placed.find(a => a.id === id);
    if (!asset) return console.error(`Asset ${id} not found in state!`);
    const selected_asset = document.createElement('div');
    selected_asset.className = 'asset';
    selected_asset.id = id;
    selected_asset.style.left = asset.x + 'px';
    selected_asset.style.top = asset.y + 'px';
    selected_asset.innerHTML = `
            <div class="asset_tile"></div>
            <button class="delete" onclick="removeAssetFromCanvas('${id}',event)">✕</button>
            <span class="emoji">${asset.emoji}</span>
            <span class="name">${asset.type}</span>
        `;
    selected_asset.addEventListener('mousedown', e => {
        if (e.target.classList.contains('delete')) return;
        e.stopPropagation();
        select(id);
        startDrag(e, id);
    });
    canvas.appendChild(selected_asset);
}

function startDrag(e, id) {
    const selected_asset = document.getElementById(id);
    const rect = selected_asset.getBoundingClientRect();
    state.dragging = {
        id,
        offsetX: e.clientX - (rect.left + rect.width / 2),
        offsetY: e.clientY - (rect.top + rect.height / 2)
    };
    function onMove(e) {
        if (!state.dragging) return;
        console.log(`Mouse at: ${e.clientX}, ${e.clientY} | Canvas at: ${canvas.offsetLeft}`);
        const cr = canvas.getBoundingClientRect();
        const x = Math.round(e.clientX - cr.left - state.dragging.offsetX);
        const y = Math.round(e.clientY - cr.top - state.dragging.offsetY);
        const asset = state.assets_placed.find(a => a.id === state.dragging.id);
        asset.x = x; asset.y = y;
        selected_asset.style.left = x + 'px';
        selected_asset.style.top = y + 'px';
    }
    function onUp() {
        state.dragging = null;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
}

function select(id) {
    deselect();
    state.selectedId = id;
    document.getElementById(id)?.classList.add('selected');
}

function deselect() {
    if (state.selectedId) document.getElementById(state.selectedId)?.classList.remove('selected');
    state.selectedId = null;
}

function removeAssetFromCanvas(id, e) {
    console.log(`Removing asset with ID: ${id}`);
    e?.stopPropagation();
    document.getElementById(id)?.remove();
    const next = removeAsset(state, id)
    state.assets_placed = next.assets_placed
    if (state.selectedId === id) deselect();
    if (state.assets_placed.length === 0) hint.style.display = '';
    updateCount();
}

function updateCount() {
    countBtn.textContent = 'Assets Placed: ' + state.assets_placed.length;
}

function exportJSON() {
    console.log("[Exporting current data...", state.assets_placed);
    const data = buildJSON(state, { width: canvas.offsetWidth, height: canvas.offsetHeight })
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const downloadLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.setAttribute('download', 'marine-ar-module.json');
    downloadLink.click();
    URL.revokeObjectURL(url);
}
window.removeAssetFromCanvas = removeAssetFromCanvas;
window.exportJSON = exportJSON;

document.addEventListener('keydown', e => {
    if (e.key === 'Delete' && state.selectedId && e.target.tagName !== 'INPUT') removeAssetFromCanvas(state.selectedId);
    if (e.key === 'Escape') deselect();
});