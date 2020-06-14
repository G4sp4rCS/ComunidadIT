const form = document.getElementById("form");
const input = document.getElementById("text");
const container = document.getElementById("container");
const inputNumber = document.getElementById("number");
function getPeople(nombre,Edad) {
    const ajaxRequest = new XMLHttpRequest();
    ajaxRequest.addEventListener("load", function () {
        if (this.status === 200) {
            const data = JSON.parse(this.responseText);
            lista(data);
            console.log(data);
        }

    })
    ajaxRequest.open("GET", `/info?nombre=${nombre}&Edad=${Edad}`);
    ajaxRequest.send();
}

form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    getPeople(input.value,inputNumber.value);
})
function lista(people) {
    container.innerHTML = "";
    const newUL = document.createElement("ul");
    for (let i = 0; i < people.length; i++) {
        let person = people[i];
        const newLI = document.createElement("li");
        newLI.innerText = `${person.nombre}, ${person.Edad} años`;
        newUL.appendChild(newLI);
    }
    container.appendChild(newUL);
    console.log(newUL);

}