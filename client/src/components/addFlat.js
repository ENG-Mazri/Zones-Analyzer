import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';

const AddFlatMutation = gql`
    mutation AddFlat($number: Int!, $area: Int!){
        addFlat(number: $number, area: $area){
            number
            area
        }
    }
`

const AddFlat = () => {
    const [flatNumber, setFlatNumber] = useState('');
    const [flatArea, setFlatArea] = useState('');
    const [addFlatFunction, { data, loading, error }] = useMutation(AddFlatMutation);
    
    
    
    //console.log("mutation:",data)
    
    
    const changedFlatNumber = (event)=>{
        setFlatNumber(event.target.value)
    }
    const changedFlatArea = (event)=>{
        setFlatArea(event.target.value)
    }

    const addNewFlat = ()=>{
        addFlatFunction({variables:{number:parseInt(flatNumber), area:parseInt(flatArea)}})
    }
    return ( 
        <div>
            <input onChange={changedFlatNumber} value={flatNumber} placeholder="set flat number"></input><br/>
            <input onChange={changedFlatArea} value={flatArea} placeholder="set flat area"></input><br/>
            <button onClick={addNewFlat}>Add flat</button>

        </div>
     );
}
 
export default AddFlat;