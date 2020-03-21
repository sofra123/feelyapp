// only the hook itself has to start with use

import React, { useState } from "react"; //allow to create properties in state. (setValues)Equivalent of setState

// setValues does not add to previous state, but replace

export function useStatefulFields() {
    const [values, setValues] = useState({}); //return an array with 2 things inside. 2 argument func to update value

    const handleChange = e => {
        setValues({
            ...values, // this code is creating a copy of the old state
            [e.target.name]: e.target.value //it´s a variable not an array
        });
    };

    return [values, handleChange];
}
