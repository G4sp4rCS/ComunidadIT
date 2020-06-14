const validarEmail=function(palabra)
{
    
    
    let retorno;
    let contadorArroba=0;
    let indexA;
    let indexP;
    let contadorPuntos=0;
    for(let i=0;i<palabra.length;i++)
    {
        if(palabra[i]=="@")
        {
            console.log(" entre");
            contadorArroba++;
            console.log("actualmente encontre: "+ contadorArroba );
        }
    }
    if(contadorArroba>1 || contadorArroba==0)
    {
        console.log("hay mas de una arroba, o no hay ninguna");
        retorno=-1;
    }else
    {
        indexA=palabra.indexOf("@");
        console.log("Este es el index del arroba: "+indexA);
        if(indexA<=1)
        {
            console.log("hay menos de 2 letras en el email");
            retorno=-1;
        }else
        {
            let largo=palabra.length;
            for(let i=0;i<indexA;i++)
            {
                let letra=palabra[i];
                console.log("Este es el caracter: "+ letra);
                if(letra==" " || letra==","||letra==";"||letra=='"'||letra=="'"||letra=="`"||letra==":"||
                    letra=="["||letra=="]"||letra=="{"||letra=="}"||letra=="="||letra=="+"||letra=="/"){
                    retorno=-1;
                    break;
                }else
                {
                    for(let i=indexA;i<largo;i++)
                    {
                
                        if(palabra[i]==".")
                        {
                            contadorPuntos++;
                        }
                    }
                    if(contadorPuntos<1)
                    {
                        retorno=-1;
                    }else
                    {
                        indexP=palabra.indexOf(".");
                        console.log("Este es el index del punto "+indexP);
                        console.log("Este es el largo " + largo);
                        if(indexA >= (indexP-3)|| largo <= (indexP+2))
                        {
                            retorno=-1;
                        }else
                        {
                            retorno=0;
                        }
                    }
                }
            }  
        }
    }
    return retorno;
}
let resultado=validarEmail("jeanluccasimala@hotmail.es");
console.log("retorno: "+resultado);
if(resultado==0)
{
    console.log("Es un email");

}else
{
    console.log("No es un email");
}
