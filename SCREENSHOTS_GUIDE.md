# Dashboard Screenshots Guide

This guide explains how to capture and add actual dashboard screenshots to the landing page showcase section.

---

## Current Implementation

The landing page now includes a **Dashboard Showcase** section with placeholder content that displays:

1. **Main Dashboard Screenshot** - Uses `/dashboard-hero.png`
2. **7 Feature Screenshot Cards** - Currently showing gradient backgrounds + icons as placeholders

---

## Adding Actual Screenshots

### Option 1: Manual Screenshots

#### Step 1: Access the Dashboard

1. Start the development server:
   ```bash
   cd clinic-saas
   yarn dev
   ```

2. Sign in with demo credentials:
   - Email: `admin@clinic.com` or `doctor@clinic.com`
   - Password: `admin123` or `doctor123`

#### Step 2: Navigate to Each Page

Visit these pages to capture screenshots:

| Page | URL | Screenshot Name |
|------|-----|----------------|
| Dashboard Overview | `/dashboard` | `dashboard-hero.png` ✅ (already exists) |
| Patient Management | `/dashboard/patients` | `screenshot-patients.png` |
| Medical Records | `/dashboard/medical-records` | `screenshot-ehr.png` |
| Appointments | `/dashboard/appointments` | `screenshot-appointments.png` |
| Billing | `/dashboard/billing` | `screenshot-billing.png` |
| Analytics | `/dashboard` (scroll to stats) | `screenshot-analytics.png` |
| Settings | `/dashboard/settings` | `screenshot-settings.png` |

#### Step 3: Capture Screenshots

**macOS:**
1. Press `Cmd + Shift + 4` for region selection
2. Select the dashboard area
3. Screenshot saved to `Desktop`
4. Rename appropriately

**Windows:**
1. Press `Windows + Shift + S` to open Snipping Tool
2. Select the dashboard area
3. Screenshot saved to `Pictures\Screenshots`
4. Rename appropriately

**Chrome DevTools (for full page):**
1. Open DevTools (F12)
2. Press `Cmd + Shift + P` (Mac) or `Ctrl + Shift + P` (Windows)
3. Type "screenshot"
4. Select "Capture full size screenshot"
5. Image downloads automatically

#### Step 4: Optimize Screenshots

1. **Resize** images to web-optimized size:
   - Width: 1200-1400px
   - Height: Auto (maintain aspect ratio)
   - Format: PNG or WebP (use PNG for screenshots)

2. **Compress** if needed:
   ```bash
   # Example using ImageMagick
   convert screenshot.png -quality 85 -resize 1200 screenshot-optimized.png
   ```

3. **Add to project:**
   ```bash
   cp screenshot.png /Users/sumtech/SaaS\ Health/clinic-saas/public/screenshot-patients.png
   ```

#### Step 5: Update the Code

Update the screenshot cards in `src/app/[locale]/page.tsx`:

**Find each card section:**

```tsx
{/* Patient Management Screenshot */}
<div className="aspect-video bg-slate-50 flex items-center justify-center p-6">
  <div className="text-center">
    <!-- Replace this placeholder with Image component -->
  </div>
</div>
```

**Replace with actual screenshot:**

```tsx
{/* Patient Management Screenshot */}
<div className="aspect-video bg-slate-50 relative">
  <Image
    src="/screenshot-patients.png"
    alt="Patient Management Dashboard"
    fill
    className="object-cover"
  />
  </div>
```

---

### Option 2: Automated Screenshot with Playwright

For consistent, high-quality screenshots, use Playwright:

#### Step 1: Create Screenshot Script

Create `scripts/capture-screenshots.js`:

```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });

  const pages = [
    { url: 'http://localhost:3000/dashboard', name: 'dashboard-hero' },
    { url: 'http://localhost:3000/dashboard/patients', name: 'screenshot-patients' },
    { url: 'http://localhost:3000/dashboard/medical-records', name: 'screenshot-ehr' },
    { url: 'http://localhost:3000/dashboard/appointments', name: 'screenshot-appointments' },
    { url: 'http://localhost:3000/dashboard/billing', name: 'screenshot-billing' },
  ];

  for (const page of pages) {
    const pageInstance = await context.newPage();

    // Sign in first
    await pageInstance.goto('http://localhost:3000/auth/signin');
    await pageInstance.fill('input[name="email"]', 'admin@clinic.com');
    await pageInstance.fill('input[name="password"]', 'admin123');
    await pageInstance.click('button[type="submit"]');

    // Wait for navigation
    await pageInstance.waitForURL('**/dashboard');
    await pageInstance.waitForTimeout(2000);

    // Navigate to target page
    await pageInstance.goto(page.url);
    await pageInstance.waitForTimeout(1000);

    // Take screenshot
    await pageInstance.screenshot({
      path: `public/${page.name}.png`,
      fullPage: true
    });

    await pageInstance.close();
    console.log(`✓ Captured ${page.name}.png`);
  }

  await browser.close();
  console.log('All screenshots captured!');
})();
```

#### Step 2: Add Script to package.json

```json
{
  "scripts": {
    "capture:screenshots": "node scripts/capture-screenshots.js"
  }
}
```

#### Step 3: Run the Script

```bash
# Start the dev server in one terminal
yarn dev

# In another terminal, run the screenshot script
yarn capture:screenshots
```

---

### Option 3: Using Browser Extensions

#### Recommended Extensions

1. **Awesome Screenshot** (Chrome/Firefox)
   - Capture visible area or full page
   - Annotate and edit
   - Save as PNG/JPG

2. **Nimbus Screenshot** (Chrome/Firefox)
   - Cloud sync
   - Annotation tools
   - Multiple export formats

3. **Full Page Screen Capture** (Chrome)
   - Simple, lightweight
   - Full page captures

---

## Updating the Landing Page Code

Once you have the screenshots, update `src/app/[locale]/page.tsx`:

### Replace Placeholder Cards with Images

**Current placeholder code:**

```tsx
<div className="aspect-video bg-slate-50 flex items-center justify-center p-6">
  <div className="text-center">
    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <Users className="h-8 w-8 text-white" />
    </div>
    <h4 className="font-bold text-slate-900 mb-2">Patient Management</h4>
    <p className="text-sm text-slate-600">Complete patient profiles with medical history</p>
  </div>
</div>
```

**Replace with screenshot:**

```tsx
<div className="aspect-video bg-slate-50 relative overflow-hidden rounded-2xl">
  <Image
    src="/screenshot-patients.png"
    alt="Patient Management Dashboard showing patient list with search and filters"
    fill
    className="object-cover hover:scale-105 transition-transform duration-300"
  />
  </div>
```

### Update All 7 Cards

Replace each placeholder card in the grid:

| Card | Screenshot File | Alt Text |
|------|---------------|----------|
| Patient Management | `screenshot-patients.png` | Patient management dashboard with list of patients and search functionality |
| EHR | `screenshot-ehr.png` | Electronic health records interface with medical history and vital signs |
| Appointments | `screenshot-appointments.png` | Calendar view showing appointment scheduling and management |
| Billing | `screenshot-billing.png` | Billing and invoicing dashboard with payment tracking |
| Analytics | `screenshot-analytics.png` | Analytics dashboard with charts and performance metrics |
| Settings | `screenshot-settings.png` | Settings page for clinic configuration and preferences |
| Mobile | `screenshot-mobile.png` | Mobile-responsive view showing dashboard on phone |

---

## Best Practices for Screenshots

### 1. **Content Preparation**
- ✅ Use demo data (realistic patient names, appointments)
- ✅ Populate with 5-10 sample records per feature
- ✅ Include diverse data (different dates, statuses, types)
- ❌ Don't use empty states or "No data" messages
- ❌ Don't show sensitive patient information

### 2. **Browser Setup**
- ✅ Use desktop viewport (1400x900 recommended)
- ✅ Hide browser extensions and bookmarks bar
- ✅ Use clean browser profile
- ✅ Zoom: 100%
- ✅ Hide any development tools

### 3. **Timing**
- ✅ Capture during daytime hours (better lighting in UI)
- ✅ Wait for all animations to complete
- ✅ Ensure all images are loaded
- ✅ Check responsive layout is correct

### 4. **Image Quality**
- ✅ PNG format (lossless compression)
- ✅ Width: 1200-1400px
- ✅ Optimize file size (< 500KB per image)
- ✅ Use 2x resolution for Retina displays
- ❌ Don't use JPG (lossy compression for UI)

### 5. **Privacy & Security**
- ❌ Never show real patient data
- ✅ Use demo/fake patient information
- ✅ Blur any sensitive information if accidentally captured
- ❌ Don't show API keys, tokens, or internal URLs

---

## File Organization

Place all screenshots in the `public/` folder:

```
public/
├── dashboard-hero.png          ✅ (exists)
├── screenshot-patients.png     🆕 (add)
├── screenshot-ehr.png          🆕 (add)
├── screenshot-appointments.png 🆕 (add)
├── screenshot-billing.png      🆕 (add)
├── screenshot-analytics.png    🆕 (add)
├── screenshot-settings.png     🆕 (add)
├── screenshot-mobile.png       🆕 (add)
└── healthcare-team.png         ✅ (existing)
```

---

## Quick Start (Fastest Method)

### 1. Start Development Server
```bash
cd clinic-saas
yarn dev
```

### 2. Sign In
Go to `http://localhost:3000/auth/signin`
- Email: `admin@clinic.com`
- Password: `admin123`

### 3. Navigate & Capture
Visit each page and use browser screenshot tool:

| Page | Action |
|------|--------|
| Dashboard | `Cmd+Shift+4` (Mac) or `Win+Shift+S` (Windows) |
| Patients | Navigate to `/dashboard/patients` and capture |
| Medical Records | Navigate to `/dashboard/medical-records` and capture |
| Appointments | Navigate to `/dashboard/appointments` and capture |
| Billing | Navigate to `/dashboard/billing` and capture |

### 4. Save to Public Folder
```bash
# macOS
mv ~/Desktop/screenshot1.png public/screenshot-patients.png
mv ~/Desktop/screenshot2.png public/screenshot-ehr.png
# ... etc

# Windows
mv ~/Pictures/Screenshots/screenshot1.png public/screenshot-patients.png
mv ~/Pictures/Screenshots/screenshot2.png public/screenshot-ehr.png
# ... etc
```

### 5. Update Code (Optional)
Replace placeholder cards with actual images as shown in the section above.

---

## Current Status

- ✅ Landing page structure created
- ✅ Placeholder cards with gradients + icons
- ✅ Hover effects and animations
- ✅ Responsive grid layout
- 🔄 Screenshots needed (use guide above)

---

## Alternative: Use Online Screenshot Services

If you don't have access to the running application, use:

1. **ScreenshotRocket** - `https://screenshotrocket.com`
2. **Stillio** - `https://stillio.com`
3. **Website Screenshot** - `https://screenshot.guru`

These services can capture screenshots from a URL if you deploy to Vercel/staging.

---

## Need Help?

If you encounter issues:

1. **Development server not running?**
   ```bash
   yarn dev
   ```

2. **Authentication issues?**
   - Check credentials in `.env`
   - Run `yarn db:seed` to reseed database

3. **Screenshots not displaying?**
   - Check file names match exactly in `/public`
   - Clear browser cache (Cmd+Shift+R)
   - Check image permissions

4. **Images too large?**
   ```bash
   # Optimize with sips (macOS)
   sips -Z 80 screenshot.png --out screenshot-compressed.png
   ```

---

**Next Steps:**
1. Capture screenshots of each dashboard feature
2. Optimize and save to `public/` folder
3. Update the code to display actual screenshots
4. Test the landing page to ensure images display correctly
5. Commit and push the updated screenshots
