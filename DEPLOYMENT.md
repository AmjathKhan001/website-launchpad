# Deployment Guide

## Quick Deployment on GitHub Pages

1. **Enable GitHub Pages:**
   - Go to Repository Settings
   - Navigate to Pages section
   - Select "Deploy from branch"
   - Choose "main" branch and "/ (root)" folder
   - Click Save

2. **Custom Domain (Optional):**
   - Add your domain in Pages settings
   - Create `CNAME` file in root with your domain
   - Update DNS records with your registrar

3. **Verify Deployment:**
   - Visit: `https://[username].github.io/website-launchpad/`
   - Test all pages
   - Check mobile responsiveness

## Local Testing

1. Clone repository
2. Open `index.html` in browser
3. Test all functionality
4. Check console for errors (F12 → Console)

## Updates and Maintenance

1. Push changes to main branch
2. GitHub Pages auto-deploys
3. Clear cache if needed (Ctrl+F5)
4. Monitor GitHub Pages build status
