let displayValue;
let btnPressed, prevPressed;

const display = document.querySelector('.display');
const equation = document.querySelector('.eqndisplay');

const operators = ['+', '-', 'x', '/'];

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
            btnPressed = e.target.textContent

            if (display.textContent === '0' || operation.operator !== null) {
                display.textContent = e.target.textContent;  
            }

//If the display is populated, add the input to the display
//But will not allow user to enter two operators in a row
            else if ((operators.includes(prevPressed) && operators.includes(btnPressed)) === false) {
                equation.textContent += e.target.textContent; 
                display.textContent += e.target.textContent;
            }
            displayValue = display.textContent;
            prevPressed = btnPressed    
        }); 
    }); 
}

function opButtons() {
    const opButtons = document.querySelectorAll('.operator');
    opButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btnPressed = e.target.textContent;
            if ((operators.includes(prevPressed) && operators.includes(btnPressed)) === false) {
                if (operation.input1 === null) {
                    operation.input1 = displayValue;
                    operation.operator = btnPressed;
                    equation.textContent += e.target.textContent;
                }
                else {
                    operation.input2 = displayValue;
                    display.textContent = operate(Number(operation.input1), Number(operation.input2), operation.operator);
                    displayValue = display.textContent;
                    operation.input1 = displayValue;
                }
            }
            prevPressed = btnPressed
        });
    });
}

function clearDisplay() {
    const clear = document.querySelector('.clear')
    clear.addEventListener('click', (e) => {
        display.textContent = '0';
        equation.textContent = '';
        displayValue = display.textContent;
        btnPressed = '';
        prevPressed = '';
        operation.input1 = null;
        operation.input2 = null;
        operation.operator = null;
    });
}



function equals() {
    const equals = document.querySelector('.equals');
    equals.addEventListener('click', (e) => {
//TODO fix to use object and set operator and input 2 to null - similar to opButtons()
            display.textContent = operate(Number(operation.input1), Number(operation.input2), operation.operator);
            displayValue = display.textContent;
            input1 = displayValue;
    })
}

displayNumbers()
clearDisplay()
equals()