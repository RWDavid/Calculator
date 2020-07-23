const expression = document.querySelector("#expression");
const history = document.querySelector("#history");

function digitPress(e)
{
    expression.textContent += e.target.textContent;
}

function operatorPress(e)
{
    if (expression.textContent === "")
        return;
    if (!expression.textContent.slice(-1).match(/[0-9.]/))
        return;
    expression.textContent += e.target.textContent;
}

function pointPress(e)
{
    let stringTerms = expression.textContent.split(/[+\-*÷]/);
    if (stringTerms[stringTerms.length - 1].includes("."))
        return;
    expression.textContent += ".";
}

function isValidTerm(term)
{
    if ((term.match(/./) || []).length > 1)
        return false;
    if (term === ".")
        return false;
    if (!term.match(/^[0-9.]*$/))
        return false;
    return true;
}

function evalExpr(expr)
{
    // extract numerical values between operators
    let stringTerms = expr.split(/[+\-*÷]/);

    // extract operators
    let operators = [];
    for (let i = 0; i < expr.length; ++i)
    {
        if (expr[i].match(/[+\-*÷]/))
            operators.push(expr[i]);
    }

    // ensure that there are numerical values between each operator
    if (stringTerms.length !== operators.length + 1)
        return "ERROR";

    // convert numerical values (currently strings) into actual Numbers
    let terms = [];
    for (term of stringTerms)
    {
        if (!isValidTerm(term))
            return "ERROR";
        terms.push(Number(term));
    }

    // pass through expression, performing multiplication and division
    let i = 0;
    while (i < operators.length)
    {
        if (operators[i] === "*" || operators[i] === "÷")
        {
            let result = operators[i] === "*" ? terms[i] * terms[i + 1] : terms[i] / terms[i + 1];
            operators.splice(i, 1);
            terms.splice(i, 2, result);
        }
        else
        {
            ++i;
        }
    }

    // pass through expression, performing addition and subtraction
    while (operators.length > 0)
    {
        let result = operators[0] === "+" ? terms[0] + terms[0 + 1] : terms[0] - terms[0 + 1];
        operators.splice(0, 1);
        terms.splice(0, 2, result);
    }

    return terms[0];
}

// assign event listeners
for (let i = 0; i <= 9; ++i)
{
    const btn = document.querySelector("#digit-" + i);
    btn.addEventListener("click", digitPress);
}
for (let op of ["add", "subtract", "multiply", "divide"])
{
    const btn = document.querySelector("#" + op);
    btn.addEventListener("click", operatorPress);
}
document.querySelector("#all-clear").addEventListener("click", e => {expression.textContent = ""; history.textContent = "";});
document.querySelector("#clear").addEventListener("click", e => expression.textContent = "");
document.querySelector("#delete").addEventListener("click", e => expression.textContent = expression.textContent.slice(0, -1));
document.querySelector("#point").addEventListener("click", pointPress);
document.querySelector("#equal").addEventListener("click", e => {
    history.textContent = expression.textContent;
    expression.textContent = evalExpr(expression.textContent);});