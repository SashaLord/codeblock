let workspace = [];


const blockTemplates = {
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
    }
};

function initializeDragAndDrop() {
    document.querySelectorAll('.palette-block').forEach(block => {
        block.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('blockType', block.dataset.type);
        });
    });

    const workspaceEl = document.getElementById('workspace');

    workspaceEl.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    workspaceEl.addEventListener('drop', (e) => {
        e.preventDefault();
        const blockType = e.dataTransfer.getData('blockType');
        if (blockType) addBlock(blockType);
    });
}


function addBlock(type) {
    workspace.push({ type, data: {} });
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
    const workspaceEl = document.getElementById('workspace');
    const empty = workspaceEl.querySelector('.workspace-empty');
    if (empty) empty.style.display = workspace.length > 0 ? 'none' : 'block';

    workspaceEl.querySelectorAll('.workspace-block').forEach(b => b.remove());
    workspace.forEach((block, index) => {
        workspaceEl.appendChild(createBlockElement(block, index));
    });
}

function createBlockElement(block, index) {
    const template = blockTemplates[block.type];
    const div = document.createElement('div');
    div.className = `workspace-block ${block.type}-block`;

    let content = `
        <div class="block-header">
            <span class="block-title">${template.title}</span>
            <button class="block-delete" onclick="deleteBlock(${index})">×</button>
        </div>
    `;

    template.fields.forEach(field => {
        content += `
            <input class="block-input" type="text" 
                   placeholder="${field.placeholder}"
                   value="${block.data[field.key] || ''}"
                   onchange="updateBlockData(${index}, '${field.key}', this.value)">
        `;
    });

    div.innerHTML = content;
    return div;
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


function interpretAST(ast) {
    const vars   = {};
    const output = [];

    for (const node of ast.body) {
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
        }
    }

    return { output, vars };
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
