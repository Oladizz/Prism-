import React, { useState } from 'react';
import Header from '../components/Header.tsx';
import { useToast } from '../hooks/useToast.ts';
import Modal from '../components/Modal.tsx';
import { TrashIcon, ExpandMoreIcon } from '../components/icons/DetailIcons.tsx';

interface Wallet {
    id: number;
    name: string;
    address: string;
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

const InputField: React.FC<{ label: string; type: string; value: string; placeholder?: string }> = ({ label, type, value, placeholder }) => (
    <div>
        <label className="text-sm font-medium text-gray-400 block mb-2">{label}</label>
        <input 
            type={type} 
            defaultValue={value}
            placeholder={placeholder}
            className="w-full bg-secondary border border-border rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
        />
    </div>
);

const ToggleSwitch: React.FC<{ label: string, enabled: boolean, onChange: (enabled: boolean) => void }> = ({ label, enabled, onChange }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <button
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-accent' : 'bg-secondary'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);


const Settings: React.FC = () => {
    const { addToast } = useToast();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [wallets, setWallets] = useState<Wallet[]>([
        { id: 1, name: 'Primary Wallet', address: '0x123...abc' },
        { id: 2, name: 'Trading Wallet', address: '0x456...def' },
        { id: 3, name: 'Staking Wallet', address: '0x789...ghi' },
    ]);
    const [isAddWalletModalOpen, setIsAddWalletModalOpen] = useState(false);
    const [newWalletName, setNewWalletName] = useState('');
    const [walletToRemove, setWalletToRemove] = useState<Wallet | null>(null);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    const toggleSection = (title: string) => {
        setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
    };

    const handleSaveChanges = () => {
        addToast({ type: 'success', title: 'Settings Saved', message: 'Your preferences have been successfully updated.' });
    };

    const handleAddWallet = () => {
        if (newWalletName.trim()) {
            const newWallet = {
                id: Date.now(),
                name: newWalletName,
                address: `0x...${crypto.randomUUID().slice(0, 3)}`
            };
            setWallets([...wallets, newWallet]);
            addToast({ type: 'success', title: 'Wallet Added', message: `${newWalletName} has been added.` });
            setNewWalletName('');
            setIsAddWalletModalOpen(false);
        } else {
            addToast({ type: 'error', title: 'Invalid Name', message: 'Please enter a valid wallet name.'});
        }
    };

    const handleRemoveWallet = () => {
        if (walletToRemove) {
            setWallets(wallets.filter(w => w.id !== walletToRemove.id));
            addToast({ type: 'success', title: 'Wallet Removed', message: `${walletToRemove.name} has been removed.` });
            setWalletToRemove(null);
        }
    };

    return (
    <>
        <div>
            <Header title="Settings" />
            <div className="max-w-4xl mx-auto">
                
                <SettingsSection title="Appearance" isOpen={!!openSections['Appearance']} onToggle={() => toggleSection('Appearance')}>
                    <ToggleSwitch label="Dark Mode" enabled={isDarkMode} onChange={setIsDarkMode} />
                    <p className="text-xs text-gray-500 -mt-4">Light mode is coming soon!</p>
                </SettingsSection>
                
                <SettingsSection title="Localization" isOpen={!!openSections['Localization']} onToggle={() => toggleSection('Localization')}>
                    <div>
                        <label className="text-sm font-medium text-gray-400 block mb-2">Display Currency</label>
                        <select defaultValue="USD" className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}>
                            <option>USD - United States Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                        </select>
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
                        <InputField label="Full Name" type="text" value="Satoshi Nakamoto" />
                        <InputField label="Username" type="text" value="satoshi" />
                    </div>
                    <InputField label="Email Address" type="email" value="satoshi@nakamoto.com" />
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
                <p className="text-sm text-gray-400">Enter a name for your new wallet.</p>
                <InputField label="Wallet Name" type="text" value={newWalletName} placeholder="e.g., Savings Wallet" />
                <input 
                    type="text" 
                    value={newWalletName}
                    onChange={(e) => setNewWalletName(e.target.value)}
                    placeholder="e.g., Savings Wallet"
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
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