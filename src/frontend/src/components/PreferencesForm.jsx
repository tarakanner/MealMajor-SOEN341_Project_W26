import React, { useState } from 'react';

export default function PreferencesForm(){

    const [otherChecked, setOtherChecked] = useState(false);
    const [otherValue, setOtherValue] = useState('');

    // Disable other input if checkbox is unchecked and remove value
    const handleOtherCheckbox = (e) => {
        setOtherChecked(e.target.checked);
        if (!e.target.checked) {
            setOtherValue('');
        }
    };
    const handleOtherValueChange = (e) => {
        setOtherValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add functionality to save preferences
        console.log(preferences);
    };

    return (
        <>
        <form onSubmit={handleSubmit} className='auth-form'>
            <h1>Profile Management</h1>
            <div>
                <label>Dietary Restrictions:</label><br />
                <select
                    name="dietaryRestrictions"
                    id="dietaryRestrictions"
                    placeholder="Select Restrictions">

                    <option value="none">None</option>
                    <option value="vegan">Vegan</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="gluten-free">Gluten-Free</option>
                    <option value="halal">Halal</option>
                    <option value="kosher">Kosher</option> 
                </select>
            </div>
            <div>
                <label>Allergies:</label><br />
                <input 
                    type="checkbox" 
                    id="peanuts" 
                    name="peanuts" 
                    value="Peanuts">
                </input>
                <label for="peanuts"> Peanuts</label><br />
                <input 
                    type="checkbox"
                    id="treenuts"
                    name="treenuts"
                    value="Tree Nuts">
                </input>
                <label for="treenuts"> Tree Nuts</label><br />
                <input 
                    type="checkbox" 
                    id="shellfish" 
                    name="shellfish" 
                    value="Shellfish">
                </input>
                <label for="shellfish"> Shellfish</label><br />
                <input 
                    type="checkbox" 
                    id="dairy" 
                    name="dairy" 
                    value="Dairy">
                </input>
                <label for="dairy"> Dairy</label><br />
                <input 
                type="checkbox" 
                id="other" 
                name="other" 
                checked={otherChecked}
                onChange={handleOtherCheckbox}
            />
            <label htmlFor="other"> Other: </label>
            <input
                type="text"
                name="otherValue"
                placeholder="Enter Allergy"
                value={otherValue}
                onChange={handleOtherValueChange}
                disabled={!otherChecked}
            />
            </div>
            <button type="submit">Save Preferences</button>
        </form>
        </>
    );
};
