'use client';
import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Save,
  CloudUpload,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  YouTube,
} from '@mui/icons-material';
import styles from '@/styles/SiteSettings.module.css';

// Dummy initial data – replace with API call
const initialSettings = {
  siteName: 'SkillVerse',
  siteDescription: 'Empowering learners worldwide with cutting-edge courses.',
  siteEmail: 'hello@skillverse.com',
  sitePhone: '+1 (555) 123-4567',
  address: '123 Learning Street, Tech City, TC 12345',
  primaryColor: '#6366F1',
  secondaryColor: '#06B6D4',
  accentColor: '#F59E0B',
  darkModeEnabled: false,
  maintenanceMode: false,
  socialLinks: {
    facebook: 'https://facebook.com/skillverse',
    twitter: 'https://twitter.com/skillverse',
    linkedin: 'https://linkedin.com/company/skillverse',
    instagram: 'https://instagram.com/skillverse',
    youtube: 'https://youtube.com/@skillverse',
  },
  logoUrl: '/logo.png',
  faviconUrl: '/favicon.ico',
};

export default function SiteSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [logoPreview, setLogoPreview] = useState(settings.logoUrl);
  const [faviconPreview, setFaviconPreview] = useState(settings.faviconUrl);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const handleFileUpload = (type: 'logo' | 'favicon', file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'logo') {
        setLogoPreview(url);
        setSettings(prev => ({ ...prev, logoUrl: url }));
      } else {
        setFaviconPreview(url);
        setSettings(prev => ({ ...prev, faviconUrl: url }));
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSnackbar({ open: true, message: 'Settings saved successfully!', severity: 'success' });
      // Apply dark mode to document if changed
      if (settings.darkModeEnabled) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, 1000);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box className={styles.container}>
      <Container maxWidth="lg">
        <Paper className={styles.paper}>
          <Typography variant="h4" className={styles.title}>
            Site Settings
          </Typography>
          <Typography variant="body2" className={styles.subtitle}>
            Configure your platform settings
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={4}>
            {/* Left Column – General Settings */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                General Settings
              </Typography>
              <TextField
                fullWidth
                label="Site Name"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Site Description"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                multiline
                rows={2}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Contact Email"
                name="siteEmail"
                value={settings.siteEmail}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="sitePhone"
                value={settings.sitePhone}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={settings.address}
                onChange={handleChange}
                multiline
                rows={2}
                margin="normal"
              />

              <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
                Color Scheme
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}>
                  <TextField
                    fullWidth
                    label="Primary Color"
                    name="primaryColor"
                    type="color"
                    value={settings.primaryColor}
                    onChange={handleChange}
                    InputProps={{ startAdornment: <InputAdornment position="start">#</InputAdornment> }}
                  />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <TextField
                    fullWidth
                    label="Secondary Color"
                    name="secondaryColor"
                    type="color"
                    value={settings.secondaryColor}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <TextField
                    fullWidth
                    label="Accent Color"
                    name="accentColor"
                    type="color"
                    value={settings.accentColor}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.darkModeEnabled}
                      onChange={handleChange}
                      name="darkModeEnabled"
                    />
                  }
                  label="Enable Dark Mode"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.maintenanceMode}
                      onChange={handleChange}
                      name="maintenanceMode"
                    />
                  }
                  label="Maintenance Mode"
                />
              </Box>
            </Grid>

            {/* Right Column – Branding & Social */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Branding
              </Typography>
              <Box className={styles.uploadSection}>
                <Typography variant="body2" gutterBottom>Site Logo</Typography>
                <Box className={styles.previewContainer}>
                  {logoPreview && (
                    <img src={logoPreview} alt="Logo preview" className={styles.logoPreview} />
                  )}
                </Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                >
                  Upload Logo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleFileUpload('logo', e.target.files?.[0] || null)}
                  />
                </Button>
              </Box>

              <Box className={styles.uploadSection}>
                <Typography variant="body2" gutterBottom>Favicon</Typography>
                <Box className={styles.previewContainer}>
                  {faviconPreview && (
                    <img src={faviconPreview} alt="Favicon preview" className={styles.faviconPreview} />
                  )}
                </Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                >
                  Upload Favicon
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleFileUpload('favicon', e.target.files?.[0] || null)}
                  />
                </Button>
              </Box>

              <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
                Social Links
              </Typography>
              <TextField
                fullWidth
                label="Facebook URL"
                value={settings.socialLinks.facebook}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                margin="normal"
                InputProps={{ startAdornment: <InputAdornment position="start"><Facebook fontSize="small" /></InputAdornment> }}
              />
              <TextField
                fullWidth
                label="Twitter URL"
                value={settings.socialLinks.twitter}
                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                margin="normal"
                InputProps={{ startAdornment: <InputAdornment position="start"><Twitter fontSize="small" /></InputAdornment> }}
              />
              <TextField
                fullWidth
                label="LinkedIn URL"
                value={settings.socialLinks.linkedin}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                margin="normal"
                InputProps={{ startAdornment: <InputAdornment position="start"><LinkedIn fontSize="small" /></InputAdornment> }}
              />
              <TextField
                fullWidth
                label="Instagram URL"
                value={settings.socialLinks.instagram}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                margin="normal"
                InputProps={{ startAdornment: <InputAdornment position="start"><Instagram fontSize="small" /></InputAdornment> }}
              />
              <TextField
                fullWidth
                label="YouTube URL"
                value={settings.socialLinks.youtube}
                onChange={(e) => handleSocialChange('youtube', e.target.value)}
                margin="normal"
                InputProps={{ startAdornment: <InputAdornment position="start"><YouTube fontSize="small" /></InputAdornment> }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box className={styles.actions}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity as any} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
