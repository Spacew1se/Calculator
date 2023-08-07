
const display = document.querySelector('.display');
const equation = document.querySelector('.eqndisplay');

const operators = ['+', '-', 'x', '/'];

const operation = {
    input1: '0',
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
 
            if (operation.operator === null) {
                display.textContent = operation.input1 === '0' ? btnPressed : display.textContent + btnPressed;
                operation.input1 = display.textContent;
            }         
            else {
                display.textContent = operation.input2 === null ? btnPressed : display.textContent + btnPressed;
                equation.textContent += e.target.textContent;
                operation.input2 = display.textContent;   
            }  
        }); 
    }); 
}

function opButtons() {
    const opButtons = document.querySelectorAll('.operator');

    opButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
  
//If second input is set, operator must be too
//Perform operation and display result before setting new operator
            if (operation.input2 !== null) {
                display.textContent = operate(Number(operation.input1), Number(operation.input2), operation.operator);
                operation.input1 = display.textContent;
                operation.input2 = null;
            }
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
        equation.textContent = operation.input1 + operation.operator + operation.input2 + e.target.textContent;
        display.textContent = operate(Number(operation.input1), Number(operation.input2), operation.operator);    
        operation.input1 = display.textContent;
        operation.input2 = null;
        operation.operator = null;
    })
}

displayNumbers()
opButtons()
clearDisplay()
equals()