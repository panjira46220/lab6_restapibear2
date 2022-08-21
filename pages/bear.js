import React, { useState } from 'react'
import axios from 'axios'
import useSWR, { mutate } from 'swr'

const URL = `http://localhost:8000/api/bears`
const fetcher = url => axios.get(url).then(res => res.data)

const SWR1 = () => {
    // const [bears, setBears] = useState({})
    const [bear, setBear] = useState('')
    const [name, setName] = useState('')
    const [weight, setWeight] = useState(0)

    const { data } = useSWR(URL, fetcher)
    if (!data) return <div>Loading...</div>
    // console.log(data)

    const printBears = (bears) => {
        console.log('Bears:', bears)
        if (bears && bears.length)
            return (bears.map((bear, index) =>
            (<li key={index}>
                {(bear) ? bear.name : '-'} : {(bear) ? bear.weight : 0}
                <button onClick={() => deleteBear(bear.id)}> Delete </button>
                <button onClick={() => getBear(bear.id)}>Get</button>
                <button onClick={() => updateBear(bear.id)}>Update</button>
            </li>)
            ))
        else {
            return (<h2>No bears</h2>)
        }
    }

    const getBear = async (id) => {
        const result = await axios.get(`${URL}/${id}`)
        console.log('bear id: ', result.data)
        setBear(result.data)
    }

    const addBear = async (name, weight) => {
        const result = await axios.post(URL, { name, weight })
        console.log(result.data)
        mutate(URL)
    }

    const deleteBear = async (id) => {
        const result = await axios.delete(`${URL}/${id}`)
        console.log(result.data)
        mutate(URL)
    }

    const updateBear = async (id) => {
        const result = await axios.put(`${URL}/${id}`,{
            name,
            weight
        })
        console.log('bear id update: ', result.data)
        mutate(URL)
    }

    return (
    <div>
        <h1> Bear </h1>
        <ul>{printBears(data.list)}</ul>

        selected bear: {bear.name} {bear.weight}
        <h2>Add bear</h2>
            Name:<input type="text" onChange={(e) => setName(e.target.value)} /><br/>
            Weight:<input type="number" onChange={(e) => setWeight(e.target.value)}/>
        <br />
        <button onClick={() => addBear(name, weight)}>Add new bear</button>
    </div>)
}
export default SWR1