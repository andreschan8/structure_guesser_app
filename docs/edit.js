let dummyID = 'dummy-id';
let editID = '';

window.onload = function () {
	db.collection('userLogs').where(firebase.firestore.FieldPath.documentId(),'!=',dummyID).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
            let enSen = document.querySelector('#englishText');
			let esSen = document.querySelector('#spanishText');

            editID = doc.data().doc_id;
            enSen.textContent = doc.data().english;
			esSen.textContent = doc.data().spanish;

            let logID = doc.id;
            db.collection('userLogs').doc(logID).delete();
        });
    });
};

function updateAndGoToSenMan(doc) {
    db.collection('sentencePairs').doc(doc).update({
        english: document.querySelector('#englishText').value,
        spanish: document.querySelector('#spanishText').value
    })
    .then(function() {
        window.location.href = 'data3.html';
    })
    .catch(function(error) {
        console.error("Error writing to Firestore: ", error);
    });
};

function printSpanish() {
	document.getElementById("spanishLegend").innerHTML = ""
	var text = document.getElementById("spanishText").value
	document.getElementById("spanishLegend").innerHTML = text
}

//We create this variable here since it is
//used in the next function.
var punctChars = {
	".":"dot",",":"comma","-":"hyphen",
	"?":"question","!":"exclamation",
	":":"colon",";":"semicolon",
	"(":"lpar",")":"rpar","[":"lsqb",
	"]":"rsqb","\"":"quot", "'":"apos"
};

function printStructure() {
	var text = document.getElementById("englishText").value
	document.getElementById("englishStructure").innerHTML = ""
	if (text == "") {
		var errorString = "You have entered no English text"
		document.getElementById("englishStructure").innerHTML = errorString
	}
	else {
		words = text.split(" ")
		word_array = words.slice(0)
		for (var i = 0; i<words.length; i++) {
			var input = document.createElement("input")
			input.type = "text"
			input.size = words[i].length
			input.className = "indivBox"
            input.autocapitalize = "none"

			// Check for punctuation in the word
			const punctuation = words[i].match(/[.,-?!:;\(\)\[\]\"\'']/g);
			if (punctuation) {
			  input.placeholder = punctuation.map(p => punctChars[p]).join(', ');
			}

			document.getElementById("englishStructure").appendChild(input)
		}
	}
	textboxManager()
}

function textboxManager() {
	const textboxes = document.querySelectorAll(".indivBox")
	textboxes.forEach((textbox, index) => {
		let  lastValue  =  textbox.value;
		textbox.addEventListener('keydown', (event) => {
			if (event.key  ===  'Backspace'  &&  textbox.selectionStart  ===  0) {
				const  previousTextbox  =  textboxes[index  -  1];
				if (previousTextbox) {
					if (!(event.repeat)){
						event.preventDefault();
					}
					previousTextbox.focus();
					previousTextbox.selectionStart  =  previousTextbox.value.length;
				}
			}
		})
		textbox.addEventListener('input', (event) => {

			if (textbox.value === '$r') {
				textbox.value = words[index];
			};

			if (textbox.value === words[index]) {
				textbox.classList.add("right")
		
				const nextTextbox = textboxes[index + 1]
				if (nextTextbox) {
					nextTextbox.focus()
				}
			}
			else {
				textbox.classList.remove("right")
			}
			if (textbox.value !== lastValue + ' ' && textbox.value !== lastValue.slice(0, -1)) {
				lastValue = textbox.value;
				return;
			}
	
			if (textbox.value === lastValue + ' ') {
				textbox.value = lastValue.trim();
				const nextTextbox = textboxes[index + 1];
				if (nextTextbox) {
					nextTextbox.focus();
				}
			}
			lastValue = textbox.value;
		});
	
		textbox.addEventListener('keydown', (event) => {
			if (event.key  ===  ' '  &&  textbox.selectionStart  !==  textbox.value.length) {
				event.preventDefault();
			}
		});
	})
}

let word_array
