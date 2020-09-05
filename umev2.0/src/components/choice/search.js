import React from 'react';
import 'bootswatch/dist/yeti/bootstrap.min.css';
import "./search.css";

function Search (props){
    return(
        <input 
        type = "search"
        placeholder = "Search for item..."
        className = "form-control mt-1"
        onChange = {props.changeHandler}
         />
)}

export default Search;