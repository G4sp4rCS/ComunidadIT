const funcioneta = function (number){

    if(number>3){
    do{
        if (number==3) {
            console.log("el 2 es primo");
        } else {
            console.log("no hay numeros primos anteriores");
        }
        number--;
        if(number%2!==0 && number%3!== 0){
            console.log(`${number} es primo`);
        }
     } while(number > 3)
     console.log("el numero 2 es primo");
     console.log("el numero 3 es primo");
    }
}

funcioneta(22);