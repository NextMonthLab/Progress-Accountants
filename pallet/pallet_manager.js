#!/usr/bin/env node
/**
 * Agora OS Pallet Manager
 * Detects, validates, and packages pallets for deployment
 */

import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

class PalletManager {
    constructor() {
        this.palletsDir = './pallets';
        this.packagesDir = './packages';
        
        // Ensure packages directory exists
        if (!fs.existsSync(this.packagesDir)) {
            fs.mkdirSync(this.packagesDir, { recursive: true });
        }
    }

    async discoverPallets() {
        const pallets = [];
        
        if (!fs.existsSync(this.palletsDir)) {
            console.log('❌ No pallets directory found');
            return pallets;
        }

        const entries = fs.readdirSync(this.palletsDir, { withFileTypes: true });
        
        for (const entry of entries) {
            if (entry.isDirectory()) {
                const palletDir = path.join(this.palletsDir, entry.name);
                const palletJsonPath = path.join(palletDir, 'pallet.json');
                
                if (fs.existsSync(palletJsonPath)) {
                    try {
                        const palletConfig = JSON.parse(fs.readFileSync(palletJsonPath, 'utf8'));
                        palletConfig.path = palletDir;
                        pallets.push(palletConfig);
                        console.log(`✅ Found pallet: ${palletConfig.name}`);
                    } catch (error) {
                        console.log(`❌ Error reading pallet.json in ${palletDir}: ${error.message}`);
                    }
                }
            }
        }
        
        return pallets;
    }

    validatePallet(palletConfig) {
        const requiredFields = ['name', 'version', 'description', 'type'];
        
        for (const field of requiredFields) {
            if (!palletConfig[field]) {
                console.log(`❌ Missing required field: ${field}`);
                return false;
            }
        }

        const palletDir = palletConfig.path;
        
        // Check for essential files
        const essentialFiles = ['package.json'];
        for (const file of essentialFiles) {
            if (!fs.existsSync(path.join(palletDir, file))) {
                console.log(`❌ Missing essential file: ${file}`);
                return false;
            }
        }

        console.log(`✅ Pallet '${palletConfig.name}' validation passed`);
        return true;
    }

    async packagePallet(palletConfig) {
        return new Promise((resolve, reject) => {
            const palletDir = palletConfig.path;
            const palletName = palletConfig.name;
            
            const zipFilename = `${palletName}.zip`;
            const zipPath = path.join(this.packagesDir, zipFilename);
            
            console.log(`📦 Packaging ${palletName}...`);
            
            const output = fs.createWriteStream(zipPath);
            const archive = archiver('zip', { zlib: { level: 9 } });
            
            output.on('close', () => {
                console.log(`✅ Packaged to: ${zipPath} (${archive.pointer()} bytes)`);
                resolve(zipPath);
            });
            
            archive.on('error', (err) => {
                console.log(`❌ Error packaging ${palletName}: ${err.message}`);
                reject(err);
            });
            
            archive.pipe(output);
            
            // Add files to archive, excluding build artifacts
            const excludeDirs = ['node_modules', '.git', 'dist', 'build', '.next'];
            
            archive.glob('**/*', {
                cwd: palletDir,
                ignore: excludeDirs.map(dir => `${dir}/**`)
            });
            
            archive.finalize();
        });
    }

    displayDashboard(pallets) {
        console.log('\n' + '='.repeat(60));
        console.log('🎯 AGORA OS PALLET DASHBOARD');
        console.log('='.repeat(60));
        
        if (pallets.length === 0) {
            console.log('📭 No pallets found');
            return;
        }

        for (const pallet of pallets) {
            const statusIcon = pallet.valid ? '🟢' : '🔴';
            console.log(`\n${statusIcon} ${pallet.name} v${pallet.version}`);
            console.log(`   📝 ${pallet.description}`);
            console.log(`   🏷️  Type: ${pallet.type}`);
            if (pallet.port) {
                console.log(`   🌐 Port: ${pallet.port}`);
            }
            if (pallet.tags) {
                console.log(`   🔖 Tags: ${pallet.tags.join(', ')}`);
            }
            if (pallet.zip_path) {
                console.log(`   📦 Package: ${pallet.zip_path}`);
            }
        }
    }

    async run() {
        console.log('🚀 Starting Agora OS Pallet Manager...');
        
        // Discover pallets
        const pallets = await this.discoverPallets();
        
        // Validate and package each pallet
        for (const pallet of pallets) {
            if (this.validatePallet(pallet)) {
                pallet.valid = true;
                try {
                    const zipPath = await this.packagePallet(pallet);
                    pallet.zip_path = zipPath;
                } catch (error) {
                    console.log(`❌ Failed to package ${pallet.name}: ${error.message}`);
                    pallet.valid = false;
                }
            } else {
                pallet.valid = false;
            }
        }

        // Display dashboard
        this.displayDashboard(pallets);
        
        console.log('\n🎉 Pallet management complete!');
        console.log(`📁 Packages available in: ${this.packagesDir}`);
    }
}

// Run the pallet manager
const manager = new PalletManager();
manager.run().catch(console.error);