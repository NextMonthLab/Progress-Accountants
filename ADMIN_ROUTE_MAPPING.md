# Admin Route Mapping Documentation

This file maps admin routes to their corresponding component files to prevent confusion during development.

## Main Admin Routes (VERIFIED)

| Route | Component File | Line in App.tsx | Description |
|-------|---------------|-----------------|-------------|
| `/admin/dashboard` | `client/src/pages/SmartSiteDashboard.tsx` | Line 397-401 | **VERIFIED** Main admin dashboard with intelligence zones |
| `/admin/feed-settings` | `client/src/pages/FeedSettings.tsx` | Line 88 | Feed control panel configuration |
| `/admin/insights-dashboard` | `client/src/pages/InsightsDashboardPage.tsx` | Line 80 | Insights and analytics dashboard |
| `/admin/conversation-insights` | `client/src/pages/ConversationInsightsPage.tsx` | Line 129 | Chat analysis and lead scoring |
| `/admin/crm` | `client/src/pages/CRMViewPage.tsx` | Line 336-340 | Customer relationship management |
| `/admin/setup` | `client/src/pages/SmartSiteSetupPanel.tsx` | Line 82 | Initial setup and configuration |

## Deprecated/Unused Components

| Component File | Status | Notes |
|---------------|--------|-------|
| `client/src/pages/AdminDashboardPage.simple.tsx` | **NOT USED** | Old dashboard component, superseded by SmartSiteDashboard.tsx |
| `client/src/pages/AdminDashboardPage.tsx` | **NOT USED** | Legacy admin dashboard |

## Quick Reference Commands

To find which component handles a specific route:

```bash
# Search for route definition
grep -r "/admin/dashboard" client/src/

# Search for component imports
grep -r "SmartSiteDashboard" client/src/
```

## Important Notes

1. **Always verify the route before editing** - Check `client/src/App.tsx` for actual route mappings
2. **Use search functionality** - Search for the exact route path to find the correct component
3. **Check for multiple files** - Some routes might have multiple related components
4. **Avoid legacy files** - Files marked as "NOT USED" should not be modified

## Last Updated

- Date: 2025-06-05
- Updated by: AI Assistant
- Reason: Prevent confusion between SmartSiteDashboard.tsx and AdminDashboardPage.simple.tsx