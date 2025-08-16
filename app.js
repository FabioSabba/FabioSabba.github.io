// Dati principali
let people = [];
let cars = [];

// Funzioni persistenza
function saveData() {
    localStorage.setItem('people', JSON.stringify(people));
    localStorage.setItem('cars', JSON.stringify(cars));
}

function loadData() {
    const p = localStorage.getItem('people');
    const c = localStorage.getItem('cars');
    people = p ? JSON.parse(p) : [];
    cars = c ? JSON.parse(c) : [];
}

// Elementi DOM
const addPersonForm = document.getElementById('addPersonForm');
const personNameInput = document.getElementById('personName');
const peopleList = document.getElementById('peopleList');
const carOwnerSelect = document.getElementById('carOwner');
const carSeatsInput = document.getElementById('carSeats');
const addCarForm = document.getElementById('addCarForm');
carsList = document.getElementById('carsList');
const carsOrganization = document.getElementById('carsOrganization');

// Funzioni di rendering
function getAssignedPeople() {
    // Ritorna tutte le persone già assegnate a una macchina (proprietario o passeggero)
    const assigned = new Set();
    cars.forEach(car => {
        car.passengers.forEach(p => assigned.add(p));
    });
    return assigned;
}

function renderPeople() {
    peopleList.innerHTML = '';
    carOwnerSelect.innerHTML = '<option value="">Proprietario</option>';
    const assigned = getAssignedPeople();
    people.forEach((person, idx) => {
        // Mostra solo le persone non assegnate a nessuna macchina
        if (!assigned.has(person)) {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `<span>${person}</span>
                <button class=\"btn btn-sm btn-danger\" onclick=\"removePerson(${idx})\">Rimuovi</button>`;
            peopleList.appendChild(li);
            // Aggiorna select proprietario
            const opt = document.createElement('option');
            opt.value = person;
            opt.textContent = person;
            carOwnerSelect.appendChild(opt);
        }
    });
}

function renderCars() {
    carsList.innerHTML = '';
    cars.forEach((car, idx) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `<span>${car.owner} (${car.seats} posti)</span>
            <button class="btn btn-sm btn-danger" onclick="removeCar(${idx})">Rimuovi</button>`;
        carsList.appendChild(li);
    });
    renderCarsOrganization();
}

function renderCarsOrganization() {
    carsOrganization.innerHTML = '';
    const assigned = getAssignedPeople();
    cars.forEach((car, idx) => {
        const col = document.createElement('div');
        col.className = 'col-md-6';
        let passeggeri = car.passengers.filter(p => p !== car.owner);
        // Persone disponibili per essere aggiunte come passeggeri: non assegnate a nessuna macchina
        const availablePassengers = people.filter(p => !assigned.has(p));
        col.innerHTML = `
        <div class="card">
            <div class="card-header bg-info text-white">
                <strong>Auto di ${car.owner}</strong> <span class="badge bg-light text-dark ms-2">${car.seats} posti</span>
            </div>
            <div class="card-body">
                <div><strong>Proprietario:</strong> ${car.owner}</div>
                <div><strong>Passeggeri:</strong> ${passeggeri.length ? passeggeri.join(', ') : 'Nessuno'}</div>
                <div class="mt-2">
                    <select class="form-select mb-2" id="addPassenger${idx}">
                        <option value="">Aggiungi passeggero</option>
                        ${availablePassengers.map(p => `<option value="${p}">${p}</option>`).join('')}
                    </select>
                    <button class="btn btn-primary btn-sm" onclick="addPassenger(${idx})">Aggiungi</button>
                </div>
                <div class="mt-2">
                    <strong>Posti disponibili:</strong> ${car.seats - car.passengers.length}
                </div>
                <ul class="list-group mt-2">
                    ${car.passengers.map(p => `<li class="list-group-item d-flex justify-content-between align-items-center">${p}${p !== car.owner ? `<button class='btn btn-sm btn-warning' onclick='removePassenger(${idx}, \"${p}\")'>Rimuovi</button>` : ''}</li>`).join('')}
                </ul>
            </div>
        </div>
        `;
        carsOrganization.appendChild(col);
    });
}

// Eventi
addPersonForm.onsubmit = function(e) {
    e.preventDefault();
    const name = personNameInput.value.trim();
    if (name && !people.includes(name)) {
        people.push(name);
        saveData();
        renderPeople();
        renderCars();
        personNameInput.value = '';
    }
};

window.removePerson = function(idx) {
    const name = people[idx];
    // Rimuovi anche da passeggeri e proprietari
    cars = cars.filter(car => car.owner !== name);
    cars.forEach(car => {
        car.passengers = car.passengers.filter(p => p !== name);
    });
    people.splice(idx, 1);
    saveData();
    renderPeople();
    renderCars();
};

addCarForm.onsubmit = function(e) {
    e.preventDefault();
    const owner = carOwnerSelect.value;
    const seats = parseInt(carSeatsInput.value);
    // Il proprietario non deve essere già assegnato a nessuna macchina
    const assigned = getAssignedPeople();
    if (owner && seats > 0 && !assigned.has(owner)) {
        cars.push({ owner, seats, passengers: [owner] });
        saveData();
        renderPeople();
        renderCars();
        carOwnerSelect.value = '';
        carSeatsInput.value = '';
    }
};

window.removeCar = function(idx) {
    cars.splice(idx, 1);
    saveData();
    renderPeople();
    renderCars();
};

window.addPassenger = function(carIdx) {
    const select = document.getElementById('addPassenger' + carIdx);
    const name = select.value;
    // La persona non deve essere già assegnata a nessuna macchina
    const assigned = getAssignedPeople();
    if (name && cars[carIdx].passengers.length < cars[carIdx].seats && !assigned.has(name)) {
        cars[carIdx].passengers.push(name);
        saveData();
        renderPeople();
        renderCars();
    }
};

window.removePassenger = function(carIdx, name) {
    cars[carIdx].passengers = cars[carIdx].passengers.filter(p => p !== name);
    saveData();
    renderPeople();
    renderCars();
};

// Inizializza
loadData();
renderPeople();

renderCars();
