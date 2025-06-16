# Progress Frontend ↔ Admin API Mapping Audit

## API Call Detection Summary

| File | API Endpoint | Method | Tenant-Aware? | Matches Admin Panel? |
|------|-------------|--------|---------------|---------------------|
| `ContactForm.tsx` | `/api/contact` | POST | ❌ No | ⚠️ Partial - needs CRM integration |
| `use-client-dashboard.ts` | `/api/client-dashboard/{id}` | GET | ✅ Yes | ❌ Missing - needs SmartSite API |
| `use-client-dashboard.ts` | `/api/client-dashboard/{id}/activity` | GET | ✅ Yes | ❌ Missing - needs SmartSite API |
| `use-client-dashboard.ts` | `/api/client-dashboard/tasks/{id}/complete` | POST | ✅ Yes | ❌ Missing - needs SmartSite API |
| `use-client-dashboard.ts` | `/api/client-dashboard/{id}/messages` | POST | ✅ Yes | ❌ Missing - needs SmartSite API |
| `use-client-dashboard.ts` | `/api/client-dashboard/{id}/documents` | POST | ✅ Yes | ❌ Missing - needs SmartSite API |
| `api.ts` | `/api/crm/clients` | GET | ✅ Yes | ❌ Missing - needs SmartSite CRM |
| `api.ts` | `/api/crm/clients/{id}` | GET | ✅ Yes | ❌ Missing - needs SmartSite CRM |
| `api.ts` | `/api/crm/clients/{id}/notes` | POST | ✅ Yes | ❌ Missing - needs SmartSite CRM |
| `api.ts` | `/api/seo/configs` | GET/POST/PATCH | ❌ No | ❌ Missing - admin-only feature |
| `api.ts` | `/api/brand/versions` | GET/POST/PATCH | ❌ No | ❌ Missing - admin-only feature |
| `SmartSiteDashboard.tsx` | `/api/dashboard/stats` | GET | ❌ No | ❌ Missing - needs SmartSite stats |
| `HealthTracker.tsx` | `/api/health/metrics/track` | POST | ❌ No | ✅ Yes - monitoring system |

## Form + Message Analysis

### ✅ Connected Forms
- **ContactForm.tsx** → `/api/contact` (POST)
  - Fields: name, email, phone, business, industry, message
  - **Tenant Scope**: Not implemented
  - **Integration Gap**: Needs SmartSite CRM connection for lead management

### ⚠️ Orphaned Components
- **FinanceSummary.tsx** → No API connection (uses dummy data)
- **DocumentChecklist.tsx** → No API connection (uses dummy data)
- **MessageThread.tsx** → No API connection (uses dummy data)
- **UpcomingDeadlines.tsx** → No API connection (uses dummy data)

## Route & Component Mapping

### ✅ Integrated Routes
| Route | Component | Backend Dependency | Admin Panel Module |
|-------|-----------|-------------------|-------------------|
| `/contact` | ContactPage.tsx | `/api/contact` | CRM Lead Management |
| `/admin/dashboard` | SmartSiteDashboard.tsx | `/api/dashboard/stats` | Intelligence Dashboard |
| `/admin/conversation-insights` | ConversationInsightsPage.tsx | `/api/conversations/*` | Chat Analysis |
| `/admin/crm` | CRMViewPage.tsx | `/api/crm/*` | Customer Management |

### ⚠️ Orphaned Components
| Component | Route | Status | Required API |
|-----------|-------|---------|-------------|
| FinanceDashboardPage.tsx | `/client-dashboard` | UI-only | `/api/financials/*` |
| BusinessCalculatorPage.tsx | `/business-calculator` | Static | `/api/calculations/*` |
| SMESupportHubPage.tsx | `/sme-support-hub` | Static | `/api/resources/*` |
| TeamPage.tsx | `/team` | Static | `/api/team/*` |
| ServicesPage.tsx | `/services` | Static | `/api/services/*` |

### 📨 Message Forms and Insight Capture

#### Contact Form Integration
```javascript
// Current: Local submission
fetch('/api/contact', {
  method: 'POST',
  body: JSON.stringify(formData)
});

// Required: SmartSite CRM integration
fetch('${SMARTSITE_API}/leads', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    tenantId: 'progress-accountants',
    ...formData
  })
});
```

#### Client Dashboard Messages
```javascript
// Current: Mock API calls
clientDashboardApi.sendMessage(content, clientId)

// Required: SmartSite messaging integration
fetch('${SMARTSITE_API}/clients/${clientId}/messages', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    tenantId: 'progress-accountants',
    content,
    timestamp: new Date().toISOString()
  })
});
```

## Integration Gaps Analysis

### 🔴 Critical Missing Connections

1. **Client Financial Data**
   - Components: FinanceSummary, DocumentChecklist, UpcomingDeadlines
   - Current: Dummy data
   - Required: SmartSite financial API integration

2. **Authentication System**
   - Components: useAuth hook, RequireAuth wrapper
   - Current: Dummy authentication
   - Required: SmartSite SSO integration

3. **Business Intelligence**
   - Components: SmartSiteDashboard, ConversationInsightsPage
   - Current: Mock statistics
   - Required: Real analytics from SmartSite backend

4. **Content Management**
   - Components: Team, Services, About pages
   - Current: Static content
   - Required: SmartSite CMS integration

### 🟡 Partial Connections

1. **Contact Form**
   - Status: Submits to local `/api/contact`
   - Gap: Needs SmartSite CRM connection for lead scoring and follow-up

2. **Health Monitoring**
   - Status: Tracks API performance locally
   - Gap: Should report to SmartSite monitoring dashboard

## Recommendations for Admin ↔ Frontend Alignment

### Immediate Actions Required

1. **Replace Mock APIs with SmartSite Endpoints**
```javascript
// Environment configuration
const SMARTSITE_CONFIG = {
  apiUrl: process.env.VITE_SMARTSITE_API_URL,
  tenantId: 'progress-accountants-uk',
  authEndpoint: process.env.VITE_SMARTSITE_AUTH_URL
};
```

2. **Implement Tenant-Scoped Data Fetching**
```javascript
const fetchClientData = async (endpoint, clientId) => {
  return fetch(`${SMARTSITE_CONFIG.apiUrl}/${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'X-Tenant-ID': SMARTSITE_CONFIG.tenantId,
      'Content-Type': 'application/json'
    }
  });
};
```

3. **Connect Finance Dashboard to Real Data**
   - Replace dummy financial summaries with accounting system API
   - Connect document checklist to compliance tracking system
   - Integrate messaging with SmartSite communication hub

4. **Upgrade Authentication Architecture**
   - Replace dummy useAuth with SmartSite SSO
   - Implement role-based access control from admin panel
   - Add JWT token management for API requests

5. **Enable Real-Time Updates**
   - WebSocket connection for live financial data
   - Push notifications for new messages and deadlines
   - Live dashboard statistics from admin panel

### Required Environment Variables
```env
VITE_SMARTSITE_API_URL=https://api.smartsite.nexmonth.ai
VITE_SMARTSITE_AUTH_URL=https://auth.smartsite.nexmonth.ai
VITE_TENANT_ID=progress-accountants-uk
VITE_WEBSOCKET_URL=wss://realtime.smartsite.nexmonth.ai
```

### API Endpoint Mapping
| Frontend Feature | Current Endpoint | Required SmartSite Endpoint |
|------------------|------------------|----------------------------|
| Client Dashboard | `/api/client-dashboard/*` | `/api/tenants/{id}/clients/*` |
| Contact Forms | `/api/contact` | `/api/tenants/{id}/leads` |
| Team Management | Static | `/api/tenants/{id}/team` |
| Financial Data | Mock | `/api/tenants/{id}/financials` |
| Business Analytics | `/api/dashboard/stats` | `/api/tenants/{id}/analytics` |
| Document Management | Mock | `/api/tenants/{id}/documents` |

## Deployment Readiness Status

- **Frontend Structure**: ✅ Complete and ready for SmartSite integration
- **API Connections**: ❌ Missing - requires SmartSite backend setup
- **Authentication**: ❌ Missing - needs SSO implementation
- **Data Sources**: ❌ Missing - all using dummy/static data
- **Real-Time Features**: ❌ Missing - needs WebSocket integration

**Overall Integration Status**: 🔴 **Not Ready** - Requires comprehensive backend connection before deployment as SmartSite tenant.