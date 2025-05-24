import React from 'react';

interface PlaceholderProps {
  width?: string;
  height?: string;
  name: string;
  role: string;
  color?: string;
  bgColor?: string;
}

// A simple placeholder component to use before real photos are available
export const TeamMemberPlaceholder: React.FC<PlaceholderProps> = ({
  width = '100%',
  height = '300px',
  name,
  role,
  color = '#ffffff',
  bgColor = '#0F172A',
}) => {
  // Get initials from name
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('');

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: bgColor,
        color,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
        }}
      >
        {initials}
      </div>
      <div
        style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '0 1rem',
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontSize: '1rem',
          opacity: 0.8,
          marginTop: '0.5rem',
        }}
      >
        {role}
      </div>
    </div>
  );
};

// Export specific placeholders for each team member
export const leePlaceholder = () => (
  <TeamMemberPlaceholder 
    name="Lee Rogers" 
    role="Lead Accountant" 
    bgColor="#0F172A" 
  />
);

export const henryPlaceholder = () => (
  <TeamMemberPlaceholder 
    name="Henry Simons" 
    role="Manager" 
    bgColor="#0F172A" 
  />
);

export const jackiePlaceholder = () => (
  <TeamMemberPlaceholder 
    name="Jackie Bosch" 
    role="Assistant Accountant" 
    bgColor="#0F172A" 
  />
);

export const joyPlaceholder = () => (
  <TeamMemberPlaceholder 
    name="Joy Holloway" 
    role="Business Administrator" 
    bgColor="#0F172A" 
  />
);

export const mannyPlaceholder = () => (
  <TeamMemberPlaceholder 
    name="Manny Abayomi" 
    role="Digital Marketing Executive" 
    bgColor="#0F172A" 
  />
);