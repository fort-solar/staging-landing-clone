import React from 'react'

export const SquarePlay = ({className}: {className?: string}) => {
    return (
        <svg className={className} width="50" height="50" viewBox="75 60 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
           <g filter="url(#filter0_d_250_868)" data-figma-bg-blur-radius="26">
                <rect x="75" y="60" width="58" height="58" rx="19" fill="white" fill-opacity="0.09" shape-rendering="crispEdges" />
                <rect x="76" y="61" width="56" height="56" rx="18" stroke="white" strokeWidth="2" shape-rendering="crispEdges" />
            </g>
            <path d="M99.4387 84.1914C99.4387 82.6206 101.166 81.6628 102.498 82.4951L111.008 87.8135C112.261 88.5968 112.261 90.4217 111.008 91.2051L102.498 96.5244C101.166 97.3565 99.4388 96.3988 99.4387 94.8281V84.1914Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
                <filter id="filter0_d_250_868" x="0" y="0" width="208" height="208" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="15" />
                    <feGaussianBlur stdDeviation="37.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.107338 0 0 0 0 0.0977778 0 0 0 0 0.266667 0 0 0 0.3 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_250_868" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_250_868" result="shape" />
                </filter>
                <clipPath id="bgblur_0_250_868_clip_path" transform="translate(0 0)"><rect x="75" y="60" width="58" height="58" rx="19" />
                </clipPath></defs>
        </svg>

    )
}
