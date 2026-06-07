// Design Editor
const editorCanvas = document.getElementById('editorCanvas');
const editorCtx = editorCanvas.getContext('2d');
const toolBtns = document.querySelectorAll('.tool-btn');
const layersList = document.getElementById('layersList');

// Properties
const fillColor = document.getElementById('fillColor');
const strokeColor = document.getElementById('strokeColor');
const strokeWidth = document.getElementById('strokeWidth');
const strokeWidthValue = document.getElementById('strokeWidthValue');
const fontSize = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const opacity = document.getElementById('opacity');
const opacityValue = document.getElementById('opacityValue');

// Action buttons
const deleteBtn = document.getElementById('deleteBtn');
const duplicateBtn = document.getElementById('duplicateBtn');
const bringFrontBtn = document.getElementById('bringFrontBtn');
const sendBackBtn = document.getElementById('sendBackBtn');
const exportBtn = document.getElementById('exportBtn');

// State
let currentTool = 'select';
let shapes = [];
let selectedShape = null;
let isDrawing = false;
let startX, startY;
let shapeCounter = 0;

// Initialize canvas
editorCtx.fillStyle = 'white';
editorCtx.fillRect(0, 0, editorCanvas.width, editorCanvas.height);

// Tool selection
toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        toolBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTool = btn.dataset.tool;
        selectedShape = null;
        redrawCanvas();
        updateLayersList();
    });
});

// Property updates
strokeWidth.addEventListener('input', () => {
    strokeWidthValue.textContent = `${strokeWidth.value}px`;
    if (selectedShape) {
        selectedShape.strokeWidth = parseInt(strokeWidth.value);
        redrawCanvas();
    }
});

fontSize.addEventListener('input', () => {
    fontSizeValue.textContent = `${fontSize.value}px`;
    if (selectedShape && selectedShape.type === 'text') {
        selectedShape.fontSize = parseInt(fontSize.value);
        redrawCanvas();
    }
});

opacity.addEventListener('input', () => {
    opacityValue.textContent = `${opacity.value}%`;
    if (selectedShape) {
        selectedShape.opacity = parseInt(opacity.value) / 100;
        redrawCanvas();
    }
});

fillColor.addEventListener('input', () => {
    if (selectedShape) {
        selectedShape.fillColor = fillColor.value;
        redrawCanvas();
    }
});

strokeColor.addEventListener('input', () => {
    if (selectedShape) {
        selectedShape.strokeColor = strokeColor.value;
        redrawCanvas();
    }
});

// Canvas events
editorCanvas.addEventListener('mousedown', (e) => {
    const rect = editorCanvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    
    if (currentTool === 'select') {
        selectedShape = findShapeAt(startX, startY);
        if (selectedShape) {
            updatePropertiesPanel();
        }
        redrawCanvas();
        updateLayersList();
    } else {
        isDrawing = true;
    }
});

editorCanvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    
    const rect = editorCanvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    redrawCanvas();
    
    // Preview shape
    editorCtx.save();
    editorCtx.globalAlpha = parseInt(opacity.value) / 100;
    editorCtx.fillStyle = fillColor.value;
    editorCtx.strokeStyle = strokeColor.value;
    editorCtx.lineWidth = parseInt(strokeWidth.value);
    
    if (currentTool === 'rectangle') {
        editorCtx.fillRect(startX, startY, currentX - startX, currentY - startY);
        editorCtx.strokeRect(startX, startY, currentX - startX, currentY - startY);
    } else if (currentTool === 'circle') {
        const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
        editorCtx.beginPath();
        editorCtx.arc(startX, startY, radius, 0, Math.PI * 2);
        editorCtx.fill();
        editorCtx.stroke();
    } else if (currentTool === 'line') {
        editorCtx.beginPath();
        editorCtx.moveTo(startX, startY);
        editorCtx.lineTo(currentX, currentY);
        editorCtx.stroke();
    }
    
    editorCtx.restore();
});

editorCanvas.addEventListener('mouseup', (e) => {
    if (!isDrawing) return;
    
    const rect = editorCanvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    
    let newShape = null;
    shapeCounter++;
    
    if (currentTool === 'rectangle') {
        newShape = {
            id: shapeCounter,
            type: 'rectangle',
            x: startX,
            y: startY,
            width: endX - startX,
            height: endY - startY,
            fillColor: fillColor.value,
            strokeColor: strokeColor.value,
            strokeWidth: parseInt(strokeWidth.value),
            opacity: parseInt(opacity.value) / 100,
            name: `Rectangle ${shapeCounter}`
        };
    } else if (currentTool === 'circle') {
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        newShape = {
            id: shapeCounter,
            type: 'circle',
            x: startX,
            y: startY,
            radius: radius,
            fillColor: fillColor.value,
            strokeColor: strokeColor.value,
            strokeWidth: parseInt(strokeWidth.value),
            opacity: parseInt(opacity.value) / 100,
            name: `Circle ${shapeCounter}`
        };
    } else if (currentTool === 'line') {
        newShape = {
            id: shapeCounter,
            type: 'line',
            x: startX,
            y: startY,
            endX: endX,
            endY: endY,
            strokeColor: strokeColor.value,
            strokeWidth: parseInt(strokeWidth.value),
            opacity: parseInt(opacity.value) / 100,
            name: `Line ${shapeCounter}`
        };
    } else if (currentTool === 'text') {
        const text = prompt('Enter text:');
        if (text) {
            newShape = {
                id: shapeCounter,
                type: 'text',
                x: startX,
                y: startY,
                text: text,
                fillColor: fillColor.value,
                fontSize: parseInt(fontSize.value),
                opacity: parseInt(opacity.value) / 100,
                name: `Text ${shapeCounter}`
            };
        }
    }
    
    if (newShape) {
        shapes.push(newShape);
        selectedShape = newShape;
        updateLayersList();
    }
    
    isDrawing = false;
    redrawCanvas();
});

// Find shape at position
function findShapeAt(x, y) {
    for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];
        
        if (shape.type === 'rectangle') {
            if (x >= shape.x && x <= shape.x + shape.width &&
                y >= shape.y && y <= shape.y + shape.height) {
                return shape;
            }
        } else if (shape.type === 'circle') {
            const dist = Math.sqrt(Math.pow(x - shape.x, 2) + Math.pow(y - shape.y, 2));
            if (dist <= shape.radius) {
                return shape;
            }
        } else if (shape.type === 'text') {
            editorCtx.font = `${shape.fontSize}px Arial`;
            const metrics = editorCtx.measureText(shape.text);
            if (x >= shape.x && x <= shape.x + metrics.width &&
                y >= shape.y - shape.fontSize && y <= shape.y) {
                return shape;
            }
        } else if (shape.type === 'line') {
            const dist = pointToLineDistance(x, y, shape.x, shape.y, shape.endX, shape.endY);
            if (dist < 10) {
                return shape;
            }
        }
    }
    return null;
}

function pointToLineDistance(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) param = dot / lenSq;
    
    let xx, yy;
    
    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }
    
    const dx = px - xx;
    const dy = py - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
}

// Redraw canvas
function redrawCanvas() {
    editorCtx.fillStyle = 'white';
    editorCtx.fillRect(0, 0, editorCanvas.width, editorCanvas.height);
    
    shapes.forEach(shape => {
        editorCtx.save();
        editorCtx.globalAlpha = shape.opacity;
        
        if (shape.type === 'rectangle') {
            editorCtx.fillStyle = shape.fillColor;
            editorCtx.strokeStyle = shape.strokeColor;
            editorCtx.lineWidth = shape.strokeWidth;
            editorCtx.fillRect(shape.x, shape.y, shape.width, shape.height);
            editorCtx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === 'circle') {
            editorCtx.fillStyle = shape.fillColor;
            editorCtx.strokeStyle = shape.strokeColor;
            editorCtx.lineWidth = shape.strokeWidth;
            editorCtx.beginPath();
            editorCtx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
            editorCtx.fill();
            editorCtx.stroke();
        } else if (shape.type === 'line') {
            editorCtx.strokeStyle = shape.strokeColor;
            editorCtx.lineWidth = shape.strokeWidth;
            editorCtx.beginPath();
            editorCtx.moveTo(shape.x, shape.y);
            editorCtx.lineTo(shape.endX, shape.endY);
            editorCtx.stroke();
        } else if (shape.type === 'text') {
            editorCtx.fillStyle = shape.fillColor;
            editorCtx.font = `${shape.fontSize}px Arial`;
            editorCtx.fillText(shape.text, shape.x, shape.y);
        }
        
        // Draw selection indicator
        if (shape === selectedShape) {
            editorCtx.strokeStyle = '#667eea';
            editorCtx.lineWidth = 2;
            editorCtx.setLineDash([5, 5]);
            
            if (shape.type === 'rectangle') {
                editorCtx.strokeRect(shape.x - 5, shape.y - 5, shape.width + 10, shape.height + 10);
            } else if (shape.type === 'circle') {
                editorCtx.beginPath();
                editorCtx.arc(shape.x, shape.y, shape.radius + 5, 0, Math.PI * 2);
                editorCtx.stroke();
            } else if (shape.type === 'text') {
                editorCtx.font = `${shape.fontSize}px Arial`;
                const metrics = editorCtx.measureText(shape.text);
                editorCtx.strokeRect(shape.x - 5, shape.y - shape.fontSize - 5, metrics.width + 10, shape.fontSize + 15);
            } else if (shape.type === 'line') {
                editorCtx.beginPath();
                editorCtx.moveTo(shape.x, shape.y);
                editorCtx.lineTo(shape.endX, shape.endY);
                editorCtx.stroke();
            }
            
            editorCtx.setLineDash([]);
        }
        
        editorCtx.restore();
    });
}

// Update layers list
function updateLayersList() {
    layersList.innerHTML = '';
    
    shapes.slice().reverse().forEach(shape => {
        const layerItem = document.createElement('div');
        layerItem.className = 'layer-item';
        if (shape === selectedShape) {
            layerItem.classList.add('selected');
        }
        layerItem.innerHTML = `
            <span>${shape.name}</span>
            <span>${shape.type}</span>
        `;
        layerItem.addEventListener('click', () => {
            selectedShape = shape;
            updatePropertiesPanel();
            redrawCanvas();
            updateLayersList();
        });
        layersList.appendChild(layerItem);
    });
}

// Update properties panel
function updatePropertiesPanel() {
    if (selectedShape) {
        fillColor.value = selectedShape.fillColor || '#3498db';
        strokeColor.value = selectedShape.strokeColor || '#2c3e50';
        strokeWidth.value = selectedShape.strokeWidth || 2;
        strokeWidthValue.textContent = `${selectedShape.strokeWidth || 2}px`;
        
        if (selectedShape.type === 'text') {
            fontSize.value = selectedShape.fontSize || 24;
            fontSizeValue.textContent = `${selectedShape.fontSize || 24}px`;
        }
        
        opacity.value = (selectedShape.opacity || 1) * 100;
        opacityValue.textContent = `${Math.round((selectedShape.opacity || 1) * 100)}%`;
    }
}

// Action buttons
deleteBtn.addEventListener('click', () => {
    if (selectedShape) {
        shapes = shapes.filter(s => s !== selectedShape);
        selectedShape = null;
        redrawCanvas();
        updateLayersList();
    }
});

duplicateBtn.addEventListener('click', () => {
    if (selectedShape) {
        const newShape = { ...selectedShape };
        shapeCounter++;
        newShape.id = shapeCounter;
        newShape.name = `${newShape.name} (copy)`;
        newShape.x += 20;
        newShape.y += 20;
        
        if (newShape.type === 'line') {
            newShape.endX += 20;
            newShape.endY += 20;
        }
        
        shapes.push(newShape);
        selectedShape = newShape;
        redrawCanvas();
        updateLayersList();
    }
});

bringFrontBtn.addEventListener('click', () => {
    if (selectedShape) {
        shapes = shapes.filter(s => s !== selectedShape);
        shapes.push(selectedShape);
        redrawCanvas();
        updateLayersList();
    }
});

sendBackBtn.addEventListener('click', () => {
    if (selectedShape) {
        shapes = shapes.filter(s => s !== selectedShape);
        shapes.unshift(selectedShape);
        redrawCanvas();
        updateLayersList();
    }
});

exportBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'design.png';
    link.href = editorCanvas.toDataURL();
    link.click();
});

// Initial draw
redrawCanvas();
