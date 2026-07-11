const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const backupController = require('../controllers/backup.controller');

const SETTINGS_FILE = path.join(__dirname, '../../data/backup_settings.json');
let currentTask = null;

const getSettingsData = () => {
  if (fs.existsSync(SETTINGS_FILE)) {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
  }
  return { isActive: false, frequency: 'weekly', time: '00:00' };
};

const reload = () => {
  // Stop existing cron task
  if (currentTask) {
    currentTask.stop();
    currentTask = null;
  }

  const settings = getSettingsData();
  
  if (settings.isActive) {
    const [hour, minute] = (settings.time || '00:00').split(':');
    let cronExpression = `0 0 * * *`; // Default daily at midnight

    if (settings.frequency === 'daily') {
      cronExpression = `${minute} ${hour} * * *`;
    } else if (settings.frequency === 'weekly') {
      cronExpression = `${minute} ${hour} * * 0`; // Every Sunday
    } else if (settings.frequency === 'monthly') {
      cronExpression = `${minute} ${hour} 1 * *`; // 1st of every month
    }

    console.log(`Starting backup scheduler with expression: ${cronExpression}`);
    
    currentTask = cron.schedule(cronExpression, async () => {
      console.log('Running scheduled auto-backup...');
      try {
        // Mock req, res, next since we are calling a controller directly
        const req = {};
        const res = {
          json: (data) => console.log('Auto-backup completed:', data),
          status: () => res
        };
        const next = (err) => console.error('Auto-backup error:', err);
        
        await backupController.createBackup(req, res, next);
      } catch (err) {
        console.error('Failed to run auto backup:', err);
      }
    });
  } else {
    console.log('Backup scheduler is disabled in settings.');
  }
};

// Initialize on startup
reload();

module.exports = {
  reload
};
