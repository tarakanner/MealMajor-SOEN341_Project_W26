// pages/FridgePage.jsx
import React, { useState, useEffect } from 'react';
import { getFridge, saveIngredients, getMissingIngredients } from '../services/fridgeService';
import { getGroceryPrices } from '../services/groceryPriceService';

const UNIT_OPTIONS = [
    { value: 'units', label: 'Units' },
    { value: 'mililitres', label: 'ml' },
    { value: 'litres', label: 'L' },
    { value: 'grams', label: 'g' },
    { value: 'kilograms', label: 'kg' }
];

export default function Fridge() {
    const [ingredient, setIngredient] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('units');
    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValues, setEditValues] = useState({ ingredient: '', quantity: '', unit: 'units' });
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [missingIngredients, setMissingIngredients] = useState(null);
    const [loadingMissing, setLoadingMissing] = useState(false);
    const [groceryPrices, setGroceryPrices] = useState(null);
    const [loadingPrices, setLoadingPrices] = useState(false);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) return;
        getFridge(userId)
            .then(data => {
                if (data && data.ingredients) {
                    setItems(data.ingredients.map(ing => ({
                        ingredient: ing.name,
                        quantity: ing.quantity,
                        unit: ing.unit,
                    })));
                }
            })
            .catch(() => setError('Failed to load fridge. Please try again.'));
    }, [userId]);

    const persistItems = async (updatedItems) => {
        if (!userId) return;
        setSaving(true);
        setError(null);
        try {
            await saveIngredients(userId, updatedItems.map(item => ({
                name: item.ingredient,
                quantity: item.quantity,
                unit: item.unit,
            })));
        } catch {
            setError('Failed to save changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!ingredient || !quantity) return;
        const updatedItems = [...items, { ingredient, quantity, unit }];
        setItems(updatedItems);
        setIngredient('');
        setQuantity('');
        setUnit('units');
        await persistItems(updatedItems);
    };

    const handleRemove = async (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        setSelected(selected.filter(i => i !== index).map(i => (i > index ? i - 1 : i)));
        if (editingIndex === index) setEditingIndex(null);
        await persistItems(updatedItems);
    };

    const handleSelect = (index) => {
        setSelected(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setEditValues({ ...items[index] });
    };

    const handleEditChange = (field, value) => {
        setEditValues(prev => ({ ...prev, [field]: value }));
    };

    const handleEditSave = async (index) => {
        const updated = [...items];
        updated[index] = { ...editValues };
        setItems(updated);
        setEditingIndex(null);
        await persistItems(updated);
    };

    const handleEditCancel = () => {
        setEditingIndex(null);
    };

    const getSelectedItems = () => selected.map(i => items[i]);

    const handleGenerateMissing = async () => {
        if (!userId) return;
        setLoadingMissing(true);
        setError(null);
        try {
            const data = await getMissingIngredients(userId);
            setMissingIngredients(data.missingIngredients);
        } catch {
            setError('Failed to generate missing ingredients. Please try again.');
        } finally {
            setLoadingMissing(false);
        }
    };

    const handleFindGroceryPrices = async (ingredientList) => {
        if (!ingredientList || ingredientList.length === 0) return;
        setLoadingPrices(true);
        setGroceryPrices(null);
        setError(null);
        try {
            const data = await getGroceryPrices(ingredientList);
            setGroceryPrices(data.results);
        } catch {
            setError('Failed to fetch grocery prices. Please try again.');
        } finally {
            setLoadingPrices(false);
        }
    };

    return (
        <div className="fridgeForm">
            <h2>My Fridge</h2>
            {error && <p style={{ color: 'red', marginBottom: '8px' }}>{error}</p>}
            <form onSubmit={handleAdd}>
                <input
                    type="text"
                    placeholder="Ingredient"
                    value={ingredient}
                    onChange={e => setIngredient(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    min="1"
                />
                <select
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                >
                    {UNIT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <button type="submit" disabled={saving}>Add</button>
            </form>
            <div className='fridgeListContainer'>
                <ul className='fridgeList'>
                    {items.map((item, idx) => (
                        <li key={idx}>
                            <input
                                type="checkbox"
                                checked={selected.includes(idx)}
                                onChange={() => handleSelect(idx)}
                                style={{ marginRight: '8px' }}
                            />
                            {editingIndex === idx ? (
                                <>
                                    <input
                                        type="text"
                                        value={editValues.ingredient}
                                        onChange={e => handleEditChange('ingredient', e.target.value)}
                                        style={{ maxWidth: '100px' }}
                                    />
                                    <input
                                        type="number"
                                        value={editValues.quantity}
                                        onChange={e => handleEditChange('quantity', e.target.value)}
                                        min="1"
                                        style={{ maxWidth: '75px' }}
                                    />
                                    <select
                                        value={editValues.unit}
                                        onChange={e => handleEditChange('unit', e.target.value)}
                                    >
                                        {UNIT_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <button onClick={() => handleEditSave(idx)} style={{ marginLeft: '8px' }} disabled={saving}>Save</button>
                                    <button onClick={handleEditCancel}>Cancel</button>
                                    <button onClick={() => handleRemove(idx)}>Remove</button>
                                </>
                            ) : (
                                <>
                                    {item.ingredient} - {item.quantity} {item.unit}
                                    <button onClick={() => handleEdit(idx)}>Edit</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="actionButtons">
                {/* Need to add functionality to these buttons later*/}
                <button
                    onClick={() => alert('Search Recipes with selected items: ' + getSelectedItems().map(i => `\n- ${i.ingredient} (${i.quantity} ${i.unit})`))}
                    disabled={selected.length === 0}
                >
                    Search Recipes
                </button>
                {/*Need to add functionality to these buttons later*/}
                <button
                    onClick={() => alert('Create Grocery List with selected items: ' + getSelectedItems().map(i => `\n- ${i.ingredient} (${i.quantity} ${i.unit})`))}
                    disabled={selected.length === 0}
                >
                    Create Grocery List
                </button>
                <button onClick={handleGenerateMissing} disabled={loadingMissing}>
                    {loadingMissing ? 'Checking...' : 'Generate Missing Ingredients'}
                </button>
                <button
                    onClick={() => handleFindGroceryPrices(selected.length > 0 ? getSelectedItems().map(i => i.ingredient) : missingIngredients || [])}
                    disabled={loadingPrices || (selected.length === 0 && !missingIngredients?.length)}
                >
                    {loadingPrices ? 'Searching Flipp...' : 'Find Grocery Prices (Flipp)'}
                </button>
            </div>
            {missingIngredients !== null && (
                <div style={{ marginTop: '16px' }}>
                    <h3>Missing Ingredients from Weekly Meal Plan</h3>
                    {missingIngredients.length === 0 ? (
                        <p>Your fridge has everything needed for your weekly meal plan!</p>
                    ) : (
                        <ul>
                            {missingIngredients.map((ing, idx) => (
                                <li key={idx}>{ing}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            {groceryPrices !== null && (
                <div style={{ marginTop: '16px' }}>
                    <h3>Grocery Prices from Flipp (Montreal)</h3>
                    {groceryPrices.map((result, idx) => (
                        <div key={idx} style={{ marginBottom: '16px' }}>
                            <h4 style={{ textTransform: 'capitalize' }}>{result.ingredient}</h4>
                            {result.error ? (
                                <p style={{ color: 'red' }}>{result.error}</p>
                            ) : result.offers.length === 0 ? (
                                <p>No offers found.</p>
                            ) : (
                                <ul>
                                    {result.offers.map((offer, oidx) => (
                                        <li key={oidx}>
                                            <strong>{offer.name}</strong>
                                            {offer.price ? ` — ${offer.price}` : ''}
                                            {offer.storeName ? ` @ ${offer.storeName}` : ''}
                                            {offer.link ? (
                                                <> <a href={offer.link} target="_blank" rel="noreferrer">[View on Flipp]</a></>
                                            ) : null}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
