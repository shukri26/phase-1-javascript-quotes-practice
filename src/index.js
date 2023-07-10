// function that populate the page with quotes from the local server
function renderQuotes() {
  //fetches qutotes from the API
  fetch("http://localhost:3000/quotes?_embed=likes")
    .then((response) => response.json())
    .then(function (quotesObject) {
      //adds quotes to the page
      console.log(quotesObject);
      quotesObject.forEach(function(singleQuote){
        let quote = document.createElement("li")
        quote.setAttribute("class","quote-card")
        quote.innerHTML = 
        `<blockquote class='blockquote'> 
             <p class='mb-0'>${singleQuote["quote"]}</p> 
                 <footer class='blockquote-footer'>${singleQuote["author"]}</footer>
                 <br> 
                     <button class='btn-success'> Likes: 
                        <span>0</span></button>
                     <button class='btn-danger'>Delete</button>
            </blockquote>`;
            console.log(singleQuote)
        document.querySelector("ul#quote-list").append(quote)
        deleteQuote(singleQuote)
        likeQuote(singleQuote)
      })
    
    });
}
renderQuotes();

function addQuote(){
//listens for a submission of the form
document.querySelector("form#new-quote-form").addEventListener("submit",function(event){
  //prevents the form from refreshing the page
event.preventDefault()
//get the data that is entered when the form is submitted
let newQuote = document.querySelector("input#new-quote").value
let quoteAuthor = document.querySelector("input#author").value
// Submitting the form creates a new quote and adds it to the list of quotes without 
// having to refresh the page. Pessimistic rendering is recommended.
//creates a new quote object for the server
let newQuoteObject = {}
newQuoteObject["quote"] = newQuote
newQuoteObject["author"] = quoteAuthor
newQuoteObject["likes"] = []
//sends a POST request with the new quote object to the server
fetch("http://localhost:3000/quotes",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify(newQuoteObject)
})
//renders the quote on the page
renderQuotes()
})
}addQuote()
function deleteQuote(quote){
  //adds an event listener to the delete buttons
  document.querySelector("ul#quote-list")
  .lastChild
  .querySelector("button.btn-danger")
  .addEventListener("click",function(){
  //sends a fetch DELETE request removing the specific quote from the API through its ID
   fetch(`http://localhost:3000/quotes/${quote["id"]}`,{
     method:"DELETE",
     headers:{"Content-Type":"application/json"}
   })
  //renders the quotes minus the deleted one
   renderQuotes()
   })
  }

  function likeQuote(singleQuote){
    //adds event listener to the like buttons
    let likeButton = document.querySelector("ul#quote-list").lastChild.querySelector("button.btn-success");
    console.log(likeButton)
    likeButton.addEventListener("click",function(){
    //increases the number of likes by one when the button is clicked
    let likeNumber = parseInt(likeButton.querySelector("span").textContent)
    console.log(likeNumber)
    likeNumber++
    likeButton.querySelector("span").textContent = likeNumber
    //creates a likeObject to be added to the server
    likeObject = {}
    likeObject["quoteId"] = singleQuote["id"]
    likeObject["createdAt"] = Date.now()
    console.log(likeObject)
    //adds a like object with a quoteId of the quote to the server
    fetch("http://localhost:3000/likes",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(likeObject)
    })
    })
    //makes the number of likes persistent by fetching them from the server
    fetch(`http://localhost:3000/likes?quoteId=${singleQuote["id"]}`)
    .then(response => response.json())
    .then(data => 
    likeButton.querySelector("span").textContent = data.length + 1)
    }