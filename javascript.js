const display = document.querySelector('.display');
const equation = document.querySelector('.eqndisplay');

const operation = {
    input1: null,
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

let errState = false;

window.addEventListener('keydown', (e) => {
    handleKeypress(e)
});

function add(num1, num2) {
    return "" + (num1 + num2);
}

function subtract(num1, num2) {
    return "" + (num1 - num2);
}

function multiply(num1, num2) {
    let rounded = Math.round((num1 * num2) * 100000000) / 100000000;
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
    let rounded = Math.round((num1 / num2) * 1000000000) / 1000000000;
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

function displayNumbers() {
    const buttons = document.querySelectorAll('.digit');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnPressed = e.target.textContent
            if (errState) {
                resetError();
            }
            if (!displayTooLong()) {
                if (!operation.input1 || (operation.input1 === '0' && display.textContent === '0' && previous.result !== '0')) {
                    display.textContent = btnPressed;
                    operation.input1 = display.textContent;
                    equation.textContent = '';
                }
                else if (!operation.operator) {
                    display.textContent += btnPressed;
                    operation.input1 = display.textContent;
                }
                else if (!operation.input2 || (operation.input2 === '0' && display.textContent === '0')) {
                    display.textContent = btnPressed;
                    operation.input2 = display.textContent;
                }
                else {
                    display.textContent += btnPressed;
                    operation.input2 = display.textContent;
                }
            } 
            console.log("pressing digits", operation)
        }); 
    }); 
}

function decimalButton() {
    const decbtn = document.querySelector('.decimal');
    decbtn.addEventListener('click', (e) => {
        console.log("before decimal", operation)
        if (errState) {
            resetError();
        } 
        if (!operation.input1) {
            display.textContent = '0.';
            operation.input1 = display.textContent;
            equation.textContent = '';
        }
        else if (operation.input1 && operation.operator && !operation.input2) {
            display.textContent = '0.';
            operation.input2 = display.textContent;
        }
        else if (!display.textContent.includes('.')) {
            display.textContent += e.target.textContent;
        } 
        console.log("after decimal", operation)        
    });
}

function opButtons() {
    const opButtons = document.querySelectorAll('.operator');
    opButtons.forEach(btn => {
        
        btn.addEventListener('click', (e) => {
            console.log("before op", operation);
            console.log("prev op before op", previous);

            if (!errState) {
                if (operation.input1) {
                    display.textContent = display.textContent.replace(/(^-?\d+\.\d*[1-9])(0+$)|(\.0+$)|(\.$)/g, "$1");
                }
                if (operation.input2) {
                    operation.result = operate(Number(operation.input1), Number(operation.input2), operation.operator);
                    display.textContent = operation.result;
                    operation.input2 = null;
                    
                }
                checkDisplayLength();
                operation.input1 = display.textContent;
                operation.operator = e.target.textContent;
                equation.textContent = operation.input1 + operation.operator;
                console.log("after operators", operation)
            }
        });
    });
}

function clearEntryButton() {
    const ce = document.querySelector('.clearEntry');
    ce.addEventListener('click', (e) => {
        if (operation.input1 && !operation.operator && !operation.input2) {
            clearDisplay()
        }
        else if (previous.result && !operation.input1) {
            clearDisplay()
            operation.input1 = '0'
            operation.input2 = previous.input2;
            operation.operator = previous.operator;
        }
        else if ((operation.input1 && operation.operator && !operation.input2) || operation.input2) {
            operation.input2 = '0';
            display.textContent = operation.input2
        }
        console.dir(operation);
    })
}

function clearButton() {
    const clear = document.querySelector('.clear')
    clear.addEventListener('click', (e) => {
        clearDisplay();
        clearPreviousOperation();
    });
}

function equals() {
    const equals = document.querySelector('.equals');
    equals.addEventListener('click', (e) => {
      
        console.log('preeq', operation)
        console.log('preveq', previous)
        if (!operation.input1 && !previous.input2) {
            if(errState) {
                resetError()
            }
            else {
                operation.input1 = display.textContent;
                operation.operator = e.target.textContent;
                operation.result = operation.input1;
                equation.textContent = operation.input1 + operation.operator;
                console.log("NoInput1 & NoPrev2", operation)
            }  
        }
        else if (!operation.operator) {
            if (!previous.result || operation.input1) {
                display.textContent = display.textContent.replace(/(^-?\d+\.\d*[1-9])(0+$)|(\.0+$)|(\.$)/g, "$1");
                operation.input1 = display.textContent;
                equation.textContent = operation.input1 + e.target.textContent;
                console.log("NoOp, NoPrevRes OR NoOp, YesInput1", operation)
            }
            else {
                operation.input1 = previous.result;
                operation.input2 = previous.input2;
                operation.operator = previous.operator;
                operation.result = operate(Number(operation.input1), Number(operation.input2), operation.operator);
                equation.textContent = operation.input1 + operation.operator + operation.input2 + e.target.textContent;
                display.textContent = operation.result;
            }   
        }
        else if (!operation.input2) {
            operation.input2 = operation.input1;
            equation.textContent = operation.input1 + operation.operator + operation.input2 + e.target.textContent;
            operation.result = operate(Number(operation.input1), Number(operation.input2), operation.operator);
            display.textContent = operation.result;
        }
        else {
            operation.input2 = operation.input2.replace(/(^-?\d+\.\d*[1-9])(0+$)|(\.0+$)/g, "$1");
            equation.textContent = operation.input1 + operation.operator + operation.input2 + e.target.textContent;
            operation.result = operate(Number(operation.input1), Number(operation.input2), operation.operator);
            display.textContent = operation.result;    
        }
        checkDisplayLength()
        console.log("post=", operation)
        saveHistory(operation);
        console.log("postSave", operation)
    });
}

function backspace() {
    const del = document.querySelector('.backspace');
    del.addEventListener('click', (e) => {
        console.log("before backspace", operation)
        if (display.textContent.length > 1 && (operation.input1 ||operation.input2)) {
            display.textContent = display.textContent.slice(0, -1)
            if (operation.input1 && !operation.operator) {
                operation.input1 = display.textContent;
            }
            else if (operation.input2) {
                operation.input2 = display.textContent;
            }            
        }
        else if (display.textContent.length === 1) {
            if(operation.input2) {
                display.textContent = '0';
                operation.input2 = display.textContent;
            }
            else if(operation.input1 && !operation.operator) {
                display.textContent = '0';
                operation.input1 = null;
            }
        }
        console.log("after backspace", operation)
    })
}

function clearDisplay() {
    display.textContent = '0';
    equation.textContent = '';
    clearOperation();
}

function clearOperation() {
    operation.input1 = null;
    operation.input2 = null;
    operation.operator = null;
    operation.result = null;
}

function clearPreviousOperation() {
    previous.input1 = null;
    previous.input2 = null;
    previous.operator = null;
    previous.result = null;
}

function saveHistory(op) {
    previous.input1 = op.input1;
    previous.input2 = op.input2;
    previous.operator = op.operator;
    previous.result = errState === true ? null : op.result;
    clearOperation()
}

function resetError() {
        clearDisplay();
        clearPreviousOperation();
        errState = false;
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
        btn.click();
    }
    btn = null;
}

function displayTooLong() {
    const displayContainer = document.querySelector('.displaycontainer');
    return display.offsetWidth >= displayContainer.offsetWidth 
}

//fix rounding// exponentiation
// maybe check less than 1
// or digit
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

clearEntryButton()
backspace()
displayNumbers()
decimalButton()
opButtons()
clearButton()
equals()