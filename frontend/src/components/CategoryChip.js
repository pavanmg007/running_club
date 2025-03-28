import React, { memo } from 'react';
import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';

const CategoryChip = memo(({ category, isParticipated, handleParticipate, isLoading }) => {
    console.log(`Rendering Chip for ${category.name}`);
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
        >
            <Chip
                label={`${category.name}`}
                onClick={() => !isParticipated && handleParticipate(category.id)}
                disabled={isLoading || isParticipated}
                icon={isParticipated ? <CheckCircleIcon color="white" /> : null}
                sx={{
                    bgcolor: isParticipated ? '#4CAF50' : '#2E7D32',
                    color: 'white',
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    px: 2,
                    mx: 1,
                    py: 2.5,
                    borderRadius: 20,
                    '&:hover': {
                        bgcolor: isParticipated ? '#388E3C' : '#1B5E20',
                        cursor: isParticipated ? 'default' : 'pointer',
                    },
                }}
            />
        </motion.div>
    );
});

export default CategoryChip;
