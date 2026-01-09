import { useEffect, useState } from 'react';
import './SaveModal.css';
import { apiRequest } from '../../api/api';

interface SaveModalProps {
    carName: string;

    isOpen: boolean;
    onClose: () => void;
    onSave: (country: string) => void;
}

const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose, onSave }) => {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [isAddingNewBrand, setIsAddingNewBrand] = useState(false);
    const [isAddingNewModel, setIsAddingNewModel] = useState(false);
    const [newBrandName, setNewBrandName] = useState('');
    const [newModelName, setNewModelName] = useState('');
    const [isSavingBrand, setIsSavingBrand] = useState(false);
    const [isSavingModel, setIsSavingModel] = useState(false);
    const [isLoadingCountries, setIsLoadingCountries] = useState(false);
    const [isLoadingBrands, setIsLoadingBrands] = useState(false);
    const [isLoadingModels, setIsLoadingModels] = useState(false);

    const [countries, setCountries] = useState<string[]>([
        'Germany',
        'Austria',
        'UK',
        "Hong Kong",
    ]);

    const handleSave = () => {
        if (!selectedCountry) {
            alert('Please select a country');
            return;
        }
        if (!selectedBrand) {
            alert('Please select a brand');
            return;
        }
        if (!selectedModel) {
            alert('Please select a model');
            return;
        }
        onSave(selectedCountry);
        setSelectedCountry('');
        setSelectedBrand('');
        setSelectedModel('');
    };

    const handleClose = () => {
        setSelectedCountry('');
        setSelectedBrand('');
        setSelectedModel('');
        setIsAddingNewBrand(false);
        setIsAddingNewModel(false);
        setNewBrandName('');
        setNewModelName('');
        onClose();
    };

    if (!isOpen) return null;

    const getData = async () => {
        try {
            setIsLoadingCountries(true);
            const response = await apiRequest({
                method: 'GET',
                url: '/api/v1/countries/newLeasingCountryWiseLists'
            });
            // Update countries if API returns data
            if (response.data && Array.isArray(response.data)) {
                setCountries(response.data);
            }
        } catch (error) {
            console.error('Error loading countries:', error);
        } finally {
            setIsLoadingCountries(false);
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const [brands, setBrands] = useState<{ _id: string; name: string }[]>([]);
    const [models, setModels] = useState<{ _id: string; name: string }[]>([]);

    const getBrands = async (countryName: string) => {
        try {
            setIsLoadingBrands(true);
            const response = await apiRequest({
                method: 'GET',
                url: `/api/v1/comparison-tool/get-country-wise-brands?countryName=${countryName}`
            });
            console.log("🚀 ~ getBrands ~ response:", response);
            setBrands(response.data || []);
        } catch (error) {
            console.error('Error loading brands:', error);
            setBrands([]);
        } finally {
            setIsLoadingBrands(false);
        }
    }

    const getModels = async (countryId: string, brandId: string) => {
        try {
            setIsLoadingModels(true);
            const response = await apiRequest({
                method: 'GET',
                url: `/api/v1/comparison-tool/get-brand-models?countryId=${countryId}&brandId=${brandId}`
            });
            console.log("🚀 ~ getModels ~ response:", response);
            setModels(response.data || []);
        } catch (error) {
            console.error('Error loading models:', error);
            setModels([]);
        } finally {
            setIsLoadingModels(false);
        }
    }

    const onSelectCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(e.target.value);
        setSelectedBrand('');
        setSelectedModel('');
        setIsAddingNewBrand(false);
        setIsAddingNewModel(false);
        getBrands(e.target.value);
    }

    const onSelectBrand = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === '__add_new__') {
            setIsAddingNewBrand(true);
            setSelectedBrand('');
            setNewBrandName('');
        } else {
            setIsAddingNewBrand(false);
            setSelectedBrand(value);
            setSelectedModel('');
            setIsAddingNewModel(false);

            // Get the brand ID from brands array
            const selectedBrandObj = brands.find(b => b.name === value);
            if (selectedBrandObj) {
                getModels(selectedCountry, selectedBrandObj._id);
            }
        }
    }

    const onSelectModel = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === '__add_new__') {
            setIsAddingNewModel(true);
            setSelectedModel('');
            setNewModelName('');
        } else {
            setIsAddingNewModel(false);
            setSelectedModel(value);
        }
    }

    const handleSaveNewBrand = async () => {
        if (!newBrandName.trim()) {
            alert('Please enter a brand name');
            return;
        }

        try {
            setIsSavingBrand(true);

            // Call API to save new brand
            const response = await apiRequest({
                method: 'POST',
                url: '/api/v1/comparison-tool/add-new-country-wise-brand',
                data: {
                    countryName: selectedCountry,
                    brandName: newBrandName.trim(),
                },
            });

            console.log('New brand saved:', response);

            // Add new brand to the list
            const newBrand = {
                _id: response.data._id,
                name: newBrandName.trim(),
            };

            setBrands(prev => [...prev, newBrand]);
            setSelectedBrand(newBrand.name);
            setIsAddingNewBrand(false);
            setNewBrandName('');
        } catch (error) {
            console.error('Error saving brand:', error);
        } finally {
            setIsSavingBrand(false);
        }
    };

    const handleCancelNewBrand = () => {
        setIsAddingNewBrand(false);
        setNewBrandName('');
    };

    const handleSaveNewModel = async () => {
        if (!newModelName.trim()) {
            alert('Please enter a model name');
            return;
        }

        try {
            setIsSavingModel(true);

            // Get the brand ID
            const selectedBrandObj = brands.find(b => b.name === selectedBrand);
            if (!selectedBrandObj) {
                throw new Error('Brand not found');
            }

            // Call API to save new model
            const response = await apiRequest({
                method: 'POST',
                url: '/api/v1/comparison-tool/add-model',
                data: {
                    countryName: selectedCountry,
                    brandId: selectedBrandObj._id,
                    modelName: newModelName.trim(),
                },
            });

            console.log('New model saved:', response);

            // Add new model to the list
            const newModel = {
                _id: response.data._id,
                name: newModelName.trim(),
            };

            setModels(prev => [...prev, newModel]);
            setSelectedModel(newModel.name);
            setIsAddingNewModel(false);
            setNewModelName('');
        } catch (error) {
            console.error('Error saving model:', error);
        } finally {
            setIsSavingModel(false);
        }
    };

    const handleCancelNewModel = () => {
        setIsAddingNewModel(false);
        setNewModelName('');
    };

    return (
        <div className="save-modal-overlay" onClick={handleClose}>
            <div className="save-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="save-modal-header">
                    <h2>Save Table Data</h2>
                    <button className="save-modal-close" onClick={handleClose}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="save-modal-body">
                    <p className="save-modal-description">
                        Select a country to save the current table data in JSON format.
                    </p>

                    <div className='flex gap-3'>
                        <div className="save-modal-field">
                            <label htmlFor="country-select">Country</label>
                            <select
                                id="country-select"
                                value={selectedCountry}
                                onChange={onSelectCountry}
                                className="save-modal-select"
                                disabled={isLoadingCountries}
                            >
                                <option value="">
                                    {isLoadingCountries ? '-- Loading countries... --' : '-- Select a country --'}
                                </option>
                                {!isLoadingCountries && countries.map((country) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="save-modal-field">
                            <label htmlFor="car-select">Car</label>
                            {!isAddingNewBrand ? (
                                <select
                                    id="car-select"
                                    value={selectedBrand}
                                    onChange={onSelectBrand}
                                    className="save-modal-select"
                                    disabled={!selectedCountry || isLoadingBrands}
                                >
                                    <option value="">
                                        {isLoadingBrands ? '-- Loading brands... --' : '-- Select a car --'}
                                    </option>
                                    {!isLoadingBrands && brands.map((brand) => (
                                        <option key={brand._id} value={brand.name}>
                                            {brand.name}
                                        </option>
                                    ))}
                                    {!isLoadingBrands && <option value="__add_new__">+ Add New Brand</option>}
                                </select>
                            ) : (
                                <div className="new-brand-input-container">
                                    <input
                                        type="text"
                                        value={newBrandName}
                                        onChange={(e) => setNewBrandName(e.target.value)}
                                        placeholder="Enter new brand name"
                                        className="save-modal-select"
                                        autoFocus
                                        disabled={isSavingBrand}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSaveNewBrand();
                                            }
                                        }}
                                    />
                                    <div className="new-brand-actions">
                                        <button
                                            onClick={handleSaveNewBrand}
                                            className="icon-btn icon-btn-check p-0"
                                            disabled={isSavingBrand || !newBrandName.trim()}
                                            title="Save brand"
                                        >
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={handleCancelNewBrand}
                                            className="icon-btn icon-btn-cross p-0"
                                            disabled={isSavingBrand}
                                            title="Cancel"
                                        >
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="save-modal-field">
                            <label htmlFor="model-select">Car Model</label>
                            {!isAddingNewModel ? (
                                <select
                                    id="model-select"
                                    value={selectedModel}
                                    onChange={onSelectModel}
                                    className="save-modal-select"
                                    disabled={!selectedBrand || isLoadingModels}
                                >
                                    <option value="">
                                        {isLoadingModels ? '-- Loading models... --' : '-- Select a model --'}
                                    </option>
                                    {!isLoadingModels && models.map((model) => (
                                        <option key={model._id} value={model.name}>
                                            {model.name}
                                        </option>
                                    ))}
                                    {!isLoadingModels && <option value="__add_new__">+ Add New Model</option>}
                                </select>
                            ) : (
                                <div className="new-brand-input-container">
                                    <input
                                        type="text"
                                        value={newModelName}
                                        onChange={(e) => setNewModelName(e.target.value)}
                                        placeholder="Enter new model name"
                                        className="save-modal-select"
                                        autoFocus
                                        disabled={isSavingModel}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSaveNewModel();
                                            }
                                        }}
                                    />
                                    <div className="new-brand-actions">
                                        <button
                                            onClick={handleSaveNewModel}
                                            className="icon-btn icon-btn-check p-0"
                                            disabled={isSavingModel || !newModelName.trim()}
                                            title="Save model"
                                        >
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={handleCancelNewModel}
                                            className="icon-btn icon-btn-cross p-0"
                                            disabled={isSavingModel}
                                            title="Cancel"
                                        >
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="save-modal-footer">
                    <button className="save-modal-btn save-modal-btn-cancel" onClick={handleClose}>
                        Cancel
                    </button>
                    <button
                        className="save-modal-btn save-modal-btn-save"
                        onClick={handleSave}
                        disabled={!selectedCountry || !selectedBrand || !selectedModel}
                    >
                        Save Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaveModal;
