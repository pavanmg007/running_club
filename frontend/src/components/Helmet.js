import { useEffect } from 'react';

const Helmet = ({ title, description, url }) => {
    useEffect(() => {
        // Update document title
        document.title = title ? `${title} | Runaರಂಗ Running Club` : 'Runaರಂಗ Running Club';

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description || 'Join Runaರಂಗ Running Club for organized marathons, community runs, and exclusive running events.');
        }

        // Update OpenGraph and Twitter meta tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const twitterTitle = document.querySelector('meta[property="twitter:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const twitterDesc = document.querySelector('meta[property="twitter:description"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');
        const twitterUrl = document.querySelector('meta[name="twitter:url"]');
        

        if (ogTitle) ogTitle.setAttribute('content', title ? `${title} | Runaರಂಗ Running Club` : 'Runaರಂಗ Running Club');
        if (twitterTitle) twitterTitle.setAttribute('content', title ? `${title} | Runaರಂಗ Running Club` : 'Runaರಂಗ Running Club');
        if (ogDesc) ogDesc.setAttribute('content', description || 'Join Runaರಂಗ Running Club for organized marathons, community runs, and exclusive running events.');
        if (twitterDesc) twitterDesc.setAttribute('content', description || 'Join Runaರಂಗ Running Club for organized marathons, community runs, and exclusive running events.');
        if (ogUrl) ogUrl.setAttribute('content', url || 'https://runaranga.com');
        if (twitterUrl) twitterUrl.setAttribute('content', url || 'https://runaranga.com');
    }, [title, description]);

    return null;
};

export default Helmet;