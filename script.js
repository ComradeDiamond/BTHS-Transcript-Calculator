//Putting script here so people don't get a headache by looking at the HTML and CSS
function initialize() {
    inputSection = document.getElementById("inputSectionHTML");
    gradeSpan = document.getElementById("gradeSpanHTML");
    inputId = 0;
    finalNum = undefined;

    for(var i = 1; i <= 5; i++) {
        createEntity();
    }
}

function CreateElement(typeDOM, innerText, inputName, inputClass, inputType, inputMin, inputMax) {
    //Used for abstraction purposes, this abstracts the DOM Creation Method
    let tempSpan = document.createElement(typeDOM);
    tempSpan.innerHTML = innerText;

    let tempSpanInput = document.createElement("input");
    tempSpanInput.name = inputName;
    tempSpanInput.className = inputClass;
    tempSpanInput.type = inputType;

    if(inputMin != undefined) //Renders the inputMin and inputMax parms optional
    {
        tempSpanInput.min = inputMin;
    }
    if(inputMax != undefined) {
        tempSpanInput.max = inputMax;
    }

    tempSpan.appendChild(tempSpanInput);
    return tempSpan;
}

function createEntity() { //Creates a new bracket column for people to put grades in using DOM
    inputId += 1;
    let inputDiv = document.createElement("div");
    inputDiv.id = inputId; //We're going to use for loop and concat to get the grades later

    let classNameSpan = new CreateElement("span", "Class Name: ", "classNameHTML", "classNameCSS", "text");
    let gradeSpan = new CreateElement("span", "&emsp; Unweighed Grade: ", "gradeHTML", "gradeCSS", "number", 0, 100);
    let collegeSpan = new CreateElement("span", "&emsp; Is it AP/PLTW: ", "collegeHTML", "checkboxCSS", "checkbox");
    let creditSpan = new CreateElement("span", "&emsp; Credits: ", "creditNumHTML", "creditNumCSS", "number", 0);
    let crSpan = new CreateElement("span", "&emsp; CR? ", "crHTML", "checkboxCSS", "checkbox");

    inputDiv.appendChild(classNameSpan);
    inputDiv.appendChild(gradeSpan);
    inputDiv.appendChild(collegeSpan);
    inputDiv.appendChild(creditSpan);
    inputDiv.appendChild(crSpan);

    inputSection.appendChild(inputDiv);
}

function calcGrade() {
    //Calculates average

    let sumAverage = 0;
    let sumCredits = 0;

    for(var i = 1; i <= inputId; i++) {

        //Defines the stuff so we can reference it easier later
        let cObj = document.getElementById(i);
        let cObjClass = cObj.querySelector('input[name="classNameHTML"]').value;
        let cObjGrade = parseFloat(cObj.querySelector('input[name="gradeHTML"]').value);
        let cObjCollege = cObj.querySelector('input[name="collegeHTML"]');
        let cObjCredit = parseFloat(cObj.querySelector('input[name="creditNumHTML"]').value);
        let cObjCr = cObj.querySelector('input[name="crHTML"]');

        //If ClassName, Grade, and the Credits are not filled in, then skips over the loop.
        if((cObjClass == "") || (isNaN(cObjGrade)) || (isNaN(cObjCredit))) 
        {
            continue;
        }

        //If cred, do not calculate the thing
        if(cObjCr.checked) 
        {
            continue;
        }

        //Anti-substring exploiters
        if((cObjGrade < 0) || (cObjCredit < 0)) 
        {
            alert(`Aight mate we're gonna skip ${cObjClass} because you can't get negative grades or credits lmao`);
            continue;
        }

        //Multiplies the grade by 1.1 if it is AP/PLTW
        if(cObjCollege.checked) 
        {
            sumAverage += (cObjGrade * 1.1 * cObjCredit);
        } 
        else 
        {
            sumAverage += cObjGrade * cObjCredit;
        }

        //Adds the credits
        sumCredits += cObjCredit;
    }

    //Avoids putting a 0% average
    if(sumAverage == 0) 
    {
        alert("aight mate you know that you're either failing or didn't put anything in");
        return;
    }

    //Divide the total average by the credit number and puts it in the frontend
    finalNum = (sumAverage / sumCredits).toFixed(3);
    display(finalNum);
}

function display() { //Displays the grade!
    gradeSpanHTML.innerHTML = finalNum;
}

function crSpoof() { //Shows you which grades should be CRed

    //Unlocks CR Tool only after GPA is calculated
    if(finalNum == undefined) 
    {
        alert("You need to calculate GPA before you can run the CR Tool");
        return;
    }

    for(i = 1; i <= inputId; i++) {

        //Temporarily defines again
        trueGrade = 0;
        let cObj = document.getElementById(i);
        let cObjGrade = parseFloat(cObj.querySelector('input[name="gradeHTML"]').value);
        let cObjCollege = cObj.querySelector('input[name="collegeHTML"]');
        let cObjCr = cObj.querySelector('input[name="crHTML"]');

        //Ignore the items without a grade
        if(cObjGrade == NaN) 
        {
            continue;
        }

        //Calculates the weighed grade of the subject for accurate CR
        if(cObjCollege.checked) 
        {
            trueGrade = cObjGrade * 1.1;
        } 
        else 
        {
            trueGrade = cObjGrade;
        }

        /*If the true grade < the final average, it marks green if it sees that you have CRed the thing successfully. 
        It marks red if it sees you did not CR the thing and suggests you do so
        If it is not < than the final average, it leaves it alone*/

        if(document.body.querySelector(`input[name="conservativeEstimate"]`).checked) //If conservative estimate mode is on, it uses *+-3 points range
        {
            if(trueGrade < (finalNum - 3)) 
            {
                if(cObjCr.checked) 
                {
                    cObj.querySelector('input[name="gradeHTML"]').style.backgroundColor = "#55ff4f";
                } 
                else 
                {
                    cObj.querySelector('input[name="gradeHTML"]').style.backgroundColor = "#ed736b";
                }
            } 
            else 
            {
                cObj.querySelector('input[name="gradeHTML"]').style.backgroundColor = "initial";
            }
            continue;
        }

        if(trueGrade < finalNum) 
        {
            if(cObjCr.checked) 
            {
                cObj.querySelector('input[name="gradeHTML"]').style.backgroundColor = "#55ff4f";
            } 
            else 
            {
                cObj.querySelector('input[name="gradeHTML"]').style.backgroundColor = "#ed736b";
            }
        } 
        else 
        {
            cObj.querySelector('input[name="gradeHTML"]').style.backgroundColor = "initial";
        }
    }
}