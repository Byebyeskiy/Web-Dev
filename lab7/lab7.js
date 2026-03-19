
// Завдання 1


// Завдання 2

var a = 2;
var x = 1 + (a *= 2);
console.log("x =", x); // 5

if ("0") {
    alert("Привіт"); // з'явиться, бо "0" це істинне значення
}

let admin;
let name = "Василь";
admin = name;

console.log("admin =", admin);


// Завдання 3 (API)

async function getCounties() {
    const res = await fetch("https://api.census.gov/data/2020/acs/acs5/profile?get=NAME&for=county:*");
    const data = await res.json();

    return data.slice(1).map(i => ({
        name: i[0],
        state: i[1],
        county: i[2],
        code: i[1] + i[2]
    }));
}

function findCountyCode(arr, name) {
    const found = arr.find(x => x.name.toLowerCase() === name.toLowerCase());
    return found ? found.code : "Не знайдено";
}


// Завдання 3 (UI)

document.addEventListener("DOMContentLoaded", () => {

    const input = document.createElement("input");
    input.placeholder = "Baldwin County, Alabama";

    const btn = document.createElement("button");
    btn.innerText = "Знайти код";

    const result = document.createElement("div");

    document.body.append(input, btn, result);

    btn.onclick = async () => {
        const val = input.value.trim();
        if (!val) {
            result.innerText = "Введи назву";
            return;
        }

        const data = await getCounties();
        const code = findCountyCode(data, val);

        result.innerText = "Код: " + code;
        console.log(code);
    };


    // Завдання 4 (форма)

    const form = document.createElement("form");

    const first = document.createElement("input");
    first.placeholder = "Ім'я";

    const last = document.createElement("input");
    last.placeholder = "Прізвище";

    const email = document.createElement("input");
    email.placeholder = "Email";

    const submit = document.createElement("button");
    submit.innerText = "Відправити";
    submit.type = "submit";

    form.append(first, last, email, submit);
    document.body.append(form);

    form.onsubmit = function(e) {
        if (!first.value.trim() || !last.value.trim() || !email.value.trim()) {
            e.preventDefault();
            alert("Заповніть всі поля");
            return;
        }

        e.preventDefault();
        alert(`Ім'я: ${first.value}\nПрізвище: ${last.value}\nEmail: ${email.value}`);
    };

    // Завдання 5 (анімація)
    const leftBtn = document.createElement("button");
    leftBtn.innerText = "Вліво";

    const rightBtn = document.createElement("button");
    rightBtn.innerText = "Вправо";

    const area = document.createElement("div");
    area.style.width = "500px";
    area.style.height = "120px";
    area.style.border = "1px solid black";
    area.style.position = "relative";
    area.style.marginTop = "20px";

    const box = document.createElement("div");
    box.style.width = "100px";
    box.style.height = "100px";
    box.style.background = "blue";
    box.style.position = "absolute";
    box.style.left = "0px";
    box.style.top = "10px";
    box.style.transition = "left 0.4s";

    area.appendChild(box);
    document.body.append(leftBtn, rightBtn, area);

    let pos = 0;

    rightBtn.onclick = () => {
        pos += 100;
        if (pos > 400) pos = 400;
        box.style.left = pos + "px";
    };

    leftBtn.onclick = () => {
        pos -= 100;
        if (pos < 0) pos = 0;
        box.style.left = pos + "px";
    };

});