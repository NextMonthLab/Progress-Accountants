import { createWriteStream } from 'fs';
import archiver from 'archiver';
import { join } from 'path';
import fs from 'fs';
import { log } from './vite';

// Directories to include in the backup
const BACKUP_DIRECTORIES = [
  'client',
  'server',
  'shared',
  'logs',
  'config',
];

// Files to include in the backup
const BACKUP_FILES = [
  'drizzle.config.ts',
  'package.json',
  'theme.json',
  'vite.config.ts',
  'tailwind.config.ts',
  'tsconfig.json',
];

// Patterns to exclude
const EXCLUSION_PATTERNS = [
  /node_modules/,
  /\.env/,
  /\.git/,
  /\.DS_Store/,
  /\/.replit/,
  /env\.json/,
  /\/uploads\//,
];

/**
 * Creates a zip backup of relevant project files
 * @returns {Promise<string>} Path to the created backup file
 */
export async function createBackupZip(): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = join(process.cwd(), 'backups');
  const backupPath = join(backupDir, `backup-${timestamp}.zip`);
  
  // Ensure backup directory exists
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Create a file to stream archive data to
  const output = createWriteStream(backupPath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level
  });
  
  // Listen for warnings
  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      log(`Backup warning: ${err.message}`, 'backup');
    } else {
      throw err;
    }
  });
  
  // Listen for errors
  archive.on('error', (err) => {
    throw err;
  });
  
  // Pipe archive data to the file
  archive.pipe(output);
  
  // Add directories
  for (const dir of BACKUP_DIRECTORIES) {
    const dirPath = join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      archive.directory(dirPath, dir, (data) => {
        // Skip files matching exclusion patterns
        const relativePath = join(data.name);
        const shouldExclude = EXCLUSION_PATTERNS.some(pattern => 
          pattern.test(relativePath)
        );
        return shouldExclude ? false : data;
      });
    } else {
      log(`Directory not found during backup: ${dirPath}`, 'backup');
    }
  }
  
  // Add individual files
  for (const file of BACKUP_FILES) {
    const filePath = join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      archive.file(filePath, { name: file });
    } else {
      log(`File not found during backup: ${filePath}`, 'backup');
    }
  }
  
  // Add a manifest file with details about the backup
  const manifest = generateManifest(BACKUP_DIRECTORIES, BACKUP_FILES);
  archive.append(JSON.stringify(manifest, null, 2), { name: 'manifest.json' });
  
  // Finalize the archive and close the write stream
  await archive.finalize();
  
  return new Promise((resolve, reject) => {
    output.on('close', () => {
      log(`Backup created successfully at ${backupPath}`, 'backup');
      log(`Total bytes: ${archive.pointer()}`, 'backup');
      resolve(backupPath);
    });
    
    output.on('error', (err) => {
      log(`Backup failed: ${err.message}`, 'backup');
      reject(err);
    });
  });
}

/**
 * Generates a manifest file with details about the backup
 */
function generateManifest(directories: string[], files: string[]): any {
  return {
    timestamp: new Date().toISOString(),
    version: '1.0',
    application: 'Progress Accountants',
    includedDirectories: directories,
    includedFiles: files,
    exclusionPatterns: EXCLUSION_PATTERNS.map(p => p.toString()),
    environment: process.env.NODE_ENV || 'development'
  };
}

/**
 * Sends the backup to the NextMonth Dev vault
 * @param backupPath 
 * @returns {Promise<boolean>} Success/failure indicator
 */
export async function sendBackupToVault(backupPath: string): Promise<boolean> {
  try {
    const backupFile = fs.readFileSync(backupPath);
    const filename = backupPath.split('/').pop();
    
    // Send to NextMonth Vault endpoint
    const response = await fetch('https://nextmonth-vault.replit.app/archive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/zip',
        'X-Backup-Filename': filename || 'backup.zip',
        'X-Client-Id': 'progress-accountants',
        'X-Backup-Type': 'automated'
      },
      body: backupFile
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send backup to vault: ${response.statusText}`);
    }
    
    const result = await response.json();
    log(`Backup sent successfully to vault: ${result.message}`, 'backup');
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`Failed to send backup to vault: ${errorMessage}`, 'backup');
    return false;
  }
}

/**
 * Triggers a backup process (create and send)
 */
export async function triggerBackup(): Promise<void> {
  try {
    log('Starting backup process...', 'backup');
    const backupPath = await createBackupZip();
    await sendBackupToVault(backupPath);
    log('Backup process completed successfully', 'backup');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`Backup process failed: ${errorMessage}`, 'backup');
  }
}