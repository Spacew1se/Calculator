//
//Define global objects and variables
//
const operation = {
    input1: '0',
    input2: null,
    operator: null,
    result: null,
};

const previous = {
    input1: null,
    input2: null,
    operator: null,
    result: null,
}

const display = document.querySelector('.display');
const equation = document.querySelector('.eqndisplay');
let equalsPressedLast = false;
let errState = false;

//
//Call function that will add event listeners
//
addEventListeners();


//
//Function definitions
//
function add(num1, num2) {
    return "" + (num1 + num2);
}

function subtract(num1, num2) {
    return "" + (num1 - num2);
}

function multiply(num1, num2) {
    let rounded = Math.round((num1 * num2) * 10000000) / 10000000;
    rounded = "" + rounded;
    rounded = rounded.replace(/[.]0+$/g, '')
    return rounded;
}

function divide(num1, num2) {
    if (num2 == 0) {
        const errormsg = "NOPE"
        equation.textContent = "Try again later."
        errState = true;
        return errormsg;
    }
    let rounded = Math.round((num1 / num2) * 10000000) / 10000000;
    rounded = "" + rounded;
    rounded = rounded.replace(/[.]0+$/g, '')
    return rounded;
}

function operate(num1, num2, op) {
    switch (op) {
        case ' + ': return add(num1, num2);
        case ' - ': return subtract(num1, num2);
        case ' × ': return multiply(num1, num2);
        case ' ÷ ': return divide(num1, num2);
    }
}

function updateDisplay(btn) {
    const btnPressed = btn.textContent;
    if (btn.classList.contains('digit')) handleDigit(btnPressed);
    else if (btn.classList.contains('operator')) handleOperator(btnPressed);
    else if (btn.classList.contains('equals')) handleEquals();
    else if (btn.classList.contains('decimal')) handleDecimal();
    else if (btn.classList.contains('clearEntry')) clearEntry();
    else if (btn.classList.contains('clear')) clearAll();
    else if (btn.classList.contains('backspace')) backspace();
    else if (btn.classList.contains('negate')) negate();
}

function handleDigit(btnPressed) {
    if (errState) resetError();
    if (display.textContent === '0' || (operation.operator && !operation.input2) || (!operation.operator && equalsPressedLast)) {
        display.textContent = btnPressed;
    }
    else {
        if (!displayTooLong()) display.textContent += btnPressed;
    } 
    if (!operation.operator) {
        if (previous.result) equation.textContent = '';
        operation.input1 = display.textContent;
    }
    else operation.input2 = display.textContent;
    equalsPressedLast = false;
}

function handleDecimal() {
    if (!errState) {
        if ((operation.operator && !operation.input2) || (!operation.operator && equalsPressedLast)) {
            display.textContent = '0.';
        }
        else if (!display.textContent.includes('.')) {
            if (!displayTooLong()) display.textContent += '.';
        }
        if (!operation.operator) {
            if (previous.result) equation.textContent = '';
            operation.input1 = display.textContent;
        }
        else operation.input2 = display.textContent;
        equalsPressedLast = false;
    }
}

function handleOperator(btnPressed) {
    if(!errState) {
        display.textContent = stripTrailingChars(display.textContent);
        equalsPressedLast = false
        if (operation.input2) {
            operation.result = operate(Number(operation.input1), Number(operation.input2), operation.operator);
            equalsPressedLast = true;
            display.textContent = operation.result;
            operation.input2 = null;
        }
        operation.input1 = display.textContent;
        operation.operator = btnPressed;
        equation.textContent = operation.input1 + operation.operator;
        checkDisplayLength();
    }
}
    
function clearEntry() {
    if (errState) resetError();
    else {
        display.textContent = '0';
        if (!operation.operator) {
            clearDisplay()
        }
        else if (operation.operator || operation.input2) {
            operation.input2 = '0';
        }
    }
}

function handleEquals() {
    if(errState) resetError();

    else {
        //Any time we have two inputs and one operator
        if (operation.operator && operation.input2) {
            operation.input2 = stripTrailingChars(operation.input2);
            operation.result = operate(Number(operation.input1), Number(operation.input2), operation.operator);
            if (!errState) {
                equation.textContent = operation.input1 + operation.operator + operation.input2 + ' = ';
            }
        }

        //When equal is pressed when there is one input and no operator entered
        //The one input can be the result of a previous operation, user entered, or default '0'
        else if (!operation.operator) {
            operation.input1 = stripTrailingChars(operation.input1);
            if (previous.input2) {
                operation.operator = previous.operator;
                operation.input2 = previous.input2;
                operation.result = operate(Number(operation.input1), Number(operation.input2), operation.operator);
                equation.textContent = operation.input1 + operation.operator + operation.input2 + ' = ';
            }
            else {
                operation.result = operation.input1;
                equation.textContent = operation.input1 + ' = ';
            }
        }

        //When there is an operator but no second input
        else if (!operation.input2) {
            operation.input2 = operation.input1;
            equation.textContent = operation.input1 + operation.operator + operation.input2 + ' = ';
            operation.result = operate(Number(operation.input1), Number(operation.input2), operation.operator);
        }
        display.textContent = operation.result;
        saveHistory(operation);
    }
    
    equalsPressedLast = true;
    checkDisplayLength();
}

function negate() {
    if(!errState) {
        if (Number(display.textContent) !== 0 && !displayTooLong()) {
            display.textContent = display.textContent.startsWith('-') ? display.textContent.slice(1) : '-' + display.textContent;
        }
        if (!operation.operator) {
            if (!previous.input2 && previous.result) {
                equation.textContent = display.textContent.startsWith('-') ? 'negate(' + display.textContent.slice(1) + ') = ' : display.textContent + ' = '
            }
            operation.input1 = display.textContent;
        }
        else operation.input2 = display.textContent;
    }
}

function backspace() {
    if(errState) resetError();
    else {
        if (equalsPressedLast) {
            if (!operation.result) equation.textContent = '';
        } 

        else {
            equalsPressedLast = false;
            if (display.textContent.length > 1) display.textContent = display.textContent.slice(0, -1);
            else if (display.textContent.length === 1) display.textContent = '0';

            if (!operation.operator) operation.input1 = display.textContent;
            else if (operation.input2) operation.input2 = display.textContent;
        }
    } 
}

function clearDisplay() {
    display.textContent = '0';
    equation.textContent = '';
    clearOperation()
    resetInput1();
}

function resetInput1() {
    operation.input1 = '0';
}

function clearOperation() {
    operation.input2 = null;
    operation.operator = null;
    operation.result = null;
}

function clearPreviousOperation() {
    previous.input1 = null;
    previous.input2 = null;
    previous.operator = null;
    previous.result = null;
    equalsPressedLast = false;
}

function clearAll() {
    if (errState) resetError();
    else {
        clearDisplay();
        clearPreviousOperation();
    }
}
    
function saveHistory(op) {
    previous.input1 = op.input1;
    previous.input2 = op.input2;
    previous.operator = op.operator;
    previous.result = errState === true ? null : op.result;
    operation.input1 = previous.result
    clearOperation()
}

function resetError() {
    clearDisplay();
    clearPreviousOperation();
    errState = false;
}

function stripTrailingChars(numberString) {
    return numberString.replace(/(^-?\d+\.\d*[1-9])(0+$)|(\.0+$)|(\.$)/g, "$1");
}

function displayTooLong() {
    return (display.offsetWidth + 16) >= display.parentElement.offsetWidth
}

function checkDisplayLength() {
    if(displayTooLong()) {
        display.textContent = Number.parseFloat(display.textContent).toExponential(7);
    }
    else {
        let rounded = Math.round((display.textContent) * 10000000) / 10000000;
        rounded = "" + rounded;
        rounded = rounded.replace(/[.]0+$/g, '')
    }
}

function addEventListeners() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            updateDisplay(btn);
        });
    });

    window.addEventListener('keydown', (e) => {
        handleKeypress(e);
    });
}

function handleKeypress(keyEvent) {
    let btn;
    if (keyEvent.code === "NumpadEqual") btn = document.querySelector(`button[data-altNumpad=${keyEvent.code}]`);
    else if (keyEvent.location === 3) btn = document.querySelector(`button[data-Numpad=${keyEvent.code}]`);
    else if (keyEvent.shiftKey) btn = document.querySelector(`button[data-key=shift${keyEvent.code}]`);
    else if (keyEvent.code === "Enter") btn = document.querySelector(`button[data-altKey=${keyEvent.code}]`);
    else btn = document.querySelector(`button[data-key=${keyEvent.code}]`);
    if (btn) {
        keyEvent.preventDefault();
        updateDisplay(btn);
    }
}
