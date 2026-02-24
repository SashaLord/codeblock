let workspace = [];


const blocks = {
    declaration: {
        title: 'Объявление переменной',
        fields: [
            { key: 'name', placeholder: 'Введите имя переменной' }
        ]
    },
    assign: {
        title: 'Присваивание',
        fields: [
            { key: 'variable', placeholder: 'Введите имя переменной' },
            { key: 'expression', placeholder: 'Введите выражение' }
        ]
    },
    print: {
        title: 'Вывод',
        fields: [
            { key: 'value', placeholder: 'Что вывести' }
        ]
    },
    condition_if: {
        title: 'If',
        fields: []
    }
};

const operators = ['>', '<', '=', '!=', '>=', '<='];

function initializeDragAndDrop() {
    document.querySelectorAll('.palette-block').forEach(block => {
        block.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('blockType', block.dataset.type);
        });
    });

    setupDropZone(document.getElementById('workspace'), workspace);
}

function setupDropZone(workspaceElement, list) {
    workspaceElement.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); });
    workspaceElement.addEventListener('drop', (e) => {
        e.preventDefault();e.stopPropagation();
        const blockType = e.dataTransfer.getData('blockType');
        if (!blockType) return;
        if (blockType === 'condition_if') {
            list.push({ type: 'condition_if', data: { left: '', op: '>', right: '' }, body: [] });
        } else {
            list.push({ type: blockType, data: {} });
        }
        renderWorkspace();
    });
}


function addBlock(type) {
    if (type === 'condition_if') {
        workspace.push({ type, data: { left: '', op: '>', right: '' }, body: [] });
    } else {
        workspace.push({ type, data: {} });
    }
    renderWorkspace();
}

function updateBlockData(index, field, value) {
    workspace[index].data[field] = value;
}

function deleteBlock(index) {
    workspace.splice(index, 1);
    renderWorkspace();
}

function clearWorkspace() {
    workspace = [];
    renderWorkspace();
    document.getElementById('output').textContent = '';
}

function renderWorkspace() {
    const workspaceElement = document.getElementById('workspace');
    const empty = workspaceElement.querySelector('.workspace-empty');
    if (empty) empty.style.display = workspace.length > 0 ? 'none' : 'block';

    workspaceElement.querySelectorAll('.workspace-block').forEach(b => b.remove());
    workspace.forEach((block, index) => {
        workspaceElement.appendChild(createBlockElement(block, index));
    });

    document.querySelectorAll('.if-body').forEach(el => {
        const index = parseInt(el.dataset.ifIndex);
        setupDropZone(el, workspace[index].body);
    });
}

function createBlockElement(block, index, parentIndex = null) {
    const template = blocks[block.type];
    const div = document.createElement('div');
    div.className = `workspace-block ${block.type}-block`;

    const deleteCall = parentIndex !== null
        ? `deleteNestedBlock(${parentIndex}, ${index})`
        : `deleteBlock(${index})`;

    const updateCall = (key) => parentIndex !== null
        ? `updateNestedBlockData(${parentIndex}, ${index}, '${key}', this.value)`
        : `updateBlockData(${index}, '${key}', this.value)`;

    let content = `
        <div class="block-header">
            <span class="block-title">${template.title}</span>
            <button class="block-delete" onclick="${deleteCall}">×</button>
        </div>
    `;

    template.fields.forEach(field => {
        content += `
            <input class="block-input" type="text" 
                   placeholder="${field.placeholder}"
                   value="${block.data[field.key] || ''}"
                   onchange="${updateCall(field.key)}">
        `;
    });


    if (block.type === 'condition_if') {
    const opOptions = operators.map(op =>
        `<option value="${op}" ${block.data.op === op ? 'selected' : ''}>${op}</option>`
    ).join('');

    const bodyHTML = block.body.length === 0
        ? '<div class="if-body-empty">Перетащите блоки сюда</div>'
        : block.body.map((child, ci) =>
            createBlockElement(child, ci, index).outerHTML
          ).join('');

    content += `
        <div class="if-condition">
            <input class="block-input if-input" type="text"
                   value="${block.data.left || ''}"
                   onchange="${updateCall('left')}">
            <select class="block-select"
                    onchange="${updateCall('op')}">
                ${opOptions}
            </select>
            <input class="block-input if-input" type="text"
                   value="${block.data.right || ''}"
                   onchange="${updateCall('right')}">
        </div>
        <div class="if-body" data-if-index="${index}">
            ${bodyHTML}
        </div>
    `;
}

    div.innerHTML = content;
    return div;
}

function deleteNestedBlock(ifIndex, childIndex) {
    workspace[ifIndex].body.splice(childIndex, 1);
    renderWorkspace();
}

function updateNestedBlockData(ifIndex, childIndex, field, value) {
    workspace[ifIndex].body[childIndex].data[field] = value;
}

function parser(src) {
    let i = 0;
    
    function skip() { while (i < src.length && src[i] === ' ') i++; }
    
    function readNum() {
        let n = '';
        while (i < src.length && src[i] >= '0' && src[i] <= '9') n += src[i++];
        return parseInt(n);
    }
    
    function readId() {
        let n = '';
        while (i < src.length && /[a-zA-Z0-9_]/.test(src[i])) n += src[i++];
        return n;
    }
    
    function expression() {
        let left = term();
        while (skip(), i < src.length && (src[i] === '+' || src[i] === '-')) {
            const op = src[i++];
            left = { type: 'Operation', op, left, right: term() };
        }
        return left;
    }
    
    function term() {
        let left = factor();
        while (skip(), i < src.length && (src[i] === '*' || src[i] === '/' || src[i] === '%')) {
            const op = src[i++];
            left = { type: 'Operation', op, left, right: factor() };
        }
        return left;
    }
    
    function factor() {
        skip();
        if (i >= src.length) throw new Error('Незаконченное выражение');
        
        if (src[i] === '(') {
            i++;
            const node = expression();
            skip();
            if (src[i] !== ')') throw new Error('Нет закрывающей скобки');
            i++;
            return node;
        }
        
        if (src[i] === '-') {
            i++;
            return { type: 'Operation', op: '-', left: { type: 'Num', value: 0 }, right: factor() };
        }
        
        if (/[0-9]/.test(src[i])) {
            return { type: 'Num', value: readNum() };
        }
        
        if (/[a-zA-Z_]/.test(src[i])) {
            return { type: 'Var', name: readId() };
        }
        
        throw new Error(`Неизвестный символ: '${src[i]}'`);
    }
    
    const result = expression();
    skip();
    if (i < src.length) throw new Error(`Лишний символ: '${src[i]}'`);
    return result;
}


function buildAST(blocks) {
    const body = [];

    for (const block of blocks) {
        switch (block.type) {

            case 'declaration': {
                const name = block.data.name || '';
                if (!name) throw new Error('Блок "Переменная": не указано имя');
                if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name))
                    throw new Error(`Недопустимое имя переменной: "${name}"`);
                body.push({ type: 'Declaration', name });
                break;
            }

            case 'assign': {
                const target  = block.data.variable || '';
                const expression = block.data.expression || '';
                if (!target)  throw new Error('Блок "Присваивание": не указана переменная');
                if (!expression) throw new Error('Блок "Присваивание": не указано выражение');
                body.push({ type: 'Assign', target, expr: parser(expression) });
                break;
            }

            case 'print': {
                const value = block.data.value || '';
                if (!value) throw new Error('Блок "Вывод": не указано значение');
                if ((value.startsWith("'") && value.endsWith("'")) ||
                    (value.startsWith('"') && value.endsWith('"'))) {
                    body.push({ type: 'Print', expr: { type: 'Str', value: value.slice(1, -1) } });
                } else {
                    body.push({ type: 'Print', expr: parser(value) });
                }
                break;
            }

            case 'condition_if': {
                const left = (block.data.left  || '');
                const right = (block.data.right || '');
                const op = block.data.op || '>';
                if (!left)  throw new Error('Блок "if": нет левой части');
                if (!right) throw new Error('Блок "if": нет правой части');
                body.push({
                    type: 'If',
                    condition: { op, left: parser(left), right: parser(right) },
                    body: buildAST(block.body).body
                });
                break;
            }
        }
    }

    return { type: 'Program', body };
}


function toRPN(node) {
    if (node.type === 'Num')   return [{ kind: 'num', value: node.value }];
    if (node.type === 'Var')   return [{ kind: 'var', name: node.name }];
    if (node.type === 'Str')   return [{ kind: 'str', value: node.value }];
    if (node.type === 'Operation') return [...toRPN(node.left), ...toRPN(node.right), { kind: 'op', op: node.op }];
}

function evalRPN(rpn, vars) {
    const stack = [];
    for (const i of rpn) {
        if (i.kind === 'num') { stack.push(i.value); continue; }
        if (i.kind === 'str') { stack.push(i.value); continue; }
        if (i.kind === 'var') {
            if (!(i.name in vars)) throw new Error(`Переменная '${i.name}' не объявлена`);
            stack.push(vars[i.name]);
            continue;
        }
        const b = stack.pop(), a = stack.pop();
        if (i.op === '+') stack.push(a + b);
        if (i.op === '-') stack.push(a - b);
        if (i.op === '*') stack.push(a * b);
        if (i.op === '/') {
            if (b === 0) throw new Error('Деление на ноль');
            stack.push(Math.trunc(a / b));
        }
        if (i.op === '%') stack.push(a % b);
    }
    return stack[0];
}

function evalExpression(node, vars) {
    return evalRPN(toRPN(node), vars);
}


function interpret(nodes, vars, output) {
    for (const node of nodes) {
        switch (node.type) {
            case 'Declaration':
                vars[node.name] = 0;
                break;

            case 'Assign':
                if (!(node.target in vars))
                    throw new Error(`Переменная '${node.target}' не объявлена`);
                vars[node.target] = evalExpression(node.expr, vars);
                break;

            case 'Print':
                output.push(evalExpression(node.expr, vars));
                break;

            case 'If':
                if (evalCondition(node.condition, vars)) {
                    interpret(node.body, vars, output);
                }
                break;
        }
    }
}

function interpretAST(ast) {
    const vars = {}, output = [];
    interpret(ast.body, vars, output);
    return { output, vars };
}

function evalCondition(condition, vars) {
    const a = evalExpression(condition.left,  vars);
    const b = evalExpression(condition.right, vars);
    if (condition.op === '>') return a > b;
    if (condition.op === '<') return a < b;
    if (condition.op === '=') return a === b;
    if (condition.op === '!=') return a !== b;
    if (condition.op === '>=') return a >= b;
    if (condition.op === '<=') return a <= b;
}

function runProgram() {
    const outputEl = document.getElementById('output');
    try {
        const ast    = buildAST(workspace);
        const result = interpretAST(ast);
        outputEl.textContent = result.output.join('\n');
    } catch (e) {
        outputEl.textContent = `❌ ОШИБКА: ${e.message}`;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    initializeDragAndDrop();
    renderWorkspace();
    document.getElementById('runBtn').addEventListener('click', runProgram);
    document.getElementById('clearBtn').addEventListener('click', clearWorkspace);
});
