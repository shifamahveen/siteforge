const builderArea = document.getElementById('builderArea');
const saveBtn = document.getElementById('saveBtn');

let selectedElements = null;

// Handle drag-and-drop
document.querySelectorAll('.element').forEach(el => {
    el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('type', el.dataset.type);
    });
});

builderArea.addEventListener('dragover', (e) => e.preventDefault());
function createGrid() {
    const cols = parseInt(prompt("Enter number of columns:", "3"), 10);
    if (isNaN(cols) || cols < 1 || cols > 12) return;

    let total = 0;
    const colSizes = [];
    const gridContent = [];

    for (let i = 0; i < cols; i++) {
        let size;
        do {
            size = parseInt(prompt(`Enter size for column ${i + 1} (remaining ${12 - total}):`, "4"), 10);
        } while (isNaN(size) || size < 1 || size > 12 - total);
        colSizes.push(size);
        total += size;
    }

    if (total !== 12) {
        alert("Total column size must be exactly 12. Try again.");
        return;
    }

    const newElement = document.createElement("div");
    newElement.className = "grid grid-cols-12 gap-2 w-full";
    newElement.dataset.type = "grid";

    colSizes.forEach((size, index) => {
        const colElement = document.createElement("div");
        colElement.className = `col-span-${size} p-4 bg-gray-200 border`;
        colElement.contentEditable = true;
        colElement.textContent = `Column ${index + 1}`;
        colElement.dataset.type = `col-span-${size}`;

        newElement.appendChild(colElement);

        gridContent.push({
            type: `col-span-${size}`,
            styles: "p-4 bg-gray-200",
            content: [`Column ${index + 1}`]
        });
    });

    newElement.dataset.content = JSON.stringify(gridContent); // Store structured content
    newElement.addEventListener("click", () => selectElement(newElement));
    builderArea.appendChild(newElement);
}


builderArea.addEventListener('drop', async (e) => {
    e.preventDefault();
    
    const type = e.dataTransfer.getData('type');
    let newElement;

    if (type === "grid") {
        createGrid();
    }

    else if (type === 'table') {
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
                cell.contentEditable = true;
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

    else if (type === 'marquee') {
        newElement = document.createElement('marquee');
        newElement.textContent = 'Scrolling Text';
        
        const direction = prompt('Enter direction (left, right, up, down):', 'left');
        if (direction) newElement.setAttribute('direction', direction);
        
        newElement.style.border = '1px solid #000';
        newElement.style.padding = '8px';
        newElement.contentEditable = true;
        
        newElement.addEventListener('click', () => selectElement(newElement));
        builderArea.appendChild(newElement);
    }

    else if (type === 'video') {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = type === 'image' ? 'image/*' : 'video/*';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                newElement = document.createElement(type);
                if (type === 'image') {
                    newElement.src = url;
                    newElement.style.maxWidth = '100%';
                    newElement.style.height = 'auto';
                } else {
                    newElement.src = url;
                    newElement.controls = true;
                    newElement.style.maxWidth = '100%';
                }

                newElement.className = 'rounded';
                newElement.style.border = '1px solid #000';
                newElement.addEventListener('click', () => selectElement(newElement));

                builderArea.appendChild(newElement);
            }
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        return;
    }

    else if (type === 'image') {
        const choice = confirm('Click OK to upload an image, or Cancel to enter a URL.');

        newElement = document.createElement('img');
        newElement.style.maxWidth = '100%';
        newElement.style.height = 'auto';
        newElement.style.border = '1px solid #000';
        newElement.style.padding = '5px';
        newElement.classList.add('rounded');

        if (!choice) { 
            // User chooses to enter a URL
            const imageUrl = prompt('Enter Image URL:');
            if (imageUrl) {
                newElement.src = imageUrl;
                builderArea.appendChild(newElement);
            }
        } else {
            // User chooses to upload a file
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.style.display = 'none';
            document.body.appendChild(input);

            input.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        newElement.src = e.target.result;
                        builderArea.appendChild(newElement);
                    };
                    reader.readAsDataURL(file);
                }
                document.body.removeChild(input);
            });

            input.click();
        }

        return;
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
    if(type === 'input' || type === 'form' || type === 'select' || type === 'textarea')
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

    const promises = Array.from(builderArea.childNodes).map(async el => {
        if (el.nodeType === 1) {
            let elementData = {
                type: el.className || el.tagName.toLowerCase(),
                styles: el.style.cssText || '',
                content: el.textContent.trim() || '',
            };

            if (el.classList.contains("grid-cols-12")) {
                elementData.content = [];
                el.childNodes.forEach(col => {
                    if (col.nodeType === 1 && col.dataset.type) {
                        elementData.content.push({
                            type: col.dataset.type,
                            styles: col.className,
                            content: [col.textContent.trim()]
                        });
                    }
                });
            } 
            else if (el.tagName === 'IMG') {
                if (el.src.startsWith('blob:')) {
                    elementData.src = await convertToBase64(el.src);
                } else {
                    elementData.src = el.src;
                }
            } 
            else if (el.tagName === 'VIDEO') {
                if (el.src.startsWith('blob:')) {
                    elementData.src = await convertToBase64(el.src);
                } else {
                    elementData.src = el.src;
                }
                elementData.controls = el.controls;
            } 
            else if (el.tagName === 'UL') {
                elementData.items = Array.from(el.querySelectorAll('li')).map(li => li.textContent);
            }

            return elementData;
        }
    });

    const resolvedElements = await Promise.all(promises);
    const filteredElements = resolvedElements.filter(Boolean);

    const name = prompt('Enter a name for your page:');
    if (name) {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
            const response = await fetch('/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'CSRF-Token': csrfToken },
                body: JSON.stringify({ name, content: filteredElements })
            });
            const result = await response.json();
            alert(result.message);
        } catch (err) {
            console.error('Error:', err);
            alert('Error saving page');
        }
    }
});

// Function to Convert Blob URLs to Base64
async function convertToBase64(blobUrl) {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}
