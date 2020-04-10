let container = document.querySelector('.container');

const data = new Array(100).fill('').map((row, i) => ({
    id: `id${i + 1}`,
    name: `row ${i + 1}`
}));

let perPage = 10, rowHeight = 20;

const createRow = obj => {
    if(!obj) return;
    let node = document.createElement('div');
    node.classList.add('row');
    let text = document.createTextNode(obj.name);
    node.appendChild(text);
    return node;
}

const virtualScroll = ({ perPage, rowHeight, data, container, createRow }) => {
    let first = 0;

    const table = document.createElement('div');
    table.classList.add('table');
    container.appendChild(table);

    const body = document.createElement('div');
    body.classList.add('table-body');
    table.appendChild(body);

    table.style.height = data.length * rowHeight;

    const renderRows = (delta) => {

        body.innerHTML = '';

        let margin = table.style.marginTop ? parseInt(table.style.marginTop) : 0;

        table.style.marginTop = margin + delta;
        table.style.height = data.length * rowHeight - margin - delta;

        let first = Math.floor(((isNaN(margin) ? 0 : margin) + delta) / rowHeight);
        const last = first + perPage;

        for(let i = first; i <= last; i++) {
            data[i] && body.append(createRow(data[i]));
        }
        console.log(first, delta)
    }

    renderRows(first, 0);

    const scrollHandler = () => {
        const rectCnt = container.getBoundingClientRect();
        const rectTable = table.getBoundingClientRect();
        const deltaY = rectCnt.y - rectTable.y;

        renderRows(deltaY);
    };

    const debounce = (fn, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        }
    }

    container.addEventListener('scroll', debounce(scrollHandler, 200));
}

virtualScroll({ perPage, rowHeight, data, container, createRow });