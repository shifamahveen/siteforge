const builderArea = document.getElementById('builderArea');
const saveBtn = document.getElementById('saveBtn');
let selectedElement = null;

// Handle drag-and-drop
document.querySelectorAll('.element').forEach(el => {
    el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('type', el.dataset.type);
    });
});

builderArea.addEventListener('dragover', (e) => e.preventDefault());

builderArea.addEventListener('drop', async (e) => {
    e.preventDefault();
    
    const type = e.dataTransfer.getData('type');
    let newElement;

    if (type === 'table') {
        const rows = parseInt(prompt('Enter number of rows:', '3'), 10);
        const cols = parseInt(prompt('Enter number of columns:', '3'), 10);

        if (isNaN(rows) || isNaN(cols) || rows < 1 || cols < 1) return;

        newElement = document.createElement('table');
        newElement.style.borderCollapse = 'collapse';
        newElement.style.width = '100%';

        for (let i = 0; i < rows; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('td');
                cell.style.border = '1px solid #000';
                cell.style.padding = '8px';
                cell.contentEditable = true; // Make cells editable
                row.appendChild(cell);
            }
            newElement.appendChild(row);
        }

        newElement.addEventListener('click', () => selectElement(newElement));
        builderArea.appendChild(newElement);
    }
    
    else if (type === 'ul' || type === 'ol') {
        newElement = document.createElement(type);
        for (let i = 0; i < 3; i++) {
            const listItem = document.createElement('li');
            listItem.contentEditable = true;
            listItem.textContent = `Item ${i + 1}`;
            newElement.appendChild(listItem);
        }

        newElement.className = 'rounded';
        newElement.style.padding = '8px';
        newElement.style.listStyleType = type === 'ul' ? 'disc' : 'decimal';
        
        newElement.addEventListener('click', () => selectElement(newElement));
        builderArea.appendChild(newElement);
    } 
    
    else if (type === 'input') {
        const inputType = prompt('Enter input type (text, number, email, date):', 'text');
        if (inputType) {
            newElement = document.createElement('input');
            newElement.type = inputType;
            newElement.placeholder = `Enter ${inputType}`;
            newElement.style.padding = '6px';
            newElement.style.border = '1px solid #000';
            newElement.style.borderRadius = '4px';
            newElement.style.display = 'block';
            newElement.addEventListener('click', () => selectElement(newElement));
            
            builderArea.appendChild(newElement);
        }
        return;
    } 
    
    else if (type === 'select') {
        newElement = document.createElement('select');
        const options = prompt('Enter dropdown options separated by commas:', 'Option 1, Option 2, Option 3');
        if (options) {
            options.split(',').forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.trim();
                option.textContent = opt.trim();
                newElement.appendChild(option);
            });
        }
        newElement.style.padding = '6px';
        newElement.style.border = '1px solid #000';
        newElement.style.borderRadius = '4px';
        newElement.addEventListener('click', () => editSelectOptions(newElement));
        builderArea.appendChild(newElement);
    }
    
    else if (type === 'textarea') {
        newElement = document.createElement('textarea');
        newElement.placeholder = 'Enter text here...';
        newElement.style.width = '100%';
        newElement.style.height = '100px';
        newElement.style.padding = '6px';
        newElement.style.border = '1px solid #000';
        newElement.style.borderRadius = '4px';
        newElement.addEventListener('click', () => selectElement(newElement));
        builderArea.appendChild(newElement);
    }
    
    else {
        newElement = document.createElement(type);
        if (type === 'h1') newElement.textContent = 'Heading';
        else if (type === 'p') newElement.textContent = 'Paragraph';
        else if (type === 'button') newElement.textContent = 'Button';
        else if (type === 'a') {
            newElement.textContent = 'Anchor';
            newElement.href = '#';
        } else {
            newElement.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        }
    }

    newElement.contentEditable = type !== 'input' && type !== 'form' && type !== 'ul' && type !== 'ol' && type !== 'select' && type !== 'textarea';
    newElement.className = `${type} rounded`;
    newElement.style.border = '1px solid #000';
    newElement.style.padding = '8px';
    newElement.addEventListener('click', () => selectElement(newElement));

    builderArea.appendChild(newElement);
});


function editSelectOptions(selectElement) {
    const options = Array.from(selectElement.options).map(opt => opt.textContent).join(', ');
    const newOptions = prompt('Edit dropdown options separated by commas:', options);
    if (newOptions) {
        selectElement.innerHTML = '';
        newOptions.split(',').forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.trim();
            option.textContent = opt.trim();
            selectElement.appendChild(option);
        });
    }
}


// Select element to apply styles
function selectElement(el) {
    selectedElement = el;
    document.getElementById('stylePanel').style.display = 'block';
    document.getElementById('colorPicker').value = el.style.color || '#000000';
    document.getElementById('bgColorPicker').value = el.style.backgroundColor || '#ffffff';
    document.getElementById('fontSize').value = parseInt(el.style.fontSize) || 16;
    document.getElementById('padding').value = parseInt(el.style.padding) || 0;
    document.getElementById('margin').value = parseInt(el.style.margin) || 0;
    document.getElementById('fontWeight').value = el.style.fontWeight || 'normal';
    document.getElementById('textAlign').value = el.style.textAlign || 'left';
    document.getElementById('flexDirection').value = el.style.flexDirection || 'row';
    document.getElementById('justifyContent').value = el.style.justifyContent || 'flex-start';
}

document.getElementById('colorPicker').addEventListener('input', (e) => {
    if (selectedElement) selectedElement.style.color = e.target.value;
});

document.getElementById('bgColorPicker').addEventListener('input', (e) => {
    if (selectedElement) selectedElement.style.backgroundColor = e.target.value;
});

document.getElementById('fontSize').addEventListener('input', (e) => {
    if (selectedElement) selectedElement.style.fontSize = e.target.value + 'px';
});

document.getElementById('padding').addEventListener('input', (e) => {
    if (selectedElement) selectedElement.style.padding = e.target.value + 'px';
});

document.getElementById('margin').addEventListener('input', (e) => {
    if (selectedElement) selectedElement.style.margin = e.target.value + 'px';
});

document.getElementById('fontWeight').addEventListener('change', (e) => {
    if (selectedElement) selectedElement.style.fontWeight = e.target.value;
});

document.getElementById('textAlign').addEventListener('change', (e) => {
    if (selectedElement) selectedElement.style.textAlign = e.target.value;
});

document.getElementById('flexDirection').addEventListener('change', (e) => {
    if (selectedElement) selectedElement.style.flexDirection = e.target.value;
});

document.getElementById('justifyContent').addEventListener('change', (e) => {
    if (selectedElement) selectedElement.style.justifyContent = e.target.value;
});

saveBtn.addEventListener('click', async () => {
    const elements = [];
    builderArea.childNodes.forEach(el => {
        if (el.nodeType === 1) {
            elements.push({
                type: el.className,
                content: el.textContent,
                styles: el.style.cssText
            });
        }
    });
    
    const name = prompt('Enter a name for your page:');
    if (name) {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
            const response = await fetch('/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'CSRF-Token': csrfToken },
                body: JSON.stringify({ name, content: elements })
            });
            const result = await response.json();
            alert(result.message);
        } catch (err) {
            console.error('Error:', err);
            alert('Error saving page');
        }
    }
});
