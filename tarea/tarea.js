const greet = "holawa soy un mapachee";
console.log(greet.indexOf(" "));
if(greet.length > 10){
    console.log("tiene mas de 10 letras");
}else{
    console.log("no tiene mas de 10 letras");
}
if(greet.length%2 == 0){
    console.log("es par");
}else{
    console.log("es impar")
}
console.log(greet.slice(0,4));
if(greet.toLowerCase() == greet){
    console.log("minus");
}
if(greet.toUpperCase() == greet){
    console.log("mayus");
}else{console.log("tiene ambas mayus y minus");}
console.log(greet.charAt(greet.length/2));
if(greet.charAt(greet.length/2)== "a" || "e" || "i" || "o" || "u"){
    console.log("es vocal");
}if(greet.charAt(greet.length/2)== " "){
    console.log("es un espacio");
}if(greet.charAt(greet.length/2)== "1" || "2" || "3" || "4" || "5" || "6" || "7" || "8" || "9"){
    console.log("es un numero")
}else{
    console.log("es consonante");
}
if(greet.indexOf("¿")>=0){
    console.log("es una pregunta");
}else{console.log("es una afirmacion");}
console.log(greet.replace("awa","uwu"));