let num1, num2, operator;
let btnPressed, prevPressed;
const operators = ['+', '-', 'x', '/'];
//Store operands and operator as object - key:value pair

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

function operate(num1, num2, operator) {
    switch (operator) {
        case '+': return add(num1, num2);
        case '-': return subtract(num1, num2);
        case '*': return multiply(num1, num2);
        case '/': return divide(num1, num2);
    }
}

function displayNumbers() {
    const buttons = document.querySelectorAll('.digit, .operator');
    const display = document.querySelector('.display');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btnPressed = e.target.textContent
            if (display.textContent === '0' && operators.includes(btnPressed) === false) {
                display.textContent = e.target.textContent;
            }
            else if ((operators.includes(prevPressed) && operators.includes(btnPressed)) === false) {
                display.textContent += e.target.textContent;
            }
            prevPressed = btnPressed
            displayValue = display.textContent;        
        }); 
    }); 
}

function clearDisplay() {
    const clear = document.querySelector('.clear')
    const display = document.querySelector('.display');
    clear.addEventListener('click', (e) => {
        display.textContent = '0';
        displayValue = display.textContent;
        btnPressed = '';
        prevPressed = '';
    })
}

displayNumbers()
clearDisplay()