//function其實是一個物件
function genObject(){
    return {
        name: 'peter',
        age:26,
    }
}

//給他一個方法(不要亂用，老師解釋才用的範例)
genObject.method01 = ()=>{
    console.log('method01')
}

//給這Function設定一個變數(參照)
const obj = genObject();


console.log(obj);
//{ name: 'peter', age: 26 }
genObject.method01();
//method01

//constructor.name -->看是什麼類型
console.log(genObject.constructor.name);
//Function

