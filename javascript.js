const display = document.querySelector('.display');
const equation = document.querySelector('.eqndisplay');

const operation = {
    input1: null,
    input2: null,
    operator: null,
};

function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    return num1 / num2
}

function operate(num1, num2, op) {
    switch (op) {
        case '+': return add(num1, num2);
        case '-': return subtract(num1, num2);
        case 'x': return multiply(num1, num2);
        case '/': return divide(num1, num2);
    }
}

function displayNumbers() {
    const buttons = document.querySelectorAll('.digit');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnPressed = e.target.textContent
 
            if (operation.input1 === null) {
                display.textContent = btnPressed;
                operation.input1 = display.textContent;
                equation.textContent = operation.input1;
            }         
            else if (operation.operator === null ) {
                display.textContent += btnPressed;
                operation.input1 = display.textContent;
                equation.textContent += btnPressed;
            }
            else {
                display.textContent = operation.input2 === null ? btnPressed : display.textContent + btnPressed;
                operation.input2 = display.textContent;
                equation.textContent += btnPressed   
            }  
        }); 
    }); 
}

function opButtons() {
    const opButtons = document.querySelectorAll('.operator');
    opButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (operation.input2 !== null) {
                display.textContent = operate(Number(operation.input1), Number(operation.input2), operation.operator);    
                operation.input2 = null;
            }
            operation.input1 = display.textContent;
            operation.operator = e.target.textContent;
            equation.textContent = operation.input1 + operation.operator;
        });
    });
}

function clearDisplay() {
    const clear = document.querySelector('.clear')
    clear.addEventListener('click', (e) => {
        display.textContent = '0';
        equation.textContent = '';
        operation.input1 = null;
        operation.input2 = null;
        operation.operator = null;
    });
}

function equals() {
    const equals = document.querySelector('.equals');
    equals.addEventListener('click', (e) => {
        if (operation.operator === null) {
            equation.textContent = operation.input1 + e.target.textContent
        }
        else if (operation.input2 === null) {
            equation.textContent = operation.input1 + operation.operator + operation.input1 + e.target.textContent;
            display.textContent = operate(Number(operation.input1), Number(operation.input1), operation.operator);
        }
        else {
            equation.textContent = operation.input1 + operation.operator + operation.input2 + e.target.textContent;
            display.textContent = operate(Number(operation.input1), Number(operation.input2), operation.operator);
        }
        operation.input1 = null;
        operation.input2 = null;
        operation.operator = null;
    })
}

displayNumbers()
opButtons()
clearDisplay()
equals()