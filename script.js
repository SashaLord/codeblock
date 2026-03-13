let workspace = [];


const block_types = {
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
    },
    while: {
<<<<<<< HEAD
    title: 'While',
    fields: []
    },
    array_declare: {
    title: 'Создать массив',
    fields: [
            { key: 'name', placeholder: 'Имя массива' },
            { key: 'size', placeholder: 'Размер или значения через пробел' }
        ]
    },
    array_set: {
    title: 'Запись в массив',
    fields: [
            { key: 'name',  placeholder: 'Имя массива' },
            { key: 'index', placeholder: 'Индекс' },
            { key: 'value', placeholder: 'Значение' }
        ]
    },
    array_get: {
    title: 'Чтение из массива',
    fields: [
            { key: 'target', placeholder: 'Куда сохранить' },
            { key: 'name',   placeholder: 'Имя массива' },
            { key: 'index',  placeholder: 'Индекс' }
        ]
=======
        title: 'While',
        fields: []
>>>>>>> d7e791068ffad6ff582c2dd0c40157e95411d146
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
<<<<<<< HEAD
    workspaceElement.addEventListener('dragover', (e) => { e.preventDefault(); });
    workspaceElement.addEventListener('drop', (e) => { e.preventDefault();e.stopPropagation();
        const blockType = e.dataTransfer.getData('blockType');
        if (!blockType) return;
        if (blockType === 'condition_if')
            list.push({ type: blockType, data: { left: '', op: '>', right: '' }, body: [], elseBody: null });
        else if (blockType === 'while')
            list.push({ type: blockType, data: { left: '', op: '>', right: '' }, body: [] });
        else
=======
    workspaceElement.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); });
    workspaceElement.addEventListener('drop', (e) => { e.preventDefault();e.stopPropagation();
        const blockType = e.dataTransfer.getData('blockType');
        if (!blockType) return;
        if (blockType === 'condition_if' || blockType === 'while') {
            list.push({ type: blockType, data: { left: '', op: '>', right: '' }, body: [] });
        }
         else {
>>>>>>> d7e791068ffad6ff582c2dd0c40157e95411d146
            list.push({ type: blockType, data: {} });
        renderWorkspace();
    });
}


function addBlock(type) {
<<<<<<< HEAD
    if (type === 'condition_if')
        workspace.push({ type, data: { left: '', op: '>', right: '' }, body: [], elseBody: null});
    else if (type === 'while') 
=======
    if (type === 'condition_if' || type === 'while') {
>>>>>>> d7e791068ffad6ff582c2dd0c40157e95411d146
        workspace.push({ type, data: { left: '', op: '>', right: '' }, body: [] });
    else 
        workspace.push({ type, data: {} });
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
<<<<<<< HEAD
}

function createBlockElement(block, path) {
=======

    document.querySelectorAll('.if-body').forEach(el => {
        const index = parseInt(el.dataset.ifIndex);
        setupDropZone(el, workspace[index].body);
    });
    document.querySelectorAll('.while-body').forEach(el => {
    const index = parseInt(el.dataset.whileIndex);
    setupDropZone(el, workspace[index].body);
});
}

function createBlockElement(block, index, parentIndex = null) {
>>>>>>> d7e791068ffad6ff582c2dd0c40157e95411d146
    const template = block_types[block.type];
    const div = document.createElement('div');
    div.className = `workspace-block ${block.type}-block`;

    const deleteCall = `deleteByPath('${path}')`;
    const updateCall = (key) => `updateByPath('${path}', '${key}', this.value)`;

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


    if (block.type === 'condition_if' || block.type === 'while') {
    const opOptions = operators.map(op =>
        `<option value="${op}" ${block.data.op === op ? 'selected' : ''}>${op}</option>`
    ).join('');

    const bodyHTML = block.body.length === 0
        ? '<div class="if-body-empty">Перетащите блоки сюда</div>'
        : block.body.map((child, index) =>
            createBlockElement(child, `${path}.${index}`).outerHTML
          ).join('');

    const bodyClass = block.type === 'condition_if' ? 'if-body' : 'while-body';

    let elseSection = '';
    if (block.type === 'condition_if') {
        if (block.elseBody === null) {
            elseSection = `<button class="else-add" onclick="addElse('${path}')">+</button>`;}
        else {
            const elseBodyHTML = block.elseBody.length === 0
            ? '<div class="if-body-empty">Перетащите блоки сюда</div>'
            : block.elseBody.map((child, index) =>
                createBlockElement(child, `${path}.else.${index}`).outerHTML
              ).join('');
        elseSection = `
            <div class="else-label">else</div>
            <div class="else-body" data-body-path="${path}.else">
                ${elseBodyHTML}
            </div>
            <button class="block-delete" onclick="removeElse('${path}')">×</button>
        `;}}

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
<<<<<<< HEAD
        <div class="${bodyClass}" data-body-path="${path}">${bodyHTML}
=======
        <div class="${block.type === 'condition_if' ? 'if-body' : 'while-body'}" 
        data-${block.type === 'condition_if' ? 'if' : 'while'}-index="${index}">
            ${bodyHTML}
>>>>>>> d7e791068ffad6ff582c2dd0c40157e95411d146
        </div>
        ${elseSection}
    `;
}

    div.innerHTML = content;

    if (block.type === 'condition_if' || block.type === 'while') {
        const bodyEl = div.querySelector(`[data-body-path="${path}"]`);
        if (bodyEl) setupDropZone(bodyEl, block.body);
 
        if (block.type === 'condition_if' && block.elseBody !== null) {
            const elseEl = div.querySelector(`[data-body-path="${path}.else"]`);
            if (elseEl) setupDropZone(elseEl, block.elseBody);
        }
    }

    return div;
}

function addElse(path) {
    const parts = path.split('.');
    const list = getListByPath(path);
    list[parseInt(parts[parts.length - 1])].elseBody = [];
    renderWorkspace();
}

function removeElse(path) {
    const parts = path.split('.');
    const list = getListByPath(path);
    list[parseInt(parts[parts.length - 1])].elseBody = null;
    renderWorkspace();
}

function deleteByPath(path) {
    const parts = path.split('.');
    const list = getListByPath(path);
    list.splice(parseInt(parts[parts.length - 1]), 1);
    renderWorkspace();
}

function updateByPath(path, field, value) {
    const parts = path.split('.');
    const list = getListByPath(path);
    list[parseInt(parts[parts.length - 1])].data[field] = value;
}

function getListByPath(path) {
    const parts = path.split('.');
    let list = workspace;
    for (let i = 0; i < parts.length - 1; i++) {
        if (parts[i] === 'else') 
            list = list.elseBody;
        else{
            const index = parseInt(parts[i]);
            if (parts[i + 1] === 'else')
                list = list[index];
            else 
                list = list[index].body;
            }}
    return list;
}

function parser(src) {
    let i = 0;
    
    function skip() { while (i < src.length && src[i] === ' ') i++; }
    
    function readNum() {
        let n = '';
        while (i < src.length && src[i] >= '0' && src[i] <= '9') n += src[i++];
        if (src[i] === '.') {
            n += src[i++];
            while (i < src.length && src[i] >= '0' && src[i] <= '9') n += src[i++];}
        return parseFloat(n);
    }
    
    function readId() {
        let n = '';
        while (i < src.length && /[a-zA-Z0-9_]/.test(src[i])) n += src[i++];
        return n;
    }

    function logicalOr() {
        let left = logicalAnd();
        while (skip(), src.slice(i, i+2) === 'or' && !/[a-zA-Z0-9_]/.test(src[i+2])) {
            i += 2;
            left = { type: 'Logic', op: 'or', left, right: logicalAnd() };
        }
        return left;
    }
    
    function logicalAnd() {
        let left = logicalNot();
        while (skip(), src.slice(i, i+3) === 'and' && !/[a-zA-Z0-9_]/.test(src[i+3])) {
            i += 3;
            left = { type: 'Logic', op: 'and', left, right: logicalNot() };
        }
        return left;
    }

    function logicalNot() {
        skip();
        if (src.slice(i, i+3) === 'not' && !/[a-zA-Z0-9_]/.test(src[i+3])) {
            i += 3;
            return { type: 'Logic', op: 'not', operand: logicalNot() };
        }
        return expression();
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
            const name = readId();
            skip();
            if (src[i] === '[') {
                i++;
                const indexNode = expression();
                skip();
                if (src[i] !== ']') throw new Error('Нет закрывающей скобки ]');
                i++;
                return { type: 'ArrayGet', name, index: indexNode };
            }
            return { type: 'Var', name };
        }
        
        throw new Error(`Неизвестный символ: '${src[i]}'`);
    }
    
    const result = logicalOr();
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
                    body: buildAST(block.body).body,
                    elseBody: block.elseBody !== null ? buildAST(block.elseBody).body : null
                });
                break;
            }
            case 'while': {
                const left  = (block.data.left  || '');
                const right = (block.data.right || '');
                const op    =  block.data.op || '>';
                if (!left)  throw new Error('Блок "while": нет левой части');
                if (!right) throw new Error('Блок "while": нет правой части');
                body.push({
                    type: 'While',
                    condition: { op, left: parser(left), right: parser(right) },
                    body: buildAST(block.body).body
                });
                break;
            }
<<<<<<< HEAD
            case 'array_declare': {
                const name = block.data.name || '';
                const size = block.data.size || '';
                if (!name) throw new Error('Блок "Создать массив": не указано имя');
                if (!size) throw new Error('Блок "Создать массив": не указан размер');
                if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name))
                    throw new Error(`Недопустимое имя массива: "${name}"`);
                const parts = size.trim().split(/\s+/);
                if (parts.length > 1) {
                    const values = parts.map((p, i) => {
                        const n = Number(p);
                        if (isNaN(n)) throw new Error(`Неверное значение "${p}" на позиции ${i}`);
                        return n;
                    });
                    body.push({ type: 'ArrayDeclareValues', name, values });}
                else {
                    body.push({ type: 'ArrayDeclare', name, sizeExpr: parser(size) });
                }
                break;
            }
            case 'array_set': {
                const name  = block.data.name || '';
                const index = block.data.index || '';
                const value = block.data.value || '';
                if (!name)  throw new Error('Блок "Запись в массив": не указано имя');
                if (!index) throw new Error('Блок "Запись в массив": не указан индекс');
                if (!value) throw new Error('Блок "Запись в массив": не указано значение');
                body.push({ type: 'ArraySet', name, indexExpr: parser(index), valueExpr: parser(value) });
                break;
            }
            case 'array_get': {
                const target = block.data.target || '';
                const name   = block.data.name   || '';
                const index  = block.data.index  || '';
                if (!target) throw new Error('Блок "Чтение из массива": не указана переменная');
                if (!name)   throw new Error('Блок "Чтение из массива": не указано имя  массива');
                if (!index)  throw new Error('Блок "Чтение из массива": не указан индекс');
                body.push({ type: 'ArrayGet', target, name, indexExpr: parser(index) });
                break;
            }}}
=======
            case 'while': {
                const left  = (block.data.left  || '');
                const right = (block.data.right || '');
                const op    =  block.data.op || '>';
                if (!left)  throw new Error('Блок "while": нет левой части');
                if (!right) throw new Error('Блок "while": нет правой части');
                body.push({
                    type: 'While',
                    condition: { op, left: parser(left), right: parser(right) },
                    body: buildAST(block.body).body
                });
                break;
}
        }
    }

>>>>>>> d7e791068ffad6ff582c2dd0c40157e95411d146
    return { type: 'Program', body };
}


function toRPN(node) {
    if (node.type === 'Num')   return [{ kind: 'num', value: node.value }];
    if (node.type === 'Var')   return [{ kind: 'var', name: node.name }];
    if (node.type === 'Str')   return [{ kind: 'str', value: node.value }];
    if (node.type === 'Operation') return [...toRPN(node.left), ...toRPN(node.right), { kind: 'op', op: node.op }];
    if (node.type === 'ArrayGet') return [{ kind: 'arrayget', name: node.name, index: node.index }];
}

function evalRPN(rpn, vars) {
    const stack = [];
    for (const i of rpn) {
        if (i.kind === 'num') { stack.push(i.value); continue; }
        if (i.kind === 'str') { stack.push(i.value); continue; }
        if (i.kind === 'var') {
            if (!(i.name in vars)) throw new Error(`Переменная '${i.name}' не объявлена`);
            const val = vars[i.name];
            stack.push(Array.isArray(val) ? `[${val.join(', ')}]` : val);
            continue;
        }
        if (i.kind === 'arrayget') {
            if (!(i.name in vars)) throw new Error(`Массив '${i.name}' не объявлен`);
            const arr = vars[i.name];
            if (!Array.isArray(arr)) throw new Error(`'${i.name}' не является массивом`);
            const index = evalRPN(toRPN(i.index), vars);
            if (index < 0 || index >= arr.length) throw new Error(`Индекс ${index} выходит за границы массива '${i.name}'`);
            stack.push(arr[index]);
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
    if (node.type === 'Logic') {
        if (node.op === 'and') 
            return evalExpression(node.left, vars) && evalExpression(node.right, vars);
        if (node.op === 'or')  
            return evalExpression(node.left, vars) || evalExpression(node.right, vars);
        if (node.op === 'not') 
            return !evalExpression(node.operand, vars);
    }
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
                if (evalCondition(node.condition, vars))
                    interpret(node.body, vars, output);
                else if (node.elseBody !== null)
                    interpret(node.elseBody, vars, output);
                break;
<<<<<<< HEAD

            case 'While':
                while (evalCondition(node.condition, vars))
                    interpret(node.body, vars, output);
                    break;

            case 'ArrayDeclare':{
                const size = evalExpression(node.sizeExpr, vars);
                if (!Number.isInteger(size) || size <= 0)
                    throw new Error(`Размер массива должен быть положительным целым числом`);
                vars[node.name] = new Array(size).fill(0);
                break;
            }
            case 'ArrayDeclareValues': {
                vars[node.name] = node.values;
                break;
            }

            case 'ArraySet':{
                if (!(node.name in vars))
                    throw new Error(`Массив '${node.name}' не объявлен`);
                if (!Array.isArray(vars[node.name]))
                    throw new Error(`'${node.name}' не является массивом`);
                const index = evalExpression(node.indexExpr, vars);
                if (index < 0 || index >= vars[node.name].length)
                    throw new Error(`Индекс ${index} выходит за границы массива '${node.name}'`);
                vars[node.name][index] = evalExpression(node.valueExpr, vars);
                break;
            } 
            case 'ArrayGet':{
                if (!(node.target in vars))
                    throw new Error(`Переменная '${node.target}' не объявлена`);
                if (!(node.name in vars))
                    throw new Error(`Массив '${node.name}' не объявлен`);
                if (!Array.isArray(vars[node.name]))
                    throw new Error(`'${node.name}' не является массивом`);
                const index = evalExpression(node.indexExpr, vars);
                if (index < 0 || index >= vars[node.name].length)
                    throw new Error(`Индекс ${index} выходит за границы массива '${node.name}'`);
                vars[node.target] = vars[node.name][index];
                break;
            }}
=======
            case 'While':
                while (evalCondition(node.condition, vars)) {
                    interpret(node.body, vars, output);
                }
    break;
        }
>>>>>>> d7e791068ffad6ff582c2dd0c40157e95411d146
    }
}

function interpretAST(ast) {
    const vars = {}, output = [];
    interpret(ast.body, vars, output);
    return { output, vars };
}

function evalCondition(condition, vars) {
    if (condition.type === 'Logic') {
        return evalExpression(condition, vars);
    }
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
