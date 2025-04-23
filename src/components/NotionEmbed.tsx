import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

interface StyledNotionEmbedProps {
  embedUrl: string;
  defaultHeight?: string;
  minHeight?: string;
  title?: string;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

const StyledNotionEmbed = ({ 
  embedUrl, 
  defaultHeight = '600px',
  minHeight = '300px',
  title = 'Notion Page',
  theme = 'light', // 'light', 'dark', or 'auto'
  className = ''
}: StyledNotionEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  // Removed unused windowWidth state
  const [iframeHeight, setIframeHeight] = useState(defaultHeight);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle window resize
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      // Removed setWindowWidth call as windowWidth is no longer used
      adjustHeight();
    };

    const adjustHeight = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      
      // Maintain a reasonable aspect ratio based on container width
      if (containerWidth < 480) {
        setIframeHeight('450px');
      } else if (containerWidth < 768) {
        setIframeHeight('550px');
      } else if (containerWidth < 1024) {
        setIframeHeight('650px');
      } else {
        setIframeHeight(defaultHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    adjustHeight(); // Initial adjustment
    
    return () => window.removeEventListener('resize', handleResize);
  }, [defaultHeight]);

  // Determine theme-based styling
  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        backgroundColor: '#1e1e1e',
        loadingBackground: '#2d2d2d',
        loadingText: '#e0e0e0',
        loadingSpinner: '#6e6e6e',
        spinnerHighlight: '#2196f3',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
      };
    }
    return {
      backgroundColor: '#ffffff',
      loadingBackground: '#f5f5f7',
      loadingText: '#333333',
      loadingSpinner: '#e0e0e0',
      spinnerHighlight: '#2196f3',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
    };
  };

  const themeStyles = getThemeStyles();

  return (
    <div 
      ref={containerRef}
      className={`notion-embed-wrapper ${className}`}
      style={{
        width: '100%',
        margin: '0 auto',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: themeStyles.backgroundColor,
        transition: 'all 0.3s ease',
        boxShadow: themeStyles.boxShadow,
      }}
    >
      {isLoading && (
        <div 
          className="notion-loading"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            height: iframeHeight,
            minHeight: minHeight,
            backgroundColor: themeStyles.loadingBackground,
            color: themeStyles.loadingText,
            borderRadius: '12px',
          }}
        >
          <div 
            className="notion-loading-spinner"
            style={{
              border: `4px solid ${themeStyles.loadingSpinner}`,
              borderTop: `4px solid ${themeStyles.spinnerHighlight}`,
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'notionSpin 1s linear infinite',
              marginBottom: '1rem',
            }}
          />
          <p style={{ margin: 0, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            Loading Notion content...
          </p>
        </div>
      )}
      
      <div 
        className="notion-embed-container"
        style={{
          position: 'relative',
          width: '100%',
          height: iframeHeight,
          minHeight: minHeight,
          overflow: 'hidden',
          borderRadius: '12px',
        }}
      >
        <iframe
          src={embedUrl}
          title={title}
          width="100%"
          height="100%"
          frameBorder="0"
          onLoad={() => {
            // Add a small delay to ensure smooth transition
            setTimeout(() => setIsLoading(false), 300);
          }}
          style={{
            border: 'none',
            borderRadius: '12px',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out',
          }}
          allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi"
          allowFullScreen
        />
      </div>
      
      <style>{`
        @keyframes notionSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 480px) {
          .notion-embed-wrapper {
            border-radius: 8px;
            margin: 0.5rem 0;
          }
        }
        
        @media (max-width: 768px) {
          .notion-embed-wrapper {
            margin: 1rem 0;
          }
        }
      `}</style>
    </div>
  );
};

StyledNotionEmbed.propTypes = {
  embedUrl: PropTypes.string.isRequired,
  defaultHeight: PropTypes.string,
  minHeight: PropTypes.string,
  title: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark', 'auto']),
  className: PropTypes.string
};

export default StyledNotionEmbed;