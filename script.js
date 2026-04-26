const inp_box = document.getElementById("input_box");
const add_button = document.getElementById("add_button");
const new_list = document.getElementById("new_list");
const remove_completed = document.getElementById("remove_completed");

const MAINLIST = document.getElementById("list");

const quickMenu = document.createElement("div");
quickMenu.id = "DropDownMenu";

let list = [
    {id:0, text:"Start Working With ToDo Stuff!", done: false}
];

for (let button of ["Cut","Copy","Paste","Delete","Edit","Move Up","Move Down"]) {
    const element = document.createElement("button");
    element.className = "DropDownButton";
    element.textContent = button;

    quickMenu.appendChild(element);
}

document.body.append(quickMenu);

function render() {
    MAINLIST.innerHTML = "";

    list.forEach(element => {
        const label = document.createElement("label");
        label.className = "Element";
        label.textContent = element.text;

        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = element.done;
        label.style.textDecoration = input.checked ? "line-through":"none";

        label.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            quickMenu.style.display = "flex";
            quickMenu.style.left = e.pageX + "px";
            quickMenu.style.top = e.pageY + "px";
            quickMenu.currentItem = element;
        });

        input.addEventListener("change", () =>{
            element.done = input.checked;
            label.style.textDecoration = input.checked ? "line-through":"none";
            save();
        })

        label.appendChild(input);
        MAINLIST.appendChild(label);
    });
    save();
}

function addElement(value) {
    list.push({id:list.length, text:value, done:false});
    render();
}

function acceptInput() {
    if (inp_box.value.trim()){
        addElement(inp_box.value.trim());
        inp_box.value = "";
    }
}

add_button.onclick = () => {
    acceptInput();
}

inp_box.onkeydown = (e) => {
    if (e.key === "Enter") {
        acceptInput();
    }
}

remove_completed.onclick = () => {
    list = list.filter( i => !i.done);
    render();
}

new_list.onclick = () => {
    list = [
    {id:0, text:"Start Working With ToDo Stuff!", done: false}
];
    render();
}

quickMenu.addEventListener("click", (e) => {
    const action = e.target.textContent;
    console.log(action)
    const item = quickMenu.currentItem;

    if (!item) return;
    
    const index = list.indexOf(item);

    switch (action) {
        case "Delete":
            list.splice(index, 1);
            break;
        case "Cut":
            navigator.clipboard?.writeText(item.text);
            list.splice(index, 1);
            break
        case "Copy":
            navigator.clipboard?.writeText(item.text);
            break
        case "Paste":
            navigator.clipboard.readText().then(text => {
                if (text) {addElement(text);}
            });
            break;
        case "Move Up":
            if (index > 0) {
                [list[index], list[index-1]] = [list[index-1], list[index]];
            }
            break;
        case "Move Down":
            if (index < list.length - 1) {
                [list[index], list[index+1]] = [list[index+1], list[index]];
            }
            break;
        case "Edit":
            const new_text = prompt("New Text:",item.text);
            if (new_text) item.text = new_text;
    }

    quickMenu.style.display = "none";
    render();
})

document.addEventListener("click", (e) => {
    if (!quickMenu.contains(e.target)) {
        quickMenu.style.display = "none";
    }
})
function save() {
    localStorage.setItem("todos", JSON.stringify(list));
}

function load() {
    const data = localStorage.getItem("todos");
    if (data) list = JSON.parse(data);
}

load();
render();