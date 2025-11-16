import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from './Modal.tsx';
import { guides, GuideStep } from './guides.ts';

const getPageKeyFromPathname = (pathname: string): string | null => {
    const route = pathname.split('/')[1];
    if (!route) return 'dashboard';
    if (route === 'portfolio') return 'portfolio';
    if (['dashboard', 'transactions', 'nft', 'markets'].includes(route)) {
        return route;
    }
    if (route === 'profile') return 'settings';
    return null;
};

const Guide: React.FC = () => {
    const location = useLocation();
    const [pageKey, setPageKey] = useState<string | null>(null);
    const [guideSteps, setGuideSteps] = useState<GuideStep[]>([]);
    
    const [showButton, setShowButton] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Determine the current page and its guide
    useEffect(() => {
        const key = getPageKeyFromPathname(location.pathname);
        setPageKey(key);
        if (key && guides[key]) {
            setGuideSteps(guides[key]);
        } else {
            setGuideSteps([]);
        }
    }, [location.pathname]);

    // Check if the guide for the current page has been viewed
    useEffect(() => {
        if (pageKey) {
            const guideViewed = localStorage.getItem(`prism_guide_viewed_${pageKey}`);
            if (!guideViewed && guideSteps.length > 0) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        } else {
            setShowButton(false);
        }
        // Reset modal state on page change
        setIsModalOpen(false);
        setCurrentStep(0);
    }, [pageKey, guideSteps]);

    const handleButtonClick = () => {
        if (pageKey) {
            localStorage.setItem(`prism_guide_viewed_${pageKey}`, 'true');
        }
        setShowButton(false);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentStep(0);
    };
    
    const goToNextStep = () => {
        if (currentStep < guideSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleCloseModal();
        }
    };
    
    const goToPrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    if (!showButton && !isModalOpen) {
        return null;
    }

    const stepData = guideSteps[currentStep];

    if (!stepData) {
        return null;
    }

    const { icon: Icon, title, content } = stepData;

    return (
        <>
            {showButton && (
                <button
                    onClick={handleButtonClick}
                    className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-full font-semibold hover:bg-accent-hover transition-all duration-300 shadow-lg transform hover:scale-105"
                    style={{ animation: 'pulse-glow 3s infinite ease-in-out' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>Page Guide</span>
                </button>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`Page Guide (${currentStep + 1}/${guideSteps.length})`}>
                <div className="text-center">
                     <div className="w-16 h-16 mx-auto mb-4 text-accent bg-secondary rounded-full flex items-center justify-center p-2">
                        <Icon className="w-10 h-10" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm mb-6 min-h-[60px]">{content}</p>

                    <div className="flex justify-between items-center">
                        <button
                            onClick={goToPrevStep}
                            disabled={currentStep === 0}
                            className="bg-secondary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Back
                        </button>
                        
                         <div className="flex items-center gap-2">
                            {guideSteps.map((_, index) => (
                                <div key={index} className={`w-2 h-2 rounded-full transition-colors ${currentStep === index ? 'bg-accent' : 'bg-secondary'}`}></div>
                            ))}
                        </div>

                        <button
                            onClick={goToNextStep}
                            className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-accent-hover transition-colors"
                        >
                            {currentStep === guideSteps.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Guide;
