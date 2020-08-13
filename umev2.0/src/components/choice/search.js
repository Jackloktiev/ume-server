import React from 'react';
import "./search.css";

function Search (props){
    return(
        <input 
        type = "search"
        placeholder = "Search for item..."
        className = "Search"
        onChange = {props.changeHandler}
         />
)}

export default Search;