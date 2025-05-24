#!/usr/bin/env python3
"""
Agora OS Pallet Manager
Detects, validates, and packages pallets for deployment
"""

import os
import json
import zipfile
import shutil
from pathlib import Path

class PalletManager:
    def __init__(self):
        self.pallets_dir = Path("pallets")
        self.packages_dir = Path("packages")
        self.packages_dir.mkdir(exist_ok=True)
    
    def discover_pallets(self):
        """Discover all pallets in the pallets directory"""
        pallets = []
        if not self.pallets_dir.exists():
            print("❌ No pallets directory found")
            return pallets
            
        for pallet_dir in self.pallets_dir.iterdir():
            if pallet_dir.is_dir():
                pallet_json = pallet_dir / "pallet.json"
                if pallet_json.exists():
                    try:
                        with open(pallet_json) as f:
                            pallet_config = json.load(f)
                        pallet_config['path'] = pallet_dir
                        pallets.append(pallet_config)
                        print(f"✅ Found pallet: {pallet_config['name']}")
                    except Exception as e:
                        print(f"❌ Error reading pallet.json in {pallet_dir}: {e}")
        
        return pallets
    
    def validate_pallet(self, pallet_config):
        """Validate pallet configuration and structure"""
        required_fields = ['name', 'version', 'description', 'type']
        
        for field in required_fields:
            if field not in pallet_config:
                print(f"❌ Missing required field: {field}")
                return False
        
        pallet_dir = pallet_config['path']
        
        # Check for essential files
        essential_files = ['package.json']
        for file in essential_files:
            if not (pallet_dir / file).exists():
                print(f"❌ Missing essential file: {file}")
                return False
        
        print(f"✅ Pallet '{pallet_config['name']}' validation passed")
        return True
    
    def package_pallet(self, pallet_config):
        """Package pallet into a zip file"""
        pallet_dir = pallet_config['path']
        pallet_name = pallet_config['name']
        
        zip_filename = f"{pallet_name}.zip"
        zip_path = self.packages_dir / zip_filename
        
        print(f"📦 Packaging {pallet_name}...")
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(pallet_dir):
                # Skip node_modules and other build artifacts
                dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', 'build']]
                
                for file in files:
                    file_path = Path(root) / file
                    arcname = file_path.relative_to(pallet_dir)
                    zipf.write(file_path, arcname)
        
        print(f"✅ Packaged to: {zip_path}")
        return zip_path
    
    def display_dashboard(self, pallets):
        """Display a visual dashboard of all pallets"""
        print("\n" + "="*60)
        print("🎯 AGORA OS PALLET DASHBOARD")
        print("="*60)
        
        if not pallets:
            print("📭 No pallets found")
            return
        
        for pallet in pallets:
            status_icon = "🟢" if pallet.get('valid', False) else "🔴"
            print(f"\n{status_icon} {pallet['name']} v{pallet['version']}")
            print(f"   📝 {pallet['description']}")
            print(f"   🏷️  Type: {pallet['type']}")
            if 'port' in pallet:
                print(f"   🌐 Port: {pallet['port']}")
            if 'tags' in pallet:
                print(f"   🔖 Tags: {', '.join(pallet['tags'])}")
    
    def run(self):
        """Main execution method"""
        print("🚀 Starting Agora OS Pallet Manager...")
        
        # Discover pallets
        pallets = self.discover_pallets()
        
        # Validate and package each pallet
        for pallet in pallets:
            if self.validate_pallet(pallet):
                pallet['valid'] = True
                zip_path = self.package_pallet(pallet)
                pallet['zip_path'] = str(zip_path)
            else:
                pallet['valid'] = False
        
        # Display dashboard
        self.display_dashboard(pallets)
        
        print(f"\n🎉 Pallet management complete!")
        print(f"📁 Packages available in: {self.packages_dir}")

if __name__ == "__main__":
    manager = PalletManager()
    manager.run()