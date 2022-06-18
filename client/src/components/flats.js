import {gql, useQuery } from '@apollo/client'
import { useState} from 'react';


const getFlatsQuery = gql`
    {
        flats{
            number
            area
        }
    }
`
const Flats = () => {
    const [newData, setNewData] = useState({})
    const { loading, error, data } = useQuery(getFlatsQuery);

    if(loading) return <p>Loading....</p>

    if(error) return <p>Oops! Something went wrong</p>


    //console.log(data.flats)
    return ( 
    <div>
        <ul> Flats numbers
            {newData.flats.map(flat=>{
                return(
                        <li>{flat.number}</li>
                )
            })}

        </ul>
    </div>
    );
}
 
export default Flats;