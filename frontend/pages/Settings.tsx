import React, { useState, useEffect } from 'react';
import Header from '../components/Header.tsx';
import { useToast } from '../hooks/useToast.ts';
import Modal from '../components/Modal.tsx';
import { TrashIcon, ExpandMoreIcon } from '../components/icons/DetailIcons.tsx';
import { useWallets } from '../contexts/WalletContext.tsx';
import { useProfile } from '../contexts/ProfileContext.tsx';
import { CHAINS } from '../constants.ts';

interface Wallet {
    id: number;
    name: string;
    address: string;
    chain: string;
}

const SettingsSection: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; }> = ({ title, children, isOpen, onToggle }) => (
    <div className="bg-card border border-border rounded-3xl mb-8 backdrop-blur-lg">
        <button
            onClick={onToggle}
            className={`w-full flex items-center justify-between p-6 text-left transition-colors ${isOpen ? 'border-b border-border' : ''}`}
            aria-expanded={isOpen}
            aria-controls={`section-content-${title.replace(/\s+/g, '-')}`}
        >
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <ExpandMoreIcon className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div 
            id={`section-content-${title.replace(/\s+/g, '-')}`}
            className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        >
            <div className="overflow-hidden">
                <div className="p-6 space-y-6">
                    {children}
                </div>
            </div>
        </div>
    </div>
);

const InputField: React.FC<{ label: string; type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; name?: string }> = ({ label, type, value, onChange, placeholder, name }) => (
    <div>
        <label className="text-sm font-medium text-gray-400 block mb-2">{label}</label>
        <input 
            type={type} 
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-secondary border border-border rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
        />
    </div>
);

const ToggleSwitch: React.FC<{ label: string, enabled: boolean, onChange: (enabled: boolean) => void, disabled?: boolean }> = ({ label, enabled, onChange, disabled }) => (
    <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${disabled ? 'text-gray-500' : 'text-gray-300'}`}>{label}</span>
        <button
            onClick={() => !disabled && onChange(!enabled)}
            disabled={disabled}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-accent' : 'bg-secondary'} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);


const Settings: React.FC = () => {
    const { addToast } = useToast();
    const { wallets, addWallet, removeWallet } = useWallets();
    const { profile, saveProfile } = useProfile();

    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isAddWalletModalOpen, setIsAddWalletModalOpen] = useState(false);
    const [newWalletName, setNewWalletName] = useState('');
    const [newWalletAddress, setNewWalletAddress] = useState('');
    const [newWalletChain, setNewWalletChain] = useState('ethereum');
    const [walletToRemove, setWalletToRemove] = useState<Wallet | null>(null);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({ 'Wallet Management': true });
    
    const [localProfile, setLocalProfile] = useState({ fullName: '', username: '', email: '' });

    useEffect(() => {
        if (profile) {
            setLocalProfile(profile);
        }
    }, [profile]);

    const toggleSection = (title: string) => {
        setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalProfile({ ...localProfile, [e.target.name]: e.target.value });
    };

    const handleSaveChanges = async () => {
        try {
            await saveProfile(localProfile);
            addToast({ type: 'success', title: 'Settings Saved', message: 'Your preferences have been successfully updated.' });
        } catch (error) {
            addToast({ type: 'error', title: 'Error', message: 'Failed to save settings.' });
        }
    };

    const handleAddWallet = () => {
        addWallet(newWalletName, newWalletAddress, newWalletChain);
        setNewWalletName('');
        setNewWalletAddress('');
        setNewWalletChain('ethereum');
        setIsAddWalletModalOpen(false);
    };

    const handleRemoveWallet = () => {
        if (walletToRemove) {
            removeWallet(walletToRemove.id);
            setWalletToRemove(null);
        }
    };

    return (
    <>
        <div>
            <Header title="Settings" />
            <div className="max-w-4xl mx-auto">
                
                <SettingsSection title="Appearance" isOpen={!!openSections['Appearance']} onToggle={() => toggleSection('Appearance')}>
                    <ToggleSwitch label="Dark Mode" enabled={isDarkMode} onChange={() => {}} disabled />
                    <p className="text-xs text-gray-500 -mt-4">The app is currently in dark mode. Light mode is coming soon!</p>
                </SettingsSection>
                
                <SettingsSection title="Localization" isOpen={!!openSections['Localization']} onToggle={() => toggleSection('Localization')}>
                    <div>
                        <label className="text-sm font-medium text-gray-400 block mb-2">Display Currency</label>
                        <select defaultValue="USD" disabled className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent appearance-none disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}>
                            <option>USD - United States Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-2">Multi-currency support is coming soon.</p>
                    </div>
                </SettingsSection>

                <SettingsSection title="Wallet Management" isOpen={!!openSections['Wallet Management']} onToggle={() => toggleSection('Wallet Management')}>
                    <div className="space-y-3">
                        {wallets.map(wallet => (
                            <div key={wallet.id} className="flex items-center justify-between bg-secondary p-3 rounded-xl">
                                <div>
                                    <p className="font-semibold text-white">{wallet.name}</p>
                                    <p className="text-sm text-gray-400 font-mono">{wallet.address}</p>
                                </div>
                                <button onClick={() => setWalletToRemove(wallet)} className="p-2 rounded-full text-gray-400 hover:bg-card hover:text-red-400 transition-colors" aria-label={`Remove ${wallet.name}`}>
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setIsAddWalletModalOpen(true)} className="w-full text-center mt-4 bg-secondary border border-dashed border-border rounded-xl py-2 text-sm font-semibold text-gray-300 hover:bg-card hover:border-accent transition-colors">
                        Add New Wallet
                    </button>
                </SettingsSection>

                <SettingsSection title="Profile Information" isOpen={!!openSections['Profile Information']} onToggle={() => toggleSection('Profile Information')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Full Name" type="text" name="fullName" value={localProfile.fullName} onChange={handleProfileChange} />
                        <InputField label="Username" type="text" name="username" value={localProfile.username} onChange={handleProfileChange} />
                    </div>
                    <InputField label="Email Address" type="email" name="email" value={localProfile.email} onChange={handleProfileChange} />
                </SettingsSection>
                
                <div className="flex justify-end mt-4">
                    <button 
                        onClick={handleSaveChanges}
                        className="bg-accent text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent-hover transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
        
        <Modal isOpen={isAddWalletModalOpen} onClose={() => setIsAddWalletModalOpen(false)} title="Add New Wallet">
            <div className="space-y-4">
                <p className="text-sm text-gray-400">Enter a name and address for your new wallet.</p>
                <InputField 
                    label="Wallet Name"
                    type="text" 
                    value={newWalletName}
                    onChange={(e) => setNewWalletName(e.target.value)}
                    placeholder="e.g., Savings Wallet"
                />
                <InputField 
                    label="Wallet Address"
                    type="text" 
                    value={newWalletAddress}
                    onChange={(e) => setNewWalletAddress(e.target.value)}
                    placeholder="0x..."
                />
                <div>
                    <label className="text-sm font-medium text-gray-400 block mb-2">Chain</label>
                    <select value={newWalletChain} onChange={(e) => setNewWalletChain(e.target.value)} className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}>
                        {CHAINS.map(chain => (
                            <option key={chain.id} value={chain.id}>{chain.name}</option>
                        ))}
                    </select>
                </div>
                 <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setIsAddWalletModalOpen(false)} className="bg-secondary text-white px-4 py-2 rounded-xl font-semibold hover:bg-card transition-colors">Cancel</button>
                    <button onClick={handleAddWallet} className="bg-accent text-white px-4 py-2 rounded-xl font-semibold hover:bg-accent-hover transition-colors">Add Wallet</button>
                </div>
            </div>
        </Modal>

        <Modal isOpen={!!walletToRemove} onClose={() => setWalletToRemove(null)} title={`Remove ${walletToRemove?.name}?`}>
            <div className="space-y-6">
                <p className="text-sm text-gray-400">Are you sure you want to remove this wallet? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setWalletToRemove(null)} className="bg-secondary text-white px-4 py-2 rounded-xl font-semibold hover:bg-card transition-colors">Cancel</button>
                    <button onClick={handleRemoveWallet} className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors">Remove</button>
                </div>
            </div>
        </Modal>
    </>
    );
};

export default Settings;