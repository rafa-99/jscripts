/*
 * This script scrapes the questions in a moodle questionary
 * and saves them into a local txt file
 */ 

// Downloadable file function
function download(filename, text)
{
	let element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

// Declaring Vars
let questions, output = "", exposed = false, exposedAnswers = [];

// Checking for exposed answers and storing them in a array;
if ( document.querySelectorAll('[class=rightanswer]').length > 0 )
{
	exposed = true;
	exposedAnswers = document.querySelectorAll('[class=rightanswer]');
}

// Grabbing All the Questions
questions = document.querySelectorAll('[id^=question]');

// Iterating Questions
for (let i = 0; i < questions.length; i++)
{
	let answer = "Question " + (i + 1) + " : " + questions[i].getElementsByClassName("qtext")[0].innerText + "\n\n";
	//Grabing Question Type
	switch (questions[i].classList[1])
	{
		// True/False Type Questions
		case "truefalse":
			if ( exposed )
			{
				answer += exposedAnswers[i].innerText.replace(/(\r\n|\n|\r)/gm,"") + "\n";
			}
			else
			{
				answer += "Answer:\n"
				// If answer is correct grabs the correct one
				if ( questions[i].classList.contains("correct") )
				{
					answer += questions[i].getElementsByClassName("answer")[0].getElementsByClassName("correct")[0].getElementsByTagName("label")[0].textContent + "\n";
				}
				// Else grabs the opposite one
				else
				{
					if ( questions[i].querySelectorAll('[class=answer]')[0].innerHTML.includes("fa-check") )
					{
						if ( questions[i].querySelectorAll('[class=answer]')[0].childNodes[0].classList.contains("incorrect") )
						{
							answer += questions[i].querySelectorAll('[class=answer]')[0].childNodes[1].innerText + "\n";
						}
						else
						{
							answer += questions[i].querySelectorAll('[class=answer]')[0].childNodes[0].innerText + "\n";
						}
					}
					else
					{
						// In case the question ain't verified
						if ( questions[i].querySelectorAll('[class=answer]')[0].childNodes[0].childNodes[0].checked )
						{
							answer += questions[i].querySelectorAll('[class=answer]')[0].childNodes[0].innerText + " -> NOT CHECKED :( !!!\n";
						}
						else
						{
							answer += questions[i].querySelectorAll('[class=answer]')[0].childNodes[1].innerText + " -> NOT CHECKED :( !!!\n";
						}
					}
				}
			}
			break;

		// Selecting the correct options inside of every field
		case "match":
			if ( exposed )
			{
				answer += exposedAnswers[i].innerText.replace(/(\r\n|\n\n|\r)/gm,"\n") + "\n";
			}
			else
			{
				answer += "Answer:\n"
				for ( let j = 0; j < questions[i].getElementsByClassName("answer")[0].getElementsByTagName("tr").length; j++ )
				{

					answer += questions[i].getElementsByClassName("answer")[0].getElementsByTagName("tr")[j].getElementsByClassName("text")[0].innerText.replace(/(\r\n|\n|\r)/gm,"") + " -> "
						+ questions[i].getElementsByClassName("answer")[0].getElementsByTagName("tr")[j].getElementsByClassName("custom-select")[0].selectedOptions[0].innerText;

					if ( questions[i].getElementsByClassName("answer")[0].getElementsByTagName("tr")[j].getElementsByClassName("icon").length > 0 )
					{
						answer += " = " + questions[i].getElementsByClassName("answer")[0].getElementsByTagName("tr")[j].getElementsByClassName("icon")[0].title + "\n";
					}
					else
					{
						// In case the question ain't verified
						answer += " -> NOT CHECKED :( !!!\n"
					}
				}
				answer += "\n"
			}
			break;

		// Multi Choice Questions
		case "multichoice":
			if ( exposed )
			{
				answer += exposedAnswers[i].innerText.replace(/(\r\n|\n\n|\r)/gm,"\n") + "\n";
			}
			else
			{
				answer += "Answer:\n"
				if ( questions[i].getElementsByClassName("answer")[0].querySelectorAll('[class$=correct]').length > 0 )
				{
					for ( let j = 0; j < questions[i].getElementsByClassName("answer")[0].querySelectorAll('[class$=correct]').length; j++ )
					{
						answer += questions[i].getElementsByClassName("answer")[0].querySelectorAll('[class$=correct]')[j].getElementsByTagName('label')[0].innerText.replace(/(\r\n|\n|\r)/gm,"") + " -> "
							+ questions[i].getElementsByClassName("answer")[0].querySelector('[class$=correct]').getElementsByClassName("icon")[0].title + "\n"
					}
				}
				else
				{
					// In case the question ain't verified
					for ( let j = 0; j < questions[i].getElementsByClassName("answer")[0].childNodes.length; j += 2 )
					{
						if ( questions[i].getElementsByClassName("answer")[0].childNodes[j].innerHTML.includes("checked=") )
						{
							answer += questions[i].getElementsByClassName("answer")[0].childNodes[j].innerText.replace(/(\r\n|\n|\r)/gm,"") + " -> NOT CHECKED :( !!!\n"
						}
					}
				}
				answer += "\n"
			}
	}
	output += answer + "\n-----------------------------------------------\n\n";
}

download(document.title + ".txt", output);
