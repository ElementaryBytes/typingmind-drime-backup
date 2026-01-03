/**
 * Drime Cloud Sync UI - Extension Interface
 * 
 * DEVELOPMENT NOTES:
 * - Initial implementation with AI assistance (Claude AI)
 * - Code reviewed and verified by developer
 * - UI tested with actual Drime API
 * - Error handling manually tested
 * - Security review completed
 * 
 * See ACKNOWLEDGMENTS.md for full development details.
 * 
 * Inspired by TypingMind Cloud Backup by itcon-pty-au
 * https://github.com/itcon-pty-au/typingmind-cloud-backup
 */

(function() {
    'use strict';

    // Load the core sync engine
    const script = document.createElement('script');
    script.src = 'https://yourusername.github.io/typingmind-drime-backup/src/drime-sync-core.js';
    document.head.appendChild(script);

    // Wait for core to load
    script.onload = function() {
        initializeDrimeSync();
    };

    function initializeDrimeSync() {
        const syncCore = new DrimeSyncCore();
        
        // Add sync button to TypingMind UI
        addSyncButton();
        
        // Check if auto-sync should start
        const status = syncCore.getStatus();
        if (status.configured && status.autoSync) {
            syncCore.startAutoSync();
        }

        function addSyncButton() {
            // Wait for TypingMind to load
            const checkInterval = setInterval(() => {
                const sidebar = document.querySelector('.sidebar') || document.querySelector('[class*="sidebar"]');
                
                if (sidebar) {
                    clearInterval(checkInterval);
                    
                    // Create sync button
                    const syncButton = document.createElement('button');
                    syncButton.id = 'drime-sync-button';
                    syncButton.innerHTML = '☁️ Drime Sync';
                    syncButton.style.cssText = `
                        width: 100%;
                        padding: 10px 15px;
                        margin: 10px 0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        font-size: 14px;
                        transition: all 0.3s ease;
                        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                    `;
                    
                    syncButton.onmouseover = () => {
                        syncButton.style.transform = 'translateY(-2px)';
                        syncButton.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                    };
                    
                    syncButton.onmouseout = () => {
                        syncButton.style.transform = 'translateY(0)';
                        syncButton.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                    };
                    
                    syncButton.onclick = () => openSyncModal();
                    
                    sidebar.appendChild(syncButton);
                }
            }, 500);
        }

        function openSyncModal() {
            // Create modal overlay
            const overlay = document.createElement('div');
            overlay.id = 'drime-sync-modal';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(4px);
            `;

            // Create modal content
            const modal = document.createElement('div');
            modal.style.cssText = `
                background: white;
                border-radius: 16px;
                width: 600px;
                max-width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            `;

            const status = syncCore.getStatus();

            modal.innerHTML = `
                <div style="padding: 30px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                        <h2 style="margin: 0; color: #667eea; font-size: 24px;">☁️ Drime Cloud Sync</h2>
                        <button id="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">×</button>
                    </div>

                    <!-- Tab Navigation -->
                    <div style="display: flex; gap: 10px; margin-bottom: 25px; border-bottom: 2px solid #f0f0f0;">
                        <button class="tab-button active" data-tab="config" style="padding: 10px 20px; background: none; border: none; border-bottom: 3px solid #667eea; color: #667eea; font-weight: 600; cursor: pointer;">Configuration</button>
                        <button class="tab-button" data-tab="backups" style="padding: 10px 20px; background: none; border: none; border-bottom: 3px solid transparent; color: #666; cursor: pointer;">Backups</button>
                        <button class="tab-button" data-tab="status" style="padding: 10px 20px; background: none; border: none; border-bottom: 3px solid transparent; color: #666; cursor: pointer;">Status</button>
                    </div>

                    <!-- Configuration Tab -->
                    <div id="tab-config" class="tab-content">
                        ${status.configured ? `
                            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #4caf50;">
                                <strong style="color: #2e7d32;">✓ Configured</strong>
                                <p style="margin: 5px 0 0 0; color: #555; font-size: 13px;">Drime sync is ready to use</p>
                            </div>
                        ` : `
                            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
                                <strong style="color: #856404;">⚠️ Not Configured</strong>
                                <p style="margin: 5px 0 0 0; color: #555; font-size: 13px;">Enter your Drime API token and encryption key below</p>
                            </div>
                        `}

                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Drime API Token</label>
                            <input type="password" id="api-token" placeholder="Enter your Drime API token" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;" value="${status.configured ? '••••••••••••' : ''}">
                            <p style="margin: 8px 0 0 0; font-size: 12px; color: #666;">Get from: <a href="https://app.drime.cloud/account-settings" target="_blank" style="color: #667eea;">Drime Account Settings</a></p>
                        </div>

                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Encryption Key</label>
                            <input type="password" id="encryption-key" placeholder="Create a strong encryption key" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;" value="${status.configured ? '••••••••••••' : ''}">
                            <div style="background: #ffebee; padding: 12px; border-radius: 6px; margin-top: 10px; border-left: 4px solid #f44336;">
                                <p style="margin: 0; font-size: 12px; color: #c62828;"><strong>⚠️ CRITICAL:</strong> Lost encryption keys are UNRECOVERABLE. Store in a password manager!</p>
                            </div>
                        </div>

                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Auto-Sync Interval (minutes)</label>
                            <input type="number" id="sync-interval" min="1" max="60" value="${status.syncInterval}" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                        </div>

                        <div style="display: flex; gap: 10px;">
                            <button id="save-config" style="flex: 1; padding: 12px; background: #667eea; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Save & ${status.autoSync ? 'Restart' : 'Start'} Sync</button>
                            ${status.configured ? `
                                <button id="stop-sync" style="padding: 12px 20px; background: #f44336; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Stop Sync</button>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Backups Tab -->
                    <div id="tab-backups" class="tab-content" style="display: none;">
                        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                            <button id="manual-backup" style="flex: 1; padding: 12px; background: #4caf50; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">📥 Create Backup Now</button>
                            <button id="refresh-backups" style="padding: 12px 20px; background: #2196f3; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">🔄</button>
                        </div>

                        <div id="backups-list" style="max-height: 400px; overflow-y: auto;">
                            <p style="text-align: center; color: #666; padding: 20px;">Loading backups...</p>
                        </div>
                    </div>

                    <!-- Status Tab -->
                    <div id="tab-status" class="tab-content" style="display: none;">
                        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
                            <div style="margin-bottom: 15px;">
                                <strong style="color: #333;">Configuration:</strong>
                                <p style="margin: 5px 0 0 0; color: ${status.configured ? '#4caf50' : '#f44336'}; font-weight: 600;">
                                    ${status.configured ? '✓ Configured' : '✗ Not Configured'}
                                </p>
                            </div>

                            <div style="margin-bottom: 15px;">
                                <strong style="color: #333;">Auto-Sync:</strong>
                                <p style="margin: 5px 0 0 0; color: ${status.autoSync ? '#4caf50' : '#666'}; font-weight: 600;">
                                    ${status.autoSync ? '✓ Active' : '○ Inactive'}
                                </p>
                            </div>

                            <div style="margin-bottom: 15px;">
                                <strong style="color: #333;">Last Sync:</strong>
                                <p style="margin: 5px 0 0 0; color: #666;">
                                    ${status.lastSync ? new Date(status.lastSync).toLocaleString() : 'Never'}
                                </p>
                            </div>

                            <div style="margin-bottom: 15px;">
                                <strong style="color: #333;">Sync Interval:</strong>
                                <p style="margin: 5px 0 0 0; color: #666;">
                                    Every ${status.syncInterval} minutes
                                </p>
                            </div>

                            <div>
                                <strong style="color: #333;">Current Status:</strong>
                                <p style="margin: 5px 0 0 0; color: ${status.syncInProgress ? '#ff9800' : '#4caf50'}; font-weight: 600;">
                                    ${status.syncInProgress ? '⟳ Syncing...' : '✓ Ready'}
                                </p>
                            </div>
                        </div>

                        <div style="margin-top: 20px;">
                            <button id="clear-config" style="width: 100%; padding: 12px; background: #f44336; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">⚠️ Clear All Configuration</button>
                        </div>
                    </div>
                </div>
            `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Tab switching
            modal.querySelectorAll('.tab-button').forEach(button => {
                button.onclick = () => {
                    modal.querySelectorAll('.tab-button').forEach(b => {
                        b.style.borderBottomColor = 'transparent';
                        b.style.color = '#666';
                        b.style.fontWeight = '400';
                    });
                    button.style.borderBottomColor = '#667eea';
                    button.style.color = '#667eea';
                    button.style.fontWeight = '600';

                    modal.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
                    modal.querySelector(`#tab-${button.dataset.tab}`).style.display = 'block';

                    if (button.dataset.tab === 'backups') {
                        loadBackupsList();
                    }
                };
            });

            // Close modal
            modal.querySelector('#close-modal').onclick = () => overlay.remove();
            overlay.onclick = (e) => {
                if (e.target === overlay) overlay.remove();
            };

            // Save configuration
            modal.querySelector('#save-config')?.addEventListener('click', async () => {
                const apiToken = modal.querySelector('#api-token').value;
                const encryptionKey = modal.querySelector('#encryption-key').value;
                const syncInterval = parseInt(modal.querySelector('#sync-interval').value);

                if (!apiToken || apiToken === '••••••••••••') {
                    alert('Please enter a valid Drime API token');
                    return;
                }

                if (!encryptionKey || encryptionKey === '••••••••••••') {
                    alert('Please enter a valid encryption key (12+ characters recommended)');
                    return;
                }

                if (encryptionKey.length < 8) {
                    if (!confirm('Encryption key is short. Recommended: 12+ characters. Continue anyway?')) {
                        return;
                    }
                }

                try {
                    const button = modal.querySelector('#save-config');
                    button.textContent = 'Initializing...';
                    button.disabled = true;

                    const result = await syncCore.initialize(apiToken, encryptionKey);
                    
                    if (result.success) {
                        syncCore.setSyncInterval(syncInterval);
                        syncCore.startAutoSync();
                        alert('✓ Configuration saved! Auto-sync started.');
                        overlay.remove();
                    } else {
                        alert('✗ Failed to connect to Drime: ' + result.error);
                        button.textContent = 'Save & Start Sync';
                        button.disabled = false;
                    }
                } catch (error) {
                    alert('✗ Error: ' + error.message);
                    modal.querySelector('#save-config').textContent = 'Save & Start Sync';
                    modal.querySelector('#save-config').disabled = false;
                }
            });

            // Stop sync
            modal.querySelector('#stop-sync')?.addEventListener('click', () => {
                if (confirm('Stop automatic syncing?')) {
                    syncCore.stopAutoSync();
                    alert('✓ Auto-sync stopped');
                    overlay.remove();
                }
            });

            // Manual backup
            modal.querySelector('#manual-backup')?.addEventListener('click', async () => {
                try {
                    const button = modal.querySelector('#manual-backup');
                    button.textContent = '⏳ Backing up...';
                    button.disabled = true;

                    const result = await syncCore.backup();
                    alert('✓ Backup created successfully!\n\nFile: ' + result.filename);
                    
                    button.textContent = '📥 Create Backup Now';
                    button.disabled = false;
                    
                    loadBackupsList();
                } catch (error) {
                    alert('✗ Backup failed: ' + error.message);
                    modal.querySelector('#manual-backup').textContent = '📥 Create Backup Now';
                    modal.querySelector('#manual-backup').disabled = false;
                }
            });

            // Refresh backups
            modal.querySelector('#refresh-backups')?.addEventListener('click', loadBackupsList);

            // Clear configuration
            modal.querySelector('#clear-config')?.addEventListener('click', () => {
                if (confirm('⚠️ This will clear ALL configuration including API token and encryption key. Continue?')) {
                    syncCore.clearConfig();
                    alert('✓ Configuration cleared');
                    overlay.remove();
                }
            });

            // Load backups list
            async function loadBackupsList() {
                const listContainer = modal.querySelector('#backups-list');
                listContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Loading backups...</p>';

                try {
                    const backups = await syncCore.listBackups();
                    
                    if (backups.length === 0) {
                        listContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No backups found</p>';
                        return;
                    }

                    listContainer.innerHTML = backups.map(backup => `
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <strong style="color: #333;">${backup.name}</strong>
                                    <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">
                                        ${new Date(backup.created).toLocaleString()} · ${(backup.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <button class="restore-btn" data-id="${backup.id}" style="padding: 8px 15px; background: #4caf50; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Restore</button>
                                    <button class="delete-btn" data-id="${backup.id}" style="padding: 8px 15px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Delete</button>
                                </div>
                            </div>
                        </div>
                    `).join('');

                    // Restore buttons
                    listContainer.querySelectorAll('.restore-btn').forEach(btn => {
                        btn.onclick = async () => {
                            if (!confirm('⚠️ This will restore this backup and overwrite current TypingMind data. Continue?')) {
                                return;
                            }

                            try {
                                btn.textContent = 'Restoring...';
                                btn.disabled = true;

                                await syncCore.restore(btn.dataset.id);
                                alert('✓ Backup restored successfully!\n\nPlease refresh the page to see changes.');
                                location.reload();
                            } catch (error) {
                                alert('✗ Restore failed: ' + error.message);
                                btn.textContent = 'Restore';
                                btn.disabled = false;
                            }
                        };
                    });

                    // Delete buttons
                    listContainer.querySelectorAll('.delete-btn').forEach(btn => {
                        btn.onclick = async () => {
                            if (!confirm('Delete this backup?')) {
                                return;
                            }

                            try {
                                btn.textContent = 'Deleting...';
                                btn.disabled = true;

                                await syncCore.deleteBackup(btn.dataset.id);
                                loadBackupsList();
                            } catch (error) {
                                alert('✗ Delete failed: ' + error.message);
                                btn.textContent = 'Delete';
                                btn.disabled = false;
                            }
                        };
                    });

                } catch (error) {
                    listContainer.innerHTML = `<p style="text-align: center; color: #f44336; padding: 20px;">Error loading backups: ${error.message}</p>`;
                }
            }
        }
    }
})();
