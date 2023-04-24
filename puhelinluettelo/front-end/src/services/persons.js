import axios from 'axios'
const baseUrl = '/api/persons'


const createPerson = newPerson => {
    return axios.post(baseUrl, newPerson)
}

const getPersons = () => {
    return axios.get(baseUrl)
}

const deletePerson = id => {
    const url = `${baseUrl}/${id}`
    return axios.delete(url)
}

const changePerson = (id, newPerson) => {
    const url = `${baseUrl}/${id}`
    return axios.put(url, newPerson)
}

const personsService = { createPerson: createPerson, getPersons: getPersons, deletePerson: deletePerson, changePerson: changePerson }
export default personsService