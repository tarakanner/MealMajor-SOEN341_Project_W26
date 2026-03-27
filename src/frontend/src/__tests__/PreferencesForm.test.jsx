import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PreferencesForm from '../components/PreferencesForm';
import * as preferencesService from '../services/preferencesService';

jest.mock('../services/preferencesService');

describe('PreferencesForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn(() => 'mockUserId');
  });

  test('loads existing preferences on mount', async () => {
    preferencesService.getPreferences.mockResolvedValueOnce({
      dietaryRestrictions: ['vegan', 'gluten-free'],
      allergies: ['Peanuts', 'Tree Nuts']
    });

    render(<PreferencesForm />);

    // Wait for data load
    await waitFor(() => {
      expect(screen.getByText('Update your preferences')).toBeInTheDocument();
    });

    // Check if vegan, gluten-free, peanuts, treenuts are checked
    expect(screen.getByLabelText(/Vegan/i)).toBeChecked();
    expect(screen.getByLabelText(/Gluten-Free/i)).toBeChecked();
    expect(screen.getByLabelText(/Peanuts/i)).toBeChecked();
    expect(screen.getByLabelText(/Tree Nuts/i)).toBeChecked();

    // Check if something else is not checked
    expect(screen.getByLabelText(/Dairy/i)).not.toBeChecked();
    expect(screen.getByLabelText(/Vegetarian/i)).not.toBeChecked();
  });

  test('saves new preferences successfully', async () => {
    preferencesService.getPreferences.mockRejectedValueOnce(new Error('Not found'));
    preferencesService.createPreferences.mockResolvedValueOnce({});

    render(<PreferencesForm />);

    await waitFor(() => {
      expect(screen.getByText('One last Step!')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText(/Vegetarian/i));
    fireEvent.click(screen.getByLabelText(/Dairy/i));
    
    // Test custom allergy
    fireEvent.click(screen.getByLabelText(/Other/i));
    fireEvent.change(screen.getByPlaceholderText(/Enter Allergy/i), { target: { value: 'Soy' } });

    fireEvent.click(screen.getByRole('button', { name: /Save Preferences/i }));

    await waitFor(() => {
      expect(preferencesService.createPreferences).toHaveBeenCalledWith(
        'mockUserId',
        ['vegetarian'],
        ['Dairy', 'Soy'],
        'Soy'
      );
      expect(screen.getByText('Preferences saved successfully!')).toBeInTheDocument();
    });
  });

  test('displays error if saving fails', async () => {
    preferencesService.getPreferences.mockRejectedValueOnce(new Error('Not found'));
    preferencesService.createPreferences.mockRejectedValueOnce(new Error('API Down'));

    render(<PreferencesForm />);

    await waitFor(() => {
      expect(screen.getByText('One last Step!')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Save Preferences/i }));

    await waitFor(() => {
      expect(screen.getByText('API Down')).toBeInTheDocument();
    });
  });
});
