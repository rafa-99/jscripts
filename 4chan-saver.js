/*
 * Saves cleans up and saves
 * 4chan threads to a PDF file
 */

document.getElementsByTagName("body")[0].innerHTML = document.querySelectorAll('[class=thread]')[0].innerHTML;
window.print();
