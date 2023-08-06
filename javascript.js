let input1, input2, operator, displayValue;
let btnPressed, prevPressed;
const display = document.querySelector('.display');

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

function operate(num1, num2, op) {
    switch (op) {
        case '+': return add(num1, num2);
        case '-': return subtract(num1, num2);
        case 'x': return multiply(num1, num2);
        case '/': return divide(num1, num2);
    }
}

function displayNumbers() {
    const buttons = document.querySelectorAll('.digit, .operator');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btnPressed = e.target.textContent
//TODO: Override display if the last key pressed was '='


//If the display is neutral (0) and the first button pressed is not an operator
//Update the display with the value of the button pressed
            if (display.textContent === '0' && operators.includes(btnPressed) === false) {
                display.textContent = e.target.textContent;
            }

//If the display is populated, add the input to the display
//But will not allow user to enter two operators in a row
            else if ((operators.includes(prevPressed) && operators.includes(btnPressed)) === false) {
                display.textContent += e.target.textContent;
                if (operators.includes(btnPressed)) {
                    operator = btnPressed
                }
            }
            displayValue = display.textContent;
            prevPressed = btnPressed    
        }); 
    }); 
}

function clearDisplay() {
    const clear = document.querySelector('.clear')
    clear.addEventListener('click', (e) => {
        display.textContent = '0';
        displayValue = display.textContent;
        btnPressed = '';
        prevPressed = '';
    })
}



function equals() {
    const equals = document.querySelector('.equals');
    equals.addEventListener('click', (e) => {
        if (!operators.includes(prevPressed) && displayValue.search(/[+\-x\/]/) != -1) {
            const numarray = displayValue.split(/[+\-x\/]/);
            display.textContent = operate(Number(numarray[0]), Number(numarray[1]), operator);
            displayValue = display.textContent;
        }
    })
}

displayNumbers()
clearDisplay()
equals()