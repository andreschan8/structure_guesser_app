const table = document.querySelector('#table-id')

placeholder = "*****************"

function goToStructGuess(doc) {
    db.collection('userLogs').add({
        english: doc.data().english,
        spanish: doc.data().spanish
    })
    .then(function() {
        window.location.href = 'theory.html';
    })
    .catch(function(error) {
        console.error("Error writing to Firestore: ", error);
    });
};

function goToEdit(doc) {
    db.collection('userLogs').add({
		doc_id: doc.id,
        english: doc.data().english,
        spanish: doc.data().spanish
    })
    .then(function() {
        window.location.href = 'edit.html';
    })
    .catch(function(error) {
        console.error("Error writing to Firestore: ", error);
    });
};

function toggleVisibility(rectangle, doc) {
    var x = rectangle.children[0].children[1];
    if (x.textContent === placeholder) {
      x.textContent = doc.data().english;
    } else {
      x.textContent = placeholder;
    }
}

function renderPairs(doc) {

	let rectangle = document.createElement('div');
	let div1 = document.createElement('div');
	let div2 = document.createElement('div');
	let pEs = document.createElement('p');
	let pEn = document.createElement('p');
	let toggleButton = document.createElement('button');
	let chooseButton = document.createElement('button');
	let deleteButton = document.createElement('button');
	let editButton   = document.createElement('button');

	rectangle.classList.add("rectangle");
	div1.classList.add("region");
	div2.classList.add("region");
	div2.classList.add("button");

	pEs.textContent = doc.data().spanish;
	pEn.textContent = placeholder;
	toggleButton.textContent = 'Hide English sentence';
	chooseButton.textContent = 'Choose sentence pair';
	deleteButton.textContent = 'Delete sentence pair';
	editButton.textContent   = 'Edit sentence pair';

	rectangle.appendChild(div1);
	rectangle.appendChild(div2);
	div1.appendChild(pEs);
	div1.appendChild(pEn);
	div2.appendChild(toggleButton);
	div2.appendChild(chooseButton);
	div2.appendChild(deleteButton);
	div2.appendChild(editButton);

	rectangle.setAttribute('data-id',doc.id);
	toggleButton.setAttribute('type','button');
	toggleButton.addEventListener('click', function() {
		toggleVisibility(rectangle, doc);
	});
    chooseButton.addEventListener('click', function() {
        goToStructGuess(doc);
    });
	editButton.addEventListener('click', function() {
		goToEdit(doc);
	});

	table.appendChild(rectangle);
	//Deleting functionality, after the table.appendChild(rectangle) line
	deleteButton.addEventListener('click', (e) => {
	e.stopPropagation();
	let id = e.target.parentElement.parentElement.getAttribute('data-id');
	//I think the following line adds the 'removed' status
	db.collection('sentencePairs').doc(id).delete();
	});
}

form = document.querySelector('#entry-id')
// Add sentence pair
form.addEventListener('submit', (e) => {
	e.preventDefault();
	db.collection('sentencePairs').add({
		english: form.enName.value,
		spanish: form.esName.value
	});
});

db.collection('sentencePairs').orderBy('english').onSnapshot(snapshot => {
	let changes = snapshot.docChanges(); //Track any changes
	changes.forEach(change => {
		if (change.type == 'added') {
			renderPairs(change.doc);
		} else if (change.type == 'removed') {
			let rectangle = document.querySelector('[data-id=\"' + change.doc.id + '\"]')
			table.removeChild(rectangle)
		}
	});
});
