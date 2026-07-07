import React from 'react'

export const PlayIcon = ({className}: {className?: string}) => {
    return (
        <svg className={className} width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="95" height="95" rx="47.5" stroke="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M32 31.0735C32 27.2705 36.0773 24.8597 39.4096 26.6924L70.1845 43.6186C73.6384 45.5183 73.6383 50.4812 70.1845 52.3808L39.4096 69.307C36.0773 71.1397 32 68.7289 32 64.9259V31.0735Z" fill="white" />
        </svg>
    )
}
