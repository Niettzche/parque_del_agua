import React from 'react';
import { POIType } from '../../types';

// Fix: Define a common props type for icons to allow `style` and other SVG attributes.
type IconProps = React.SVGAttributes<SVGElement>;

const IconWrapper: React.FC<{ children: React.ReactNode } & IconProps> = ({ children, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="none" {...props}>
    {children}
  </svg>
);

const RestroomIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M12 2C9.243 2 7 4.243 7 7v10h2V7c0-1.654 1.346-3 3-3s3 1.346 3 3v10h2V7c0-2.757-2.243-5-5-5z" />
    <circle cx="9" cy="4.5" r="1.5" />
    <circle cx="15" cy="4.5" r="1.5" />
    <path d="M7 18h10v2H7z" />
  </IconWrapper>
);

const FirstAidIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1 15H9v-2h2v-2H9v-2h2V9H9V7h4v2h-2v2h2v2h-2v2h2v2z" />
  </IconWrapper>
);

const ExitIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M16 13v-2h-6v-2h6V7l4 4-4 4zM4 18h8v-2H4V6h8V4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2z" />
  </IconWrapper>
);

const AssemblyPointIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9v-2h2v2zm0-4H9V6h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V6h2v2z" />
  </IconWrapper>
);

const TicketIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
  </IconWrapper>
);

const LockerIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H6zm0 2h5v16H6V4zm7 0h5v8h-5V4zm0 10h5v6h-5v-6z" />
    <circle cx="15.5" cy="17.5" r="1.5" />
    <circle cx="8.5" cy="7.5" r="1.5" />
  </IconWrapper>
);

const FoodIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-8.97C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5V8H21V2h-5v4z" />
  </IconWrapper>
);

const WaterIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm-2 18h4v2h-4v-2z" />
  </IconWrapper>
);

const RechargeIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M15.5 13.5c-1.09 0-2.1.45-2.83 1.22l-1.06-1.06 1.07-1.07-1.06-1.06-1.07 1.07-1.06-1.06-2.12 2.12 1.06 1.06 1.07-1.07 1.06 1.06-1.07 1.07 3.18 3.18c.76-.73 1.22-1.74 1.22-2.83zm-1.5-3.5L12 8l-2 2 2 2 2-2zM9 22c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
  </IconWrapper>
);

const DefaultIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <circle cx="12" cy="12" r="8" />
    </IconWrapper>
);


export const getIcon = (type: POIType | string): React.FC<IconProps> => {
  switch (type) {
    case 'banos':
    case 'iso7001_restroom':
      return RestroomIcon;
    case 'enfermeria':
    case 'iso7001_firstaid':
      return FirstAidIcon;
    case 'salida':
    case 'iso7001_exit':
      return ExitIcon;
    case 'reunion':
      return AssemblyPointIcon;
    case 'taquilla':
      return TicketIcon;
    case 'lockers':
      return LockerIcon;
    case 'comida':
      return FoodIcon;
    case 'agua':
      return WaterIcon;
    case 'recarga':
      return RechargeIcon;
    default:
      return DefaultIcon;
  }
};
