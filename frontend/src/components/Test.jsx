import { useEffect, useState } from 'react'
import '../App.css'
import axios from 'axios'

function Test() {
  const [test, setTest] = useState();

  useEffect(() => {
    axios.get('/api/v1/users/test')
      .then((response) => {
        console.log(response);
        setTest(response.data.message)
      })
      .catch((error) => {
        console.log(error)
      })
  },[])

  return (
    <>
      <h1>Jai shree ram</h1>
      <h1>the response of the server is : {test} </h1>
      
    </>
  )
}

export default Test
