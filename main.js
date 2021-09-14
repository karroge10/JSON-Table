// Получаем нужный файл data.json
fetch("data.json")
  .then(response => response.json())
  .then(json => buildTable(json));

let table = document.getElementById('myTable')
let limit = 10;
let start = 0;
let tableData;

// Создаем таблицу с данными из файла data.json
function buildTable(data){
    tableData = data
    for (let i = start; i < limit; i++){
        let row =   `<tr class="myBtn" onclick="openModal(this)">
                        <td class="firstNameColumn">${data[i].name.firstName}</td>
                        <td class="lastNameColumn">${data[i].name.lastName}</td>
                        <td class="aboutColumn">${data[i].about}</td>
                        <td class="eyeColorColumn" style="background-color: ${data[i].eyeColor}">${data[i].eyeColor}</td>
                    </tr>`
        table.innerHTML += row;
    }
}

// Получаем модальное окно
let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];

// Когда пользователь нажимает на строчку, открыть модальное окно
openModal = (elem) => {
    rIndex = elem.rowIndex - 1
    modal.style.display = "block";
    document.getElementById('fname').value = elem.cells[0].innerHTML
    document.getElementById('lname').value = elem.cells[1].innerHTML
    document.getElementById('about').value = elem.cells[2].innerHTML
    document.getElementById('color').value = elem.cells[3].innerHTML
}

// Когда пользователь нажимает Изменить строку, обновляем значения на введенные и закрываем модальное окно
editRow = () => {
    table.rows[rIndex].cells[0].innerHTML = document.getElementById('fname').value
    table.rows[rIndex].cells[1].innerHTML = document.getElementById('lname').value
    table.rows[rIndex].cells[2].innerHTML = document.getElementById('about').value
    table.rows[rIndex].cells[3].innerHTML = document.getElementById('color').value

    let page = parseInt(document.getElementsByClassName('pageNumber')[0].innerHTML)
    tableData[rIndex + (10 * (page - 1))].name.firstName = table.rows[rIndex].cells[0].innerHTML
    tableData[rIndex + (10 * (page - 1))].name.lastName = table.rows[rIndex].cells[1].innerHTML
    tableData[rIndex + (10 * (page - 1))].about = table.rows[rIndex].cells[2].innerHTML
    tableData[rIndex + (10 * (page - 1))].eyeColor = table.rows[rIndex].cells[3].innerHTML
    modal.style.display = "none";
}

// Когда пользователь нажимает на  x, закрыть модальное окно
span.onclick = function() {
  modal.style.display = "none";
}

// Когда пользователь нажимает вне модального окна, закрыть модальное окно
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Если пользователь нажал на кнопку Previous то убавляем номер страницы на 1, если Next то прибавляем 1
// Заменяем строки на следующие / прошлые 10 строк.
changePage = (number) => {
    let page = parseInt(document.getElementsByClassName('pageNumber')[0].innerHTML)

    if (number > 0 && page < 5){
        table.replaceChildren()
        limit += 10;
        start += 10;
        document.getElementsByClassName('pageNumber')[0].innerHTML = page + 1;
    
        // Перестраиваем таблицу с новыми 10 страницами
        buildTable(tableData)

        let visionButton = document.getElementsByClassName('visButton')
        let visParam;

        // Проверяем у какой колонки в хедере есть show (значит что на прошлых 10 страницах эта колонка была спрятана), и прячем ее еще раз
        for (let i = 0; i < visionButton.length; i++) {
            if (visionButton[i].innerHTML === 'show'){
                visParam = visionButton[i].parentElement.dataset.sort
                hideColumns(visParam)
            }
        }

    } else if (number < 0 && page > 1){
        table.replaceChildren()
        limit -= 10;
        start -= 10;
        document.getElementsByClassName('pageNumber')[0].innerHTML -= 1;
        
        buildTable(tableData)

        let visionButton = document.getElementsByClassName('visButton')
        let visParam;

        for (let i = 0; i < visionButton.length; i++) {
            if (visionButton[i].innerHTML === 'show'){
                visParam = visionButton[i].parentElement.dataset.sort
                hideColumns(visParam)
            }
        }
    }
}

// Сортируем колонку по нужному параметру, добавляем активный класс для отображения текущей сортировки
// При повторном нажатии сортировка идет в обратную сторону
sort = (param) => {
    let sortParameter = param.parentElement.dataset.sort
    if (sortParameter === 'firstName' || sortParameter === 'lastName') {
        if (param.classList.contains('inc')){
            tableData.sort((a, b) => b.name[sortParameter].localeCompare(a.name[sortParameter]));
            param.classList.remove('inc')
        } else{
            tableData.sort((a, b) => a.name[sortParameter].localeCompare(b.name[sortParameter]));
            param.classList.add('inc')
        }
    } else{
        if (param.classList.contains('inc')){
            tableData.sort((a, b) => b[sortParameter].localeCompare(a[sortParameter]));
            param.classList.remove('inc')
        } else{
            tableData.sort((a, b) => a[sortParameter].localeCompare(b[sortParameter]));
            param.classList.add('inc')
        }
    }

    let sortButtons = document.querySelectorAll('.headerButton')
    sortButtons.forEach(button => {
        button.classList.remove('active')
    });
    
    param.classList.add('active')

    // Возвращает на первую страницу с сортировкой
    table.replaceChildren()
    limit = 10
    start = 0
    document.getElementsByClassName('pageNumber')[0].innerHTML = 1
    let headerButton = document.getElementsByClassName('visButton')
    for (let i = 0; i < headerButton.length; i++){
        headerButton[i].innerHTML = 'hide'
    }

    buildTable(tableData)
}


changeVisibility = (param) => {
    let column = document.getElementsByClassName(param.parentElement.dataset.sort + 'Column')
    checkVisibility(param, column)
}

hideColumns = (param) => {
    let column = document.getElementsByClassName(param + 'Column')
    checkVisibility(0, column)
}

checkVisibility = (param, column) => {
    for (let i = 0; i < column.length; i++){
        if (column[i].classList.contains('hideText')){    
            column[i].classList.remove('hideText')
            param.innerHTML = 'hide'
        } else{
            column[i].classList.add('hideText')
            param.innerHTML = 'show'
        }
    }
}