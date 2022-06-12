import React from "react"; 

const Uploadbutton = props => {
    return(
        <input type="file" onChange={e => props.changeSelectedFile(e.target.files[0])}/>
    
    )
}
export default Uploadbutton;