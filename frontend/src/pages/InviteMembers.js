import React, { useState, useContext } from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert,
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { createInvitation, inviteMembers } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';

const InviteMembers = () => {
    const { user, token, logout } = useContext(AuthContext);
    if (!user || !token) {
        logout();
    }
    const [singleInviteCode, setSingleInviteCode] = useState('');
    const [singleInviteEmail, setSingleInviteEmail] = useState('');
    const [singleInviteResult, setSingleInviteResult] = useState(null);
    const [multipleInviteEmails, setMultipleInviteEmails] = useState('');
    const [multipleInviteResult, setMultipleInviteResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [singleInviteCodeError, setSingleInviteCodeError] = useState(null);
    const [multipleInviteCodeError, setMultipleInviteCodeError] = useState(null);

    const handleSingleInviteSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setSingleInviteCodeError(null);
        setSingleInviteResult(null);

        try {
            const response = await createInvitation({
                code: singleInviteCode,
                email: singleInviteEmail,
            });
            setSingleInviteResult(response.data);
        } catch (err) {
            setSingleInviteCodeError(err.response?.data?.error || 'Failed to create single invitation');
        } finally {
            setLoading(false);
        }
    };

    const handleMultipleInviteSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMultipleInviteCodeError(null);
        setMultipleInviteResult(null);

        const emails = multipleInviteEmails.split(',').map((email) => email.trim()).filter(Boolean);

        try {
            const response = await inviteMembers({ emails });
            setMultipleInviteResult(response.data);
        } catch (err) {
            setMultipleInviteCodeError(err.response?.data?.error || 'Failed to create multiple invitations');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" align="center" color='primary' gutterBottom>
                Invite Members
            </Typography>

            {/* Single Invite Section */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Create Single Invitation
                </Typography>

                <form onSubmit={handleSingleInviteSubmit}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                margin="normal" // Added margin
                                label="Invite Code"
                                value={singleInviteCode}
                                onChange={(e) => setSingleInviteCode(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                margin="normal" // Added margin
                                label="Email"
                                type="email"
                                value={singleInviteEmail}
                                onChange={(e) => setSingleInviteEmail(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 2 }}> {/* Added mt:2 */}
                                Create Invitation
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                {loading && <LoadingSpinner />}
                {singleInviteCodeError && <Alert severity="error" sx={{ mt: 2 }}>{singleInviteCodeError}</Alert>}
                {singleInviteResult && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Invitation Created:</Typography>
                        <List>
                            <ListItem>
                                <ListItemText primary={`Code: ${singleInviteResult.code}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={`Email: ${singleInviteResult.email}`} />
                            </ListItem>
                        </List>
                    </Box>
                )}

            </Box>

            {/* Multiple Invite Section */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Create Multiple Invitations
                </Typography>

                <form onSubmit={handleMultipleInviteSubmit}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal" // Added margin
                                label="Emails (comma-separated)"
                                multiline
                                rows={4}
                                value={multipleInviteEmails}
                                onChange={(e) => setMultipleInviteEmails(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 2 }}> {/* Added mt:2 */}
                                Create Invitations
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                {loading && <LoadingSpinner />}
                {multipleInviteCodeError && <Alert severity="error" sx={{ mt: 2 }}>{multipleInviteCodeError}</Alert>}
                {multipleInviteResult && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Invitations Created:</Typography>
                        {multipleInviteResult.invited && multipleInviteResult.invited.length > 0 && (
                            <List>
                                {multipleInviteResult.invited.map((invitation, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem>
                                            <ListItemText primary={`Email: ${invitation.email}, Code: ${invitation.code}`} />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                        {multipleInviteResult.skipped && multipleInviteResult.skipped.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1">Skipped Invitations:</Typography>
                                <List>
                                    {multipleInviteResult.skipped.map((skipped, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem>
                                                <ListItemText primary={`Email: ${skipped.email}, Reason: ${skipped.reason}`} />
                                            </ListItem>
                                            <Divider />
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default InviteMembers;
