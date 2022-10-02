import React, {useState, useEffect} from 'react';
import Table from './Table'
import Form from './Form';
import axios from 'axios';



function MyApp() {
  const [characters, setCharacters] = useState([])

  useEffect(() => {
    fetchAll().then( result => {
       if (result)
          setCharacters(result);
     });
 }, [] );

 async function makePostCall(person){
  try {
     const response = await axios.post('http://localhost:5000/users', person);
     return response;
  }
  catch (error) {
     console.log(error);
     return false;
  }
}

async function makeDeleteCall(index) {
   try {
     return await axios.delete(
       `http://localhost:5000/users/${characters[index].id}`
     );
   } catch (error) {
     //just logging errors to the console
     console.log(error);
     return false;
   }
 }


async function fetchAll(){
   try {
      const response = await axios.get('http://localhost:5000/users');
      return response.data.users_list;     
   }
   catch (error){
      //We're not handling errors. Just logging into the console.
      console.log(error); 
      return false;         
   }
}

  return (
    <div className="container">
    <Table characterData={characters} removeCharacter={removeOneCharacter} />
    <Form handleSubmit={updateList} />

    </div>
  );

  

  function removeOneCharacter(index) {
   makeDeleteCall(index).then((result) => {
     if (result && result.status === 204) {
       const updated = characters.filter((character, i) => {
         return i !== index;
       });
       setCharacters(updated);
     } else if (result.status === 404) {
       console.log("Resouce not found. Object not deleted");
     }
   });
 }

    function updateList(person) { 
      makePostCall(person).then( result => {
      if (result && result.status === 201)
         setCharacters([...characters, person] );
      });


   }
}



export default MyApp;