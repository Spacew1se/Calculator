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
const operators = [' + ', ' - ', ' * ', ' / ']
let prevPressed = null;
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
        operation.input1 = null;
        operation.input2 = null;
        operation.operator = null;
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
        case ' * ': return multiply(num1, num2);
        case ' / ': return divide(num1, num2);
    }
}

function updateDisplay(btnPressed) {
    if (errState) resetError();
    if (!displayTooLong()) {
        console.log('button input', btnPressed)
        if (!isNaN(btnPressed)) updateDigit(btnPressed);
        else if (operators.includes(btnPressed)) updateOperator(btnPressed);
        else if (btnPressed === ' = ') equals();
        else if (btnPressed === '.') updateDecimal();
        else if (btnPressed === 'CE') clearEntry();
        else if (btnPressed === 'C') clearAll();
        else if (btnPressed === 'DEL') backspace();
        prevPressed = btnPressed;
    }
}

function updateDigit(btnPressed) {
    if (display.textContent === '0' || (operation.operator && !operation.input2) || (previous.result && !operation.operator && prevPressed === ' = ')) {
        display.textContent = btnPressed;
    }
    else display.textContent += btnPressed;
    if (!operation.operator) {
        if (previous.result) equation.textContent = '';
        operation.input1 = display.textContent;
    }
    else operation.input2 = display.textContent;
    console.log("clicking digits", operation);
}

function updateDecimal() {
    console.log("before decimal", operation)
    if ((operation.input1 === '0' && !operation.operator) || (operation.operator && !operation.input2) || (previous.result && !operation.operator && prevPressed === ' = ')) {
        display.textContent = '0.';
    }
    else if (!display.textContent.includes('.')) {
        display.textContent += '.';
    }
    if(!operation.operator) {
        if (previous.result) equation.textContent = '';
        operation.input1 = display.textContent;
    } 
    else operation.input2 = display.textContent;
    console.log("after decimal", operation)
}

function updateOperator(btnPressed) {
    console.log("before operator", operation);
    console.log("prev operation before operator", previous);
    if (operation.input1 !== '0') {
        display.textContent = stripTrailingChars(display.textContent);
    }
    if (operation.input2) {
        operation.result = operate(Number(operation.input1), Number(operation.input2), operation.operator);
        display.textContent = operation.result;
        operation.input2 = null;
    }
    checkDisplayLength();
    operation.input1 = display.textContent;
    operation.operator = btnPressed;
     equation.textContent = operation.input1 + operation.operator;
    console.log("after operators", operation)
}

function clearEntry() {
    console.log('beforeCE', operation);
    display.textContent = '0'
    if (!operation.operator && !operation.input2) {
        console.log("In1, NoOp, NoIn2", operation, previous)
        clearDisplay()
    }
    else if (operation.input1 && operation.operator) {
        console.log("In1, YesOp", operation, previous)
        operation.input2 = '0';
    }
    else if (operation.input2) {
        console.log("YesIn2", operation, previous)
        operation.input2 = '0'
    }
    console.log('afterCE', operation);
}

function equals() {
    console.log('equation before =', operation)
    console.log('previous equation before =', previous)

    //When clear entry is pressed directly after equal
    if (operation.input1 === '0' && operation.operator && operation.input2) {
        operation.result = operate(Number(operation.input1), Number(operation.input2), operation.operator);
        equation.textContent = operation.input1 + operation.operator + operation.input2 + ' = ';
        display.textContent = operation.result;
        console.log("NoInput1 and YesOperator and YesInput2", operation)
    }

    //When equal is pressed when there is one input and no operator entered
    //The one input can either be the result of a previous operation
    //or entered by the user after a successful previous operation
    else if (!operation.operator && previous.input2) {
        operation.input1 = stripTrailingChars(operation.input1);
        operation.operator = previous.operator;
        operation.input2 = previous.input2
        operation.result = operate(Number(operation.input1), Number(operation.input2), operation.operator);
        equation.textContent = operation.input1 + operation.operator + operation.input2 + ' = ';
        display.textContent = operation.result;
        console.log("Input1 and NoOperator and PrevInput2", operation)
    }

    else if (!operation.operator) {

        if (!previous.input2) {
            display.textContent = stripTrailingChars(display.textContent);
            operation.input1 = display.textContent;
            operation.result = operation.input1;
            equation.textContent = operation.input1 + ' = ';
            console.log("No Operator, No Previous Input 2", operation)
        }

        else {
            operation.input1 = previous.result;
            operation.input2 = previous.input2;
            operation.operator = previous.operator;
            operation.result = operate(Number(operation.input1), Number(operation.input2), operation.operator);
            equation.textContent = operation.input1 + operation.operator + operation.input2 + ' = ';
            display.textContent = operation.result;
            console.log("No Operator, YesPrevResult and NoInput", operation)
        }
    }

    else if (!operation.input2) {
        operation.input2 = operation.input1;
        equation.textContent = operation.input1 + operation.operator + operation.input2 + ' = ';
        operation.result = operate(Number(operation.input1), Number(operation.input2), operation.operator);
        display.textContent = operation.result;
        console.log("input1, YesOp, NoInput2", operation)
    }

    else {
        operation.input2 = stripTrailingChars(operation.input2);
        equation.textContent = operation.input1 + operation.operator + operation.input2 + ' = ';
        operation.result = operate(Number(operation.input1), Number(operation.input2), operation.operator);
        display.textContent = operation.result;
        console.log("Else {Presumably in1 & op & in2", operation)
    }

    checkDisplayLength();
    console.log("equation after =", operation)
    saveHistory(operation);
    console.log('previous equation after =', previous)
}

function backspace() {
    console.log("before backspace", operation)
    if (display.textContent.length > 1 && (operation.input1 || operation.input2)) {
        display.textContent = display.textContent.slice(0, -1)
        if (operation.input1 && !operation.operator) {
            operation.input1 = display.textContent;
        }
        else if (operation.input2) {
            operation.input2 = display.textContent;
        }
    }
    else if (display.textContent.length === 1) {
        if (operation.input2) {
            display.textContent = '0';
            operation.input2 = display.textContent;
        }
        else if (operation.input1 && !operation.operator) {
            display.textContent = '0';
            operation.input1 = null;
        }
    }
    console.log("after backspace", operation)
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
    prevPressed = null;
}

function clearAll() {
    clearDisplay();
    clearPreviousOperation();
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
    return display.textContent.length >= 15
}

function checkDisplayLength() {
    if(displayTooLong() ) {
        display.textContent = Number.parseFloat(display.textContent).toExponential(10);
    }
    else {
        let rounded = Math.round((display.textContent) * 100000000) / 100000000;
        rounded = "" + rounded;
        rounded = rounded.replace(/[.]0+$/g, '')
    }
}

function addEventListeners() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            updateDisplay(e.target.textContent);
        });
    });

    window.addEventListener('keydown', (e) => {
        handleKeypress(e)
    });
}

function handleKeypress(keyEvent) {
    let btn;
    if (keyEvent.code === "NumpadEqual") {
        btn = document.querySelector(`button[data-altNumpad=${keyEvent.code}]`)
    }
    else if (keyEvent.location === 3) {
        btn = document.querySelector(`button[data-Numpad=${keyEvent.code}]`)
    }
    else if (keyEvent.shiftKey) {
        btn = document.querySelector(`button[data-key=shift${keyEvent.code}]`)
    }
    else if (keyEvent.code === "Enter") {
        btn = document.querySelector(`button[data-altKey=${keyEvent.code}]`)
    }
    else {
        btn = document.querySelector(`button[data-key=${keyEvent.code}]`);
    }
    if (btn) {
        keyEvent.preventDefault();
        updateDisplay(btn.textContent)
        console.log("pressing keyboard", operation)
    }
}
