//Завдання 1
let  a = 2
let b = 3

console.log(a+b);
console.log(a-b);
console.log(a*b);
console.log(a/b);

//Завдання 2

let firstName="Давид";
let lastName="Борщук";
let fullName=firstName+""+lastName;
console.log("Привіт,"+ fullName +"!"  );

//Завдання 3

let age = 18;
if (age >= 18) {
    console.log("Доступ дозволено");
}
else{
    console.log("Доступ заборонено")
}

//Завдання 4

for (let i = 0; i < 10; i++) {
    console.log(i);
}

//Завдання 5
function square(number){
    return number*number;
}

console.log("Квадрат числа 5:",square(5));

//Завдання 6

let fruits =["Яблуко","Банан","Апельсин"];
fruits.push("Груша");
console.log("Масив фруктів:",fruits);