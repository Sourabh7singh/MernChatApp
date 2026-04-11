import React from 'react';
import { Link } from 'react-router-dom';
import s from '../styles/NotFound.module.css';

const NotFound = () => {
    return (
        <div className={s.notFoundPage}>
            <div className={s.ambientBg} />
            <div className={s.grid} />
            <div className={s.sphere} />
            
            <div className={s.content}>
                <h1 className={s.errorCode}>404</h1>
                <h2 className={s.title}>Lost in Space?</h2>
                <p className={s.description}>
                    Oops! The page you're looking for has drifted into deep space. 
                    Let's get you back to the conversation.
                </p>
                <Link to="/" className={s.homeBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6"/>
                    </svg>
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
