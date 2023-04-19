import { useState, useEffect } from 'react'
import personService from "./services/persons"
import "./index.css"


const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="success">
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const Filter = (props) => {
  return (
    <div>
      filter: <input onChange={props.onChange} value={props.value}></input>
    </div>
  )
}

const AddPerson = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        name: <input onChange={props.onNameChange} value={props.nameValue} />
      </div>
      <div>
        number : <input onChange={props.onNumberChange} value={props.numberValue} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const DisplayPersons = (props) => {
  return (
    <div>
      {props.filter.length === 0
        ? props.persons.map(person => <li key={person.name}>{person.name} {person.number} <button onClick={() => props.deletePerson(person.id)}>Delete</button></li>)
        : props.acceptedPersons.map(person => <li key={person.name}>{person.name} {person.number}</li>)}

    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState("")
  const [acceptedPersons, setAcceptedPersons] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  const addPerson = (event) => {
    event.preventDefault()
    const person = {
      name: newName,
      number: newNumber
    }

    if (persons.map(person => person.name).includes(newName)) {
      const oldPerson = (persons.find(person => person.name === newName))
      const choice = window.confirm(`${newName} is already added to phonebook, replace their old number with a new one?`)
      if (choice) {
        changeNumber(oldPerson.id, person)
      }
    }
    else {
      personService.createPerson(person)
        .then(_response => {
          setPersons(persons.concat(person))
          setNewName("")
          setNewNumber("")
          setNotificationMessage(`Added ${person.name}`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })

    }
  }

  const changeNumber = (id, newPerson) => {
    personService.changePerson(id, newPerson)
      .then(_response => {
        setPersons(persons.map(person => person.id !== id ? person : newPerson))
        setNotificationMessage(`Changed ${newPerson.name}'s number`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      }
      )
      .catch(_error => {
        setErrorMessage(`${newPerson.name} has been deleted from the server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setPersons(persons.map(person => person.id !== id))
        return null
      })

  }

  const handleNameChange = (event) => {
    setNewName(event.target.value.trim())
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    const result = persons.filter(
      person => person.name.toLowerCase().includes(event.target.value.toLowerCase())
    )
    setAcceptedPersons(result)
    setNewFilter(event.target.value)
  }

  const deletePerson = id => {
    const deletedPerson = persons.find(person => person.id === id)
    const choice = window.confirm("Are you sure?")
    if (choice) {
      personService.deletePerson(id)
        .then(_response => {
          setPersons(persons.filter(person => person !== deletedPerson))
          setNotificationMessage(`Deleted ${deletedPerson.name}`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
  }


  useEffect(() => {
    personService.getPersons()
      .then(response => {
        setPersons(response.data)
      })
      .catch(e => {
        console.log(e)
      })
  }, [])


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Error message={errorMessage} />
      <Filter onChange={handleFilterChange} value={newFilter} />
      <h2>Add new person</h2>
      <AddPerson
        onSubmit={addPerson}
        onNameChange={handleNameChange}
        nameValue={newName}
        onNumberChange={handleNumberChange}
        numberValue={newNumber} />
      <h2>Numbers</h2>
      <DisplayPersons filter={newFilter} persons={persons} acceptedPersons={acceptedPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App