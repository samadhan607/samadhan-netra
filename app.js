// CivicConnect JavaScript Application
class CivicConnectApp {
    constructor() {
        this.currentSection = 'home';
        this.isAdminLoggedIn = false;
        this.currentLanguage = 'en';
        this.currentTheme = 'light';
        this.charts = {};
        
        // Sample data - in production would come from API
        this.data = {
            issues: [
                {
                    id: "CVC2025001",
                    title: "Large Pothole on MG Road",
                    description: "Deep pothole causing accidents near City Mall junction. Multiple vehicles damaged.",
                    category: "Roads",
                    location: "MG Road, Sector 14, Mumbai",
                    coordinates: "19.0760,72.8777",
                    priority: "High",
                    status: "In Progress",
                    reportedBy: "Rahul Sharma",
                    reportDate: "2025-01-15",
                    assignedTo: "Mumbai Municipal Corporation - Roads Department",
                    votes: 45,
                    comments: 12,
                    images: ["pothole1.jpg"],
                    timeline: [
                        {status: "Reported", date: "2025-01-15", note: "Issue submitted by citizen"},
                        {status: "Assigned", date: "2025-01-16", note: "Assigned to Roads Department"},
                        {status: "In Progress", date: "2025-01-18", note: "Work started, materials arranged"}
                    ]
                },
                {
                    id: "CVC2025002", 
                    title: "Street Light Not Working",
                    description: "स्ट्रीट लाइट 3 महीने से काम नहीं कर रही। रात में सुरक्षा की समस्या।",
                    category: "Street Lights",
                    location: "Sector 21, Noida",
                    coordinates: "28.5355,77.3910",
                    priority: "Medium",
                    status: "Resolved",
                    reportedBy: "Priya Singh",
                    reportDate: "2025-01-10",
                    assignedTo: "Noida Authority - Electrical Department", 
                    votes: 23,
                    comments: 8,
                    timeline: [
                        {status: "Reported", date: "2025-01-10"},
                        {status: "Assigned", date: "2025-01-11"},
                        {status: "In Progress", date: "2025-01-12"},
                        {status: "Resolved", date: "2025-01-14", note: "New LED light installed"}
                    ]
                },
                {
                    id: "CVC2025003",
                    title: "Water Supply Disruption",
                    description: "No water supply for 4 days in residential area. Affecting 200+ families.",
                    category: "Water Supply",
                    location: "Koramangala, Bengaluru",
                    coordinates: "12.9352,77.6245",
                    priority: "Emergency",
                    status: "Assigned",
                    reportedBy: "Amit Kumar",
                    reportDate: "2025-01-20",
                    assignedTo: "BWSSB - Water Distribution",
                    votes: 67,
                    comments: 24,
                    timeline: [
                        {status: "Reported", date: "2025-01-20", note: "Emergency issue reported"},
                        {status: "Assigned", date: "2025-01-20", note: "Assigned to Water Distribution team"}
                    ]
                }
            ],
            categories: [
                {name: "Roads", icon: "🛣️", count: 145},
                {name: "Water Supply", icon: "💧", count: 89},
                {name: "Electricity", icon: "⚡", count: 76},
                {name: "Waste Management", icon: "🗑️", count: 112},
                {name: "Street Lights", icon: "💡", count: 54},
                {name: "Public Transport", icon: "🚌", count: 32},
                {name: "Parks & Gardens", icon: "🌳", count: 28},
                {name: "Building & Construction", icon: "🏗️", count: 41}
            ],
            departments: [
                {name: "Mumbai Municipal Corporation", responseTime: "2.3 days", resolutionRate: "78%"},
                {name: "Delhi Municipal Corporation", responseTime: "3.1 days", resolutionRate: "71%"},
                {name: "BBMP Bengaluru", responseTime: "1.8 days", resolutionRate: "82%"},
                {name: "Chennai Corporation", responseTime: "2.7 days", resolutionRate: "75%"}
            ],
            stats: {
                totalIssues: 1247,
                resolvedIssues: 967,
                activeUsers: 34567,
                avgResolutionTime: "2.4 days",
                satisfactionRate: "78%"
            }
        };

        this.filteredIssues = [...this.data.issues];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateCategories();
        this.populateForm();
        this.showSection('home');
        this.updateDashboardStats();
        this.renderIssues();
        this.loadStoredData();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.showSection(section);
            });
        });

        // Navigation from buttons with data-section
        document.querySelectorAll('[data-section]').forEach(btn => {
            if (!btn.classList.contains('nav-btn')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const section = e.target.dataset.section;
                    this.showSection(section);
                });
            }
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Language toggle
        document.getElementById('languageToggle').addEventListener('click', () => {
            this.toggleLanguage();
        });

        // Report form
        document.getElementById('reportForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitIssue();
        });

        // Current location
        document.getElementById('getCurrentLocation').addEventListener('click', () => {
            this.getCurrentLocation();
        });

        // Search and filters
        document.getElementById('searchIssues').addEventListener('input', (e) => {
            this.filterIssues();
        });

        document.getElementById('filterCategory').addEventListener('change', () => {
            this.filterIssues();
        });

        document.getElementById('filterStatus').addEventListener('change', () => {
            this.filterIssues();
        });

        // Admin login
        document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.adminLogin();
        });

        document.getElementById('adminLogout').addEventListener('click', () => {
            this.adminLogout();
        });

        // Admin filters
        document.getElementById('adminFilterStatus').addEventListener('change', () => {
            this.renderAdminIssues();
        });

        // Modal
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('issueModal').addEventListener('click', (e) => {
            if (e.target.id === 'issueModal') {
                this.closeModal();
            }
        });

        // Notification
        document.getElementById('closeNotification').addEventListener('click', () => {
            this.hideNotification();
        });

        // Bulk actions
        document.getElementById('bulkAssign').addEventListener('click', () => {
            this.showNotification('Bulk assignment feature coming soon!');
        });

        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Show section
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;

        // Load section-specific content
        if (sectionName === 'analytics') {
            setTimeout(() => this.initCharts(), 100);
        }
        if (sectionName === 'dashboard') {
            this.renderIssues();
        }
        if (sectionName === 'admin') {
            if (this.isAdminLoggedIn) {
                this.renderAdminIssues();
            }
        }
    }

    populateCategories() {
        const categoriesGrid = document.getElementById('categoriesPreview');
        const categorySelect = document.getElementById('issueCategory');
        const filterCategory = document.getElementById('filterCategory');

        // Populate categories preview
        categoriesGrid.innerHTML = this.data.categories.map(cat => `
            <div class="category-card" onclick="civicApp.showSection('report')">
                <div class="category-icon">${cat.icon}</div>
                <div class="category-name">${cat.name}</div>
                <div class="category-count">${cat.count} issues</div>
            </div>
        `).join('');

        // Populate form select
        categorySelect.innerHTML = '<option value="">Select Category</option>' + 
            this.data.categories.map(cat => `<option value="${cat.name}">${cat.icon} ${cat.name}</option>`).join('');

        // Populate filter select
        filterCategory.innerHTML = '<option value="">All Categories</option>' + 
            this.data.categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
    }

    populateForm() {
        // Add current date as default for reporting
        const today = new Date().toISOString().split('T')[0];
        // Form is ready for user input
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            document.getElementById('getCurrentLocation').innerHTML = '📍 Getting location...';
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    document.getElementById('issueLocation').value = `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)} (Location detected)`;
                    document.getElementById('getCurrentLocation').innerHTML = '📍 Use Current Location';
                    this.showNotification('Location detected successfully!');
                },
                (error) => {
                    document.getElementById('getCurrentLocation').innerHTML = '📍 Use Current Location';
                    this.showNotification('Unable to get location. Please enter manually.', 'error');
                }
            );
        } else {
            this.showNotification('Geolocation is not supported by this browser.', 'error');
        }
    }

    submitIssue() {
        const form = document.getElementById('reportForm');
        const formData = new FormData(form);
        
        const newIssue = {
            id: `CVC2025${String(this.data.issues.length + 1).padStart(3, '0')}`,
            title: document.getElementById('issueTitle').value,
            description: document.getElementById('issueDescription').value,
            category: document.getElementById('issueCategory').value,
            location: document.getElementById('issueLocation').value,
            priority: document.getElementById('issuePriority').value,
            status: 'Reported',
            reportedBy: document.getElementById('reporterName').value,
            reportDate: new Date().toISOString().split('T')[0],
            assignedTo: '',
            votes: 0,
            comments: 0,
            timeline: [{
                status: 'Reported',
                date: new Date().toISOString().split('T')[0],
                note: 'Issue submitted by citizen'
            }]
        };

        this.data.issues.unshift(newIssue);
        this.data.stats.totalIssues++;
        this.saveData();
        
        form.reset();
        this.showNotification(`Issue reported successfully! Your issue ID is: ${newIssue.id}`);
        
        // Show dashboard after 2 seconds
        setTimeout(() => {
            this.showSection('dashboard');
        }, 2000);
    }

    filterIssues() {
        const searchTerm = document.getElementById('searchIssues').value.toLowerCase();
        const categoryFilter = document.getElementById('filterCategory').value;
        const statusFilter = document.getElementById('filterStatus').value;

        this.filteredIssues = this.data.issues.filter(issue => {
            const matchesSearch = issue.title.toLowerCase().includes(searchTerm) ||
                                issue.description.toLowerCase().includes(searchTerm) ||
                                issue.location.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryFilter || issue.category === categoryFilter;
            const matchesStatus = !statusFilter || issue.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });

        this.renderIssues();
    }

    renderIssues() {
        const container = document.getElementById('issuesContainer');
        
        if (this.filteredIssues.length === 0) {
            container.innerHTML = `
                <div class="text-center" style="padding: var(--space-32);">
                    <h3>No issues found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredIssues.map(issue => `
            <div class="issue-card" onclick="civicApp.showIssueDetails('${issue.id}')">
                <div class="issue-header">
                    <h3 class="issue-title">${issue.title}</h3>
                    <span class="issue-id">${issue.id}</span>
                </div>
                <div class="issue-meta">
                    <span class="issue-category">📂 ${issue.category}</span>
                    <span class="issue-location">📍 ${issue.location}</span>
                    <span class="issue-date">📅 ${issue.reportDate}</span>
                </div>
                <p class="issue-description">${issue.description.substring(0, 150)}${issue.description.length > 150 ? '...' : ''}</p>
                <div class="issue-footer">
                    <div class="issue-actions">
                        <span class="issue-status status-${issue.status.toLowerCase().replace(' ', '-')}">${issue.status}</span>
                        <span class="issue-status priority-${issue.priority.toLowerCase()}">${issue.priority} Priority</span>
                    </div>
                    <div class="vote-section">
                        <button class="vote-btn" onclick="event.stopPropagation(); civicApp.voteIssue('${issue.id}', 'up')">👍</button>
                        <span class="vote-count">${issue.votes}</span>
                        <button class="vote-btn" onclick="event.stopPropagation(); civicApp.voteIssue('${issue.id}', 'down')">👎</button>
                        <span style="margin-left: var(--space-12); color: var(--color-text-secondary);">💬 ${issue.comments}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    voteIssue(issueId, voteType) {
        const issue = this.data.issues.find(i => i.id === issueId);
        if (issue) {
            if (voteType === 'up') {
                issue.votes++;
            } else {
                issue.votes = Math.max(0, issue.votes - 1);
            }
            this.saveData();
            this.renderIssues();
            this.showNotification('Vote recorded!');
        }
    }

    showIssueDetails(issueId) {
        const issue = this.data.issues.find(i => i.id === issueId);
        if (!issue) return;

        document.getElementById('modalIssueTitle').textContent = issue.title;
        document.getElementById('modalIssueContent').innerHTML = `
            <div class="issue-details">
                <div class="issue-meta mb-16">
                    <span class="issue-status status-${issue.status.toLowerCase().replace(' ', '-')}">${issue.status}</span>
                    <span class="issue-status priority-${issue.priority.toLowerCase()}">${issue.priority} Priority</span>
                    <span style="color: var(--color-text-secondary);">ID: ${issue.id}</span>
                </div>
                
                <div class="mb-16">
                    <strong>📂 Category:</strong> ${issue.category}<br>
                    <strong>📍 Location:</strong> ${issue.location}<br>
                    <strong>👤 Reported by:</strong> ${issue.reportedBy}<br>
                    <strong>📅 Date:</strong> ${issue.reportDate}
                </div>

                <div class="mb-16">
                    <strong>Description:</strong><br>
                    <p>${issue.description}</p>
                </div>

                ${issue.assignedTo ? `<div class="mb-16"><strong>🏛️ Assigned to:</strong> ${issue.assignedTo}</div>` : ''}

                <div class="mb-16">
                    <strong>Community Engagement:</strong><br>
                    👍 ${issue.votes} votes | 💬 ${issue.comments} comments
                </div>

                ${issue.timeline ? `
                <div class="timeline">
                    <h4>Progress Timeline</h4>
                    ${issue.timeline.map(item => `
                        <div class="timeline-item">
                            <div class="timeline-status">${item.status}</div>
                            <div class="timeline-date">${item.date}</div>
                            ${item.note ? `<div class="timeline-note">${item.note}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <div style="margin-top: var(--space-20); text-align: center;">
                    <button class="btn btn--outline" onclick="civicApp.shareIssue('${issue.id}')">📤 Share Issue</button>
                    <button class="btn btn--secondary" onclick="civicApp.contactOfficial('${issue.id}')">📞 Contact Official</button>
                </div>
            </div>
        `;

        document.getElementById('issueModal').classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('issueModal').classList.add('hidden');
    }

    shareIssue(issueId) {
        if (navigator.share) {
            navigator.share({
                title: 'Civic Issue Report',
                text: `Check out this civic issue: ${issueId}`,
                url: window.location.href
            });
        } else {
            // Fallback
            const url = `${window.location.href}?issue=${issueId}`;
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Issue link copied to clipboard!');
            });
        }
    }

    contactOfficial(issueId) {
        const issue = this.data.issues.find(i => i.id === issueId);
        if (issue && issue.assignedTo) {
            this.showNotification(`Contact information for ${issue.assignedTo} would be provided in production.`);
        } else {
            this.showNotification('This issue has not been assigned to a department yet.');
        }
    }

    adminLogin() {
        const deptId = document.getElementById('departmentId').value;
        const password = document.getElementById('adminPassword').value;

        // Simple demo authentication
        if (deptId === 'mumbai_admin' && password === 'admin123') {
            this.isAdminLoggedIn = true;
            document.getElementById('adminLogin').classList.add('hidden');
            document.getElementById('adminDashboard').classList.remove('hidden');
            this.updateAdminStats();
            this.renderAdminIssues();
            this.showNotification('Welcome to the Admin Dashboard!');
        } else {
            this.showNotification('Invalid credentials. Try mumbai_admin / admin123', 'error');
        }
    }

    adminLogout() {
        this.isAdminLoggedIn = false;
        document.getElementById('adminLogin').classList.remove('hidden');
        document.getElementById('adminDashboard').classList.add('hidden');
        document.getElementById('departmentId').value = '';
        document.getElementById('adminPassword').value = '';
    }

    updateAdminStats() {
        const newIssues = this.data.issues.filter(i => i.status === 'Reported').length;
        const assigned = this.data.issues.filter(i => i.status === 'Assigned').length;
        const inProgress = this.data.issues.filter(i => i.status === 'In Progress').length;
        const resolvedToday = this.data.issues.filter(i => 
            i.status === 'Resolved' && i.timeline && 
            i.timeline.some(t => t.status === 'Resolved' && t.date === new Date().toISOString().split('T')[0])
        ).length;

        document.getElementById('adminNewIssues').textContent = newIssues;
        document.getElementById('adminAssignedIssues').textContent = assigned;
        document.getElementById('adminInProgressIssues').textContent = inProgress;
        document.getElementById('adminResolvedIssues').textContent = resolvedToday;
    }

    renderAdminIssues() {
        const container = document.getElementById('adminIssuesContainer');
        const statusFilter = document.getElementById('adminFilterStatus').value;
        
        let issuesToShow = this.data.issues;
        if (statusFilter) {
            issuesToShow = this.data.issues.filter(i => i.status === statusFilter);
        }

        container.innerHTML = issuesToShow.map(issue => `
            <div class="admin-issue-card">
                <div class="admin-issue-header">
                    <div>
                        <h4>${issue.title}</h4>
                        <div class="issue-meta">
                            <span>📂 ${issue.category}</span>
                            <span>📍 ${issue.location}</span>
                            <span>⚡ ${issue.priority}</span>
                            <span>ID: ${issue.id}</span>
                        </div>
                    </div>
                    <div class="admin-actions">
                        <select class="status-select" onchange="civicApp.updateIssueStatus('${issue.id}', this.value)">
                            <option value="Reported" ${issue.status === 'Reported' ? 'selected' : ''}>Reported</option>
                            <option value="Assigned" ${issue.status === 'Assigned' ? 'selected' : ''}>Assigned</option>
                            <option value="In Progress" ${issue.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Under Review" ${issue.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
                            <option value="Resolved" ${issue.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                        </select>
                        <button class="btn btn--outline btn--sm" onclick="civicApp.showIssueDetails('${issue.id}')">View</button>
                    </div>
                </div>
                <p>${issue.description.substring(0, 200)}${issue.description.length > 200 ? '...' : ''}</p>
                <div style="margin-top: var(--space-12); color: var(--color-text-secondary);">
                    👍 ${issue.votes} votes | 💬 ${issue.comments} comments | 📅 ${issue.reportDate}
                </div>
            </div>
        `).join('');
    }

    updateIssueStatus(issueId, newStatus) {
        const issue = this.data.issues.find(i => i.id === issueId);
        if (issue && issue.status !== newStatus) {
            issue.status = newStatus;
            
            // Add to timeline
            if (!issue.timeline) issue.timeline = [];
            issue.timeline.push({
                status: newStatus,
                date: new Date().toISOString().split('T')[0],
                note: `Status updated by admin`
            });

            // Auto-assign if moving to assigned
            if (newStatus === 'Assigned' && !issue.assignedTo) {
                issue.assignedTo = 'Mumbai Municipal Corporation - General Department';
            }

            this.saveData();
            this.updateAdminStats();
            this.showNotification(`Issue ${issueId} updated to: ${newStatus}`);
        }
    }

    updateDashboardStats() {
        const totalIssues = this.data.issues.length;
        const resolvedIssues = this.data.issues.filter(i => i.status === 'Resolved').length;
        const pendingIssues = totalIssues - resolvedIssues;

        document.getElementById('totalIssuesCount').textContent = totalIssues;
        document.getElementById('pendingIssuesCount').textContent = pendingIssues;
        document.getElementById('resolvedIssuesCount').textContent = resolvedIssues;
        document.getElementById('avgResolutionTime').textContent = this.data.stats.avgResolutionTime;
    }

    initCharts() {
        this.createCategoryChart();
        this.createTrendsChart();
        this.createPerformanceChart();
        this.createGeoChart();
    }

    createCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        if (this.charts.category) {
            this.charts.category.destroy();
        }

        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.data.categories.map(cat => cat.name),
                datasets: [{
                    data: this.data.categories.map(cat => cat.count),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createTrendsChart() {
        const ctx = document.getElementById('trendsChart');
        if (!ctx) return;

        if (this.charts.trends) {
            this.charts.trends.destroy();
        }

        // Generate sample trend data
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const reported = [45, 52, 48, 61, 58, 67];
        const resolved = [38, 45, 42, 55, 52, 59];

        this.charts.trends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Reported',
                        data: reported,
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Resolved',
                        data: resolved,
                        borderColor: '#5D878F',
                        backgroundColor: 'rgba(93, 135, 143, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    createPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        if (this.charts.performance) {
            this.charts.performance.destroy();
        }

        this.charts.performance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.data.departments.map(dept => dept.name.split(' ')[0]),
                datasets: [{
                    label: 'Resolution Rate (%)',
                    data: this.data.departments.map(dept => parseInt(dept.resolutionRate)),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    createGeoChart() {
        const ctx = document.getElementById('geoChart');
        if (!ctx) return;

        if (this.charts.geo) {
            this.charts.geo.destroy();
        }

        // Sample geographic distribution
        const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad'];
        const issueCounts = [234, 187, 156, 143, 98];

        this.charts.geo = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: cities,
                datasets: [{
                    label: 'Issues Reported',
                    data: issueCounts,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    exportData() {
        const dataToExport = {
            exportDate: new Date().toISOString(),
            totalIssues: this.data.issues.length,
            issues: this.data.issues,
            categories: this.data.categories,
            stats: this.data.stats
        };

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `civic_issues_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Data exported successfully!');
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-color-scheme', this.currentTheme);
        document.getElementById('themeToggle').textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        
        // Reinitialize charts with new theme
        if (this.currentSection === 'analytics') {
            setTimeout(() => this.initCharts(), 100);
        }
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'hi' : 'en';
        document.getElementById('languageToggle').textContent = this.currentLanguage === 'en' ? 'हिं/EN' : 'EN/हिं';
        
        // In a real app, this would change all text content
        this.showNotification(
            this.currentLanguage === 'hi' 
                ? 'भाषा बदल दी गई (भविष्य की सुविधा)' 
                : 'Language changed (Future feature)'
        );
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const messageEl = document.getElementById('notificationMessage');
        
        messageEl.textContent = message;
        notification.className = `notification show ${type}`;
        
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
    }

    hideNotification() {
        const notification = document.getElementById('notification');
        notification.classList.remove('show');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300);
    }

    saveData() {
        // In production, this would save to a backend
        // For demo, we'll use localStorage simulation
        localStorage.setItem('civicConnectData', JSON.stringify(this.data));
    }

    loadStoredData() {
        const stored = localStorage.getItem('civicConnectData');
        if (stored) {
            try {
                const parsedData = JSON.parse(stored);
                // Merge with default data, keeping defaults for categories and departments
                this.data.issues = parsedData.issues || this.data.issues;
                this.data.stats = { ...this.data.stats, ...parsedData.stats };
                this.filteredIssues = [...this.data.issues];
                this.updateDashboardStats();
            } catch (e) {
                console.log('Could not load stored data:', e);
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.civicApp = new CivicConnectApp();
});

// Service Worker for PWA features (basic implementation)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // In production, register actual service worker
        console.log('PWA features ready for implementation');
    });
}

// Additional utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getStatusIcon(status) {
    const icons = {
        'Reported': '📝',
        'Assigned': '👤',
        'In Progress': '⚠️',
        'Under Review': '🔍',
        'Resolved': '✅'
    };
    return icons[status] || '📄';
}

function getPriorityColor(priority) {
    const colors = {
        'Low': 'var(--color-success)',
        'Medium': 'var(--color-warning)',
        'High': 'var(--color-orange-500)',
        'Emergency': 'var(--color-error)'
    };
    return colors[priority] || 'var(--color-info)';
}