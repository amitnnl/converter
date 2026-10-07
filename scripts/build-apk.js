/**
 * PressWebP - Cross-Platform Android APK Builder
 * Replaces BUILD_APK.bat with a reliable, cross-platform Node.js script.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const ANDROID_DIR = path.join(ROOT_DIR, 'android');

console.log('\n\x1b[36m========================================================================\x1b[0m');
console.log('\x1b[32m  PRESSWEBP — Independent Android APK Builder\x1b[0m');
console.log('\x1b[36m========================================================================\x1b[0m\n');

// Detect / Configure Java and Android SDK paths on Windows if not already set
if (process.platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA || '';
    if (!process.env.JAVA_HOME && localAppData) {
        const potentialJdk = path.join(localAppData, 'Android', 'jdk-21');
        if (fs.existsSync(path.join(potentialJdk, 'bin', 'java.exe'))) {
            process.env.JAVA_HOME = potentialJdk;
            console.log(`[INFO] Auto-detected JAVA_HOME at: ${potentialJdk}`);
        }
    }

    if (!process.env.ANDROID_HOME && localAppData) {
        const potentialSdk = path.join(localAppData, 'Android', 'Sdk');
        if (fs.existsSync(potentialSdk)) {
            process.env.ANDROID_HOME = potentialSdk;
            console.log(`[INFO] Auto-detected ANDROID_HOME at: ${potentialSdk}`);
        }
    }

    if (process.env.JAVA_HOME) {
        const javaBin = path.join(process.env.JAVA_HOME, 'bin');
        if (!process.env.PATH.includes(javaBin)) {
            process.env.PATH = `${javaBin};${process.env.PATH}`;
        }
    }
}

// 1. Sync web assets
console.log('\x1b[33m[1/3] Synchronizing web application assets to Android project...\x1b[0m');
const syncResult = spawnSync(process.execPath, [path.join(ROOT_DIR, 'sync-assets.js')], {
    stdio: 'inherit',
    cwd: ROOT_DIR
});
if (syncResult.status !== 0) {
    console.error('\x1b[31m[ERROR] Failed to run sync-assets.js\x1b[0m');
    process.exit(1);
}

const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const capCopy = spawnSync(npxCmd, ['cap', 'copy', 'android'], {
    stdio: 'inherit',
    cwd: ROOT_DIR
});
if (capCopy.status !== 0) {
    console.error('\x1b[31m[ERROR] Failed to copy web assets via Capacitor.\x1b[0m');
    process.exit(1);
}

// 2. Run Gradle assembleDebug
console.log('\n\x1b[33m[2/3] Compiling Android APK with Gradle (assembleDebug)...\x1b[0m');
const gradlewCmd = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
const gradleResult = spawnSync(gradlewCmd, ['assembleDebug'], {
    stdio: 'inherit',
    cwd: ANDROID_DIR,
    shell: true
});

if (gradleResult.status !== 0) {
    console.error('\x1b[31m[ERROR] Gradle build failed.\x1b[0m');
    console.log('\x1b[90mTip: Ensure JDK 17/21 and Android SDK are installed and configured.\x1b[0m');
    process.exit(1);
}

// 3. Export generated APK to root directory
console.log('\n\x1b[33m[3/3] Exporting PressWebP.apk to project root...\x1b[0m');
const builtApkPath = path.join(ANDROID_DIR, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
const targetApkPath = path.join(ROOT_DIR, 'PressWebP.apk');

if (fs.existsSync(builtApkPath)) {
    fs.copyFileSync(builtApkPath, targetApkPath);
    const stats = fs.statSync(targetApkPath);
    const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

    console.log('\n\x1b[36m========================================================================\x1b[0m');
    console.log('\x1b[32m  SUCCESS: PressWebP.apk has been generated!\x1b[0m');
    console.log(`  \x1b[37m* Location:\x1b[0m ${targetApkPath}`);
    console.log(`  \x1b[37m* Size:\x1b[0m     ${sizeMb} MB`);
    console.log('\x1b[36m========================================================================\x1b[0m\n');
} else {
    console.error(`\x1b[31m[ERROR] Built APK not found at: ${builtApkPath}\x1b[0m`);
    process.exit(1);
}
