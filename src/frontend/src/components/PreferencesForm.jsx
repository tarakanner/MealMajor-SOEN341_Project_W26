import React, { useState, useEffect } from 'react';
import { createPreferences, updatePreferences, getPreferences } from '../services/preferencesService.js';

export default function PreferencesForm(){

    const [dietaryRestrictions, setDietaryRestrictions] = useState('none');
    const [allergies, setAllergies] = useState({
        peanuts: false,
        treenuts: false,
        shellfish: false,
        dairy: false
    });
    const [otherChecked, setOtherChecked] = useState(false);
    const [otherValue, setOtherValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [existingPreferences, setExistingPreferences] = useState(null);

    const handleDietaryChange = (e) => {
        setDietaryRestrictions(e.target.value);
    };

    useEffect(() => {
        const fetchPreferences = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) return;
            try {
                const prefs = await getPreferences(userId);
                if (!prefs) return;
                setExistingPreferences(prefs);

                // dietaryRestrictions might be stored as an array
                if (Array.isArray(prefs.dietaryRestrictions) && prefs.dietaryRestrictions.length > 0) {
                    setDietaryRestrictions(prefs.dietaryRestrictions[0]);
                }

                const prefsAllergies = Array.isArray(prefs.allergies) ? prefs.allergies : [];
                const lower = prefsAllergies.map(a => (a || '').toLowerCase().trim());

                setAllergies({
                    peanuts: lower.includes('peanuts'),
                    treenuts: lower.includes('tree nuts') || lower.includes('treenuts') || lower.includes('tree-nuts'),
                    shellfish: lower.includes('shellfish'),
                    dairy: lower.includes('dairy')
                });

                // find any allergy not in the known set and treat it as "other"
                const other = prefsAllergies.find(a => {
                    const la = (a || '').toLowerCase().trim();
                    return la && !['peanuts', 'tree nuts', 'treenuts', 'tree-nuts', 'shellfish', 'dairy'].includes(la);
                });
                if (other) {
                    setOtherChecked(true);
                    setOtherValue(other);
                }
            } catch (err) {
                console.log('No existing preferences found', err);
            }
        };
        fetchPreferences();
    }, []);

    const handleAllergyChange = (e) => {
        const { name, checked } = e.target;
        setAllergies(prev => ({
            ...prev,
            [name]: checked
        }));
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const userId = localStorage.getItem('userId');
            
            if (!userId) {
                throw new Error('User ID not found. Please log in again.');
            }

            // Build array of allergies
            const allergiesArray = Object.keys(allergies)
                .filter(key => allergies[key])
                .map(key => {
                    const allergyMap = {
                        peanuts: 'Peanuts',
                        treenuts: 'Tree Nuts',
                        shellfish: 'Shellfish',
                        dairy: 'Dairy'
                    };
                    return allergyMap[key];
                });

            // Add other allergy if specified
            if (otherChecked && otherValue.trim()) {
                allergiesArray.push(otherValue.trim());
            }

            // Build array of dietary restrictions 
            const dietaryArray = dietaryRestrictions !== 'none' ? [dietaryRestrictions] : [];

            // Check if preferences already exist
            let existingPreferences = null;
            try {
                existingPreferences = await getPreferences(userId);
            } catch (err) {
                console.log('No existing preferences found');
            }

            // Create or update preferences
            let result;
            if (existingPreferences) {
                result = await updatePreferences(userId, dietaryArray, allergiesArray, otherValue.trim());
                setSuccess('Preferences updated successfully!');
            } else {
                result = await createPreferences(userId, dietaryArray, allergiesArray, otherValue.trim());
                setSuccess('Preferences saved successfully!');
            }
            console.log('Preferences saved:', result);

        } catch (err) {
            setError(err.message || 'Failed to save preferences');
            console.error('Error saving preferences:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <form onSubmit={handleSubmit} className='auth-form'>
            {/* Show a different header when updating existing preferences */}
            <h1>{existingPreferences ? 'Update your preferences' : 'One last Step!'}</h1>
            <span className='user-header'>{existingPreferences ? 'Update your dietary preferences and allergies:' : 'Please update your dietary preferences and allergies to finish account creation:'}</span>
            
            {/* Display error or success messages here */}
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            {success && <div style={{color: 'green', marginBottom: '10px'}}>{success}</div>}
            
            <div>
                <label>Dietary Restrictions:</label><br />
                <select
                    name="dietaryRestrictions"
                    id="dietaryRestrictions"
                    value={dietaryRestrictions}
                    onChange={handleDietaryChange}
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
                    checked={allergies.peanuts}
                    onChange={handleAllergyChange}
                />
                <label htmlFor="peanuts"> Peanuts</label><br />
                <input 
                    type="checkbox"
                    id="treenuts"
                    name="treenuts"
                    checked={allergies.treenuts}
                    onChange={handleAllergyChange}
                />
                <label htmlFor="treenuts"> Tree Nuts</label><br />
                <input 
                    type="checkbox" 
                    id="shellfish" 
                    name="shellfish"
                    checked={allergies.shellfish}
                    onChange={handleAllergyChange}
                />
                <label htmlFor="shellfish"> Shellfish</label><br />
                <input 
                    type="checkbox" 
                    id="dairy" 
                    name="dairy"
                    checked={allergies.dairy}
                    onChange={handleAllergyChange}
                />
                <label htmlFor="dairy"> Dairy</label><br />
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
            <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Preferences'}</button>
        </form>
        </>
    );
};
