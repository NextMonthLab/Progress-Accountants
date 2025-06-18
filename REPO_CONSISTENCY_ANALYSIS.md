# REPO SOURCE CONSISTENCY ANALYSIS

## Issue Diagnosis

### Root Cause Analysis - CORRECTED
The issue is **repository renaming**, not migration:

1. **Repository Rename**: The repo was renamed from "Progress-Frontend" to "Progress-Accountants" within the same Flashbuzz organization
2. **Current Actual Repo**: `https://github.com/Flashbuzz/Progress-Accountants`
3. **No NextMonthLab Migration**: The NextMonthLab reference appears to be incorrect - current git config shows Flashbuzz

### Current State Assessment
- **Original Repo**: `git@github.com:Flashbuzz/Progress-Frontend.git` (OLD NAME)
- **Current Repo**: `https://github.com/Flashbuzz/Progress-Accountants` (NEW NAME)
- **Claimed Migration**: `https://github.com/NextMonthLab/Progress-Accountants` (NOT FOUND IN GIT CONFIG)
- **Impact**: Hetzner VPS deployment pipeline broken due to repo name change

## Immediate Solutions

### Option 1: Redirect Hetzner to New Repo
Update Hetzner deployment scripts to pull from:
```bash
https://github.com/NextMonthLab/Progress-Accountants
```

### Option 2: Force Replit Back to Original Repo
```bash
git remote set-url origin git@github.com:Flashbuzz/Progress-Frontend.git
git push origin main --force
```

### Option 3: Repo Synchronization
Keep both repos in sync with automated mirroring.

## Prevention Strategy

### For Future Replit Instances
1. **Explicit Remote Configuration**: Always set git remote explicitly after project creation
2. **Disable Auto-Deploy**: Turn off Replit's automatic deployment features that trigger repo creation
3. **Lock Git Configuration**: Add git hooks to prevent unauthorized remote changes

## Recommended Action
The safest approach is to update Hetzner deployment to use the new NextMonthLab repo, as this appears to be where Replit is now maintaining the latest code.

## Container Pipeline Fix - CORRECT SOLUTION
Update Hetzner container scripts from:
```
git clone git@github.com:Flashbuzz/Progress-Frontend.git
```
To:
```
git clone https://github.com/Flashbuzz/Progress-Accountants.git
```

## Stability Lock Configuration
To prevent future issues, configure Hetzner deployment to use commit SHAs instead of branch names:
```bash
git clone https://github.com/Flashbuzz/Progress-Accountants.git
cd Progress-Accountants
git checkout 40b88a3  # Use specific commit SHA
```

## Repository Monitoring
Add to Hetzner deployment script:
```bash
#!/bin/bash
EXPECTED_REPO="https://github.com/Flashbuzz/Progress-Accountants"
CURRENT_REPO=$(git remote get-url origin)
if [ "$CURRENT_REPO" != "$EXPECTED_REPO" ]; then
    echo "ERROR: Repository mismatch detected!"
    echo "Expected: $EXPECTED_REPO"
    echo "Current: $CURRENT_REPO"
    exit 1
fi
```