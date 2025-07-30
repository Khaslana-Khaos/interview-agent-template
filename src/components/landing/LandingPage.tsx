"use client";

import React, { useState } from 'react';
import Login from '../auth/Login';
import Signup from '../auth/Signup';
import './landing.scss';

const LandingPage: React.FC = () => {
    const [currentView, setCurrentView] = useState<'login' | 'signup'>('login');

    const handleSwitchToSignup = () => {
        setCurrentView('signup');
    };

    const handleSwitchToLogin = () => {
        setCurrentView('login');
    };

    return (
        <div className="landing-page">
            <div className="landing-background">
                <div className="floating-elements">
                    <div className="floating-element element-1"></div>
                    <div className="floating-element element-2"></div>
                    <div className="floating-element element-3"></div>
                </div>
            </div>

            <div className="landing-content">
                <div className="landing-hero">
                    <h1 className="hero-title">ZENO AI</h1>
                    <p className="hero-subtitle">
                        Master any language with your AI-powered speaking coach
                    </p>
                </div>

                <div className="auth-section">
                    {currentView === 'login' ? (
                        <Login onSwitchToSignup={handleSwitchToSignup} />
                    ) : (
                        <Signup onSwitchToLogin={handleSwitchToLogin} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default LandingPage; 