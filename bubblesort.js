function loadBubbleSort() {
    workspace = [
        {
            type: 'array_declare',
            data: { name: 'a', size: '17 3 8 15 9 21 34 48 6 1' }
        },
        {
            type: 'declaration',
            data: { name: 'n' }
        },
        {
            type: 'assign',
            data: { variable: 'n', expression: '10' }
        },
        {
            type: 'declaration',
            data: { name: 'i' }
        },
        {
            type: 'declaration',
            data: { name: 'j' }
        },
        {
            type: 'declaration',
            data: { name: 'cur' }
        },
        {
            type: 'declaration',
            data: { name: 'next' }
        },
        {
            type: 'while',
            data: { left: 'i', op: '<', right: 'n-1' },
            body: [
                {
                    type: 'assign',
                    data: { variable: 'j', expression: '0' }
                },
                {
                    type: 'while',
                    data: { left: 'j', op: '<', right: 'n-i-1' },
                    body: [
                        {
                            type: 'array_get',
                            data: { target: 'next', name: 'a', index: 'j+1' }
                        },
                        {
                            type: 'array_get',
                            data: { target: 'cur', name: 'a', index: 'j' }
                        },
                        {
                            type: 'condition_if',
                            data: { left: 'cur', op: '>', right: 'next' },
                            elseBody: null,
                            body: [
                                {
                                    type: 'array_set',
                                    data: { name: 'a', index: 'j', value: 'next' }
                                },
                                {
                                    type: 'array_set',
                                    data: { name: 'a', index: 'j+1', value: 'cur' }
                                }
                            ]
                        },
                        {
                            type: 'assign',
                            data: { variable: 'j', expression: 'j+1' }
                        }
                    ]
                },
                {
                    type: 'assign',
                    data: { variable: 'i', expression: 'i+1' }
                }
            ]
        },
        {
            type: 'print',
            data: { value: 'a' }
        }
    ];

    renderWorkspace();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('BubbleSortBtn').addEventListener('click', loadBubbleSort);
});