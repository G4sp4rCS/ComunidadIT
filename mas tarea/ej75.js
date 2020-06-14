let num = 0;
let numDos = 1;
let contador = 0;
console.log(num);
while(contador <=10){
  let numTres = (num+numDos);
  numDos = num;
  num = numTres;
    console.log(numTres);
    contador++;
}