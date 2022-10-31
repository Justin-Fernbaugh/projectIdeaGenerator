# projectIdeaGenerator

This is a project used to generate more project ideas. The API for the app is described below which is utilized by the frontend/client. The API communicates utilizing HTTP CRUD operations.

# GET
- /
GET on the / route will yield "App is healthy" in the body of the response. If this message is not recieved the app is not working properly."

- /ideas
GET on the /ideas route requires two parameters in the request. The first parameter "limit" is the maximum amount of items to be returned. The second paremter "genre" specifies which genre of idea to return. The response is formatted as an array containing strings.
Example: HTTP GET to "localhost:4000/ideas?limit=5&genre=Crypto"
Response: The body of the response will contain "[
    "Uber but on the blockchain.",
    "A search engine but for privacy.",
    "Doordash but delivered by animals."
]"

- /save
GET on the /save route will yield an array containing all currently "in progress" ideas. There's a parameter on the request "limit" which caps the maximum number of items returned within the array.
Example: HTTP GET to "localhost:4000/save"
Reponse: The body of the response will contain (Assuming an idea is currently labeled as in progress)"[
    "Uber but on the blockchain."
]"
# POST
- /save
POST on the /save route requires an array containing JSON objects with two values "idea" and "inProgress". The idea field will containg a string of a matching idea already in teh database. The inProgress field is a boolean which updates the inProgress status within the database. The response will contain a JSON object with the field "modifedCount" that has an integer of how many documents were updated by the request"
Example: HTTP POST to "localhost:4000/save" with the body containing "[
    {"idea": "A search engine but for privacy.", "inProgress": true},
    {"idea": "Uber but on the blockchain.", "inProgress": false}
]"
Response: The body of the response will contain "{
    "modifiedCount": 2
}"
