function changeTextContent(elementID, newText) {

    let test = document.getElementById(elementID);
    test.innerHTML = newText;

    console.log(test)

}


let clickPlease = document.querySelector("button")

clickPlease.addEventListener("click", () => changeTextContent("heading", "New Title"))

//[[ () => ]] call back function // anonomyous function
// () is a hold or wait
