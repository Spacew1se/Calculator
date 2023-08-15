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
    let rounded = Math.round((num1 * num2) * 1000000) / 1000000;
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
        return errormsg;
    }

    let rounded = Math.round((num1 / num2) * 1000000) / 1000000;
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
                if (!operation.input1) {
                    if (btnPressed !== '0') {
                        display.textContent = btnPressed;
                        operation.input1 = display.textContent;
                    } 
                }         
                else if (!operation.operator) {
                    display.textContent += btnPressed;
                    operation.input1 = display.textContent;
                }
                else if (!operation.input2) {
                        display.textContent = btnPressed;
                        operation.input2 = display.textContent;
                    }
                else {
                    if (btnPressed !== '0') {
                        display.textContent += btnPressed;
                    }  
                    operation.input2 = display.textContent;
                }
        }); 
    }); 
}

function decimalButton() {
    const decbtn = document.querySelector('.decimal');
    decbtn.addEventListener('click', (e) => {
        if (!operation.input1) {
            display.textContent = '0.';
            operation.input1 = display.textContent;
            equation.textContent = '';
        }
        if (display.textContent.includes('.')) {
            if (operation.input1 && operation.operator && !operation.input2) {
                display.textContent = '0.';
                operation.input2 = display.textContent;
            }  
        }
        else {
            display.textContent += e.target.textContent;
        }        
    });
}

function opButtons() {
    const opButtons = document.querySelectorAll('.operator');
    opButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (operation.input2) {
                display.textContent = operate(Number(operation.input1), Number(operation.input2), operation.operator);    
                operation.input2 = null;
            }
            if (operation.input1) {
                display.textContent = display.textContent.replace(/(^-?\d+\.\d*[1-9])(0+$)|(\.0+$)|(\.$)/g, "$1");
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
        if (!operation.operator) {
            display.textContent = display.textContent.replace(/(^-?\d+\.\d*[1-9])(0+$)|(\.0+$)|(\.$)/g, "$1");
            operation.input1 = display.textContent;
            equation.textContent = operation.input1 + e.target.textContent;
        }
        else if (!operation.input2) {
            console.log(operation)
            equation.textContent = operation.input1 + operation.operator + operation.input1 + e.target.textContent;
            display.textContent = operate(Number(operation.input1), Number(operation.input1), operation.operator);
        }
        else {
            console.log(operation)
            operation.input2 = operation.input2.replace(/(^-?\d+\.\d*[1-9])(0+$)|(\.0+$)/g, "$1");
            equation.textContent = operation.input1 + operation.operator + operation.input2 + e.target.textContent;
            display.textContent = operate(Number(operation.input1), Number(operation.input2), operation.operator);
        }
        operation.input1 = null;
        operation.input2 = null;
        operation.operator = null;
    });
}

//Fix backspace to properly use prevoperator
function backspace() {
    const del = document.querySelector('.backspace');
    del.addEventListener('click', (e) => {
        if (display.textContent.length > 1 && (operation.input1 || operation.input2)) {
            display.textContent = display.textContent.slice(0, -1)
        }
    })
}

backspace()
displayNumbers()
decimalButton()
opButtons()
clearDisplay()
equals()