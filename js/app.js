// Resume templates and configuration

// DOM Elements
const resumeForm = document.getElementById('resumeForm');
const resumePreview = document.getElementById('resumePreview');
const exportPdfBtn = document.getElementById('exportPdf');
const sampleDataBtn = document.getElementById('sampleDataBtn');
const templateOptions = document.querySelectorAll('.template-option');
const templateColor = document.getElementById('templateColor');
const fontSize = document.getElementById('fontSize');
const spacing = document.getElementById('spacing');
const themeToggle = document.getElementById('themeToggle');

// Initialize theme
const currentTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', currentTheme);
themeToggle.textContent = currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode';

// Theme toggle event
themeToggle.addEventListener('click', toggleTheme);

// Current settings
let currentTemplate = 'modern';
let currentColor = '#2563eb';
let currentFontSize = 'medium';
let currentSpacing = 'normal';

// Sample resume data
const sampleData = {
    fullName: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    jobTitle: 'Full Stack Developer',
    skills: 'JavaScript, React, Node.js, Python, SQL, Git, AWS, REST APIs, TypeScript, Agile Development',
    experience: 'Senior Developer at Tech Solutions Inc. (2020-Present)\n- Led development of cloud-based applications\n- Managed team of 5 developers\n- Improved system performance by 40%\n\nWeb Developer at Digital Innovations (2018-2020)\n- Developed responsive web applications\n- Implemented CI/CD pipelines\n- Reduced bug count by 60%',
    education: 'Master of Computer Science\nTech University (2018)\n\nBachelor of Software Engineering\nState University (2016)',
    projects: 'E-commerce Platform Redesign\n- Led frontend development using React and Redux\n- Improved conversion rate by 25%\n\nAI-Powered Chat Application\n- Developed using Python and TensorFlow\n- Implemented real-time translation for 10 languages',
    certifications: 'AWS Certified Solutions Architect\nGoogle Cloud Professional Developer\nMongoDB Certified Developer',
    languages: 'English (Native), Spanish (Professional), Mandarin (Conversational)',
    interests: 'Cloud Computing, Machine Learning, Open Source Development, Tech Mentoring'
};

// Event Listeners
resumeForm.addEventListener('submit', handleFormSubmit);
exportPdfBtn.addEventListener('click', exportToPdf);
sampleDataBtn.addEventListener('click', fillSampleData);

// Template customization
templateColor.addEventListener('input', (e) => {
    currentColor = e.target.value;
    updateResumeStyles();
});

fontSize.addEventListener('change', (e) => {
    currentFontSize = e.target.value;
    updateResumeStyles();
});

spacing.addEventListener('change', (e) => {
    currentSpacing = e.target.value;
    updateResumeStyles();
});

// Update resume styles
function updateResumeStyles() {
    const resumeElement = resumePreview.querySelector('.resume');
    if (resumeElement) {
        // Update CSS variables
        resumeElement.style.setProperty('--resume-primary', currentColor);
        
        // Update font size and spacing
        resumeElement.dataset.size = currentFontSize;
        resumeElement.dataset.spacing = currentSpacing;
    }
}

// Template selection
templateOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Update active state
        templateOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        // Update current template
        currentTemplate = option.dataset.template;
        
        // Update preview if it exists
        const resumeElement = resumePreview.querySelector('.resume');
        if (resumeElement) {
            resumeElement.dataset.template = currentTemplate;
            updateResumeStyles();
        }
    });
});

// Fill form with sample data
function fillSampleData() {
    document.getElementById('fullName').value = sampleData.fullName;
    document.getElementById('email').value = sampleData.email;
    document.getElementById('jobTitle').value = sampleData.jobTitle;
    document.getElementById('skills').value = sampleData.skills;
    document.getElementById('experience').value = sampleData.experience;
    document.getElementById('education').value = sampleData.education;
    document.getElementById('projects').value = sampleData.projects;
    document.getElementById('certifications').value = sampleData.certifications;
    document.getElementById('languages').value = sampleData.languages;
    document.getElementById('interests').value = sampleData.interests;
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    try {
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            jobTitle: document.getElementById('jobTitle').value,
            skills: document.getElementById('skills').value.split(',').map(skill => skill.trim()),
            experience: document.getElementById('experience').value.split('\n\n'),
            education: document.getElementById('education').value.split('\n\n'),
            projects: document.getElementById('projects').value.split('\n\n'),
            certifications: document.getElementById('certifications').value.split('\n'),
            languages: document.getElementById('languages').value.split(',').map(lang => lang.trim()),
            interests: document.getElementById('interests').value.split(',').map(interest => interest.trim())
        };

        // Show loading state
        const submitBtn = resumeForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Generating...';
        submitBtn.disabled = true;
        resumePreview.classList.add('loading');

        // Create resume element
        const previewElement = document.createElement('div');
        previewElement.className = 'resume';
        previewElement.dataset.template = currentTemplate;
        previewElement.style.setProperty('--resume-primary', currentColor);
        previewElement.dataset.size = currentFontSize;
        previewElement.dataset.spacing = currentSpacing;

        // Generate resume content using template
        const content = `
            <div class="page">
                <header class="resume-header">
                    <h1>${formData.fullName}</h1>
                    <p class="contact-info">${formData.email} | ${formData.jobTitle}</p>
                </header>

                <section class="resume-section">
                    <h2>Skills</h2>
                    <ul class="skills-list">
                        ${formData.skills.map(skill => `<li>${skill}</li>`).join('')}
                    </ul>
                </section>
            </div>

            <div class="page">
                <section class="resume-section">
                    <h2>Experience</h2>
                    ${formData.experience.map(exp => `
                        <div class="experience-item">
                            ${exp.split('\n').map((line, i) => 
                                i === 0 ? `<h3>${line}</h3>` : `<p>${line}</p>`
                            ).join('')}
                        </div>
                    `).join('')}
                </section>
            </div>

            <div class="page">
                <section class="resume-section">
                    <h2>Education</h2>
                    ${formData.education.map(edu => `
                        <div class="education-item">
                            ${edu.split('\n').map((line, i) => 
                                i === 0 ? `<h3>${line}</h3>` : `<p>${line}</p>`
                            ).join('')}
                        </div>
                    `).join('')}
                </section>

                ${formData.projects.length > 0 ? `
                    <section class="resume-section">
                        <h2>Projects</h2>
                        ${formData.projects.map(project => `
                            <div class="project-item">
                                ${project.split('\n').map((line, i) => 
                                    i === 0 ? `<h3>${line}</h3>` : `<p>${line}</p>`
                                ).join('')}
                            </div>
                        `).join('')}
                    </section>
                ` : ''}
            </div>

            <div class="page">
                ${formData.certifications.length > 0 ? `
                    <section class="resume-section">
                        <h2>Certifications</h2>
                        <ul class="cert-list">
                            ${formData.certifications.map(cert => `<li>${cert}</li>`).join('')}
                        </ul>
                    </section>
                ` : ''}

                ${formData.languages.length > 0 ? `
                    <section class="resume-section">
                        <h2>Languages</h2>
                        <p>${formData.languages.join(', ')}</p>
                    </section>
                ` : ''}

                ${formData.interests.length > 0 ? `
                    <section class="resume-section">
                        <h2>Interests</h2>
                        <p>${formData.interests.join(', ')}</p>
                    </section>
                ` : ''}
            </div>
        `;

        // Set the content
        previewElement.innerHTML = content;
        
        // Clear existing preview
        resumePreview.innerHTML = '';
        
        // Add the new preview
        resumePreview.appendChild(previewElement);

        // Update styles
        updateResumeStyles();

        // Show success state
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        resumePreview.classList.remove('loading');
        exportPdfBtn.style.display = 'inline-block';

    } catch (error) {
        console.error('Error:', error);
        alert('Error generating resume: ' + error.message);
        
        // Reset form state
        const submitBtn = resumeForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Generate Resume';
        submitBtn.disabled = false;
        resumePreview.classList.remove('loading');
    }
}
    

// Export resume to PDF
async function exportToPdf() {
    // Get the resume preview element
    const previewElement = document.querySelector('#resumePreview .resume');
    if (!previewElement) {
        alert('Please generate your resume first!');
        return;
    }

    // Show loading state
    const submitBtn = document.getElementById('exportPdf');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Generating PDF...';
    submitBtn.disabled = true;

    try {
        // Create a clone of the preview element with all styles
        const clone = previewElement.cloneNode(true);
        
        // Create a temporary container
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed';
        tempContainer.style.top = '-9999px';
        tempContainer.style.width = '210mm'; // A4 width
        tempContainer.style.height = '297mm'; // A4 height
        tempContainer.style.overflow = 'visible'; // Changed from hidden to visible
        tempContainer.style.padding = '20px'; // Add padding for better content visibility
        tempContainer.style.boxSizing = 'border-box';
        
        tempContainer.appendChild(clone);
        document.body.appendChild(tempContainer);

        // Wait for styles to load
        await new Promise(resolve => setTimeout(resolve, 500));

        // Calculate total height and viewport height
        const totalHeight = clone.scrollHeight;
        const viewportHeight = clone.offsetHeight;
        const pages = Math.ceil(totalHeight / viewportHeight);
        console.log('Total pages needed:', pages);
        console.log('Total height:', totalHeight, 'Viewport height:', viewportHeight);

        // Create a PDF document
        const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (imgWidth * viewportHeight) / clone.offsetWidth;

        // Function to capture a single page
        const capturePage = async (page) => {
            // Calculate exact scroll position
            const scrollPos = page * viewportHeight;
            clone.scrollTop = scrollPos;
            console.log(`Capturing page ${page + 1} of ${pages} - Scroll position: ${scrollPos}`);
            
            // Wait for scroll to complete and content to render
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Create canvas for this page
            return html2canvas(clone, {
                scale: 2,
                logging: true,
                useCORS: true,
                onclone: function(doc) {
                    // Copy all styles from the original document
                    const styleElements = document.querySelectorAll('style, link[rel="stylesheet"]');
                    styleElements.forEach(style => {
                        if (style.tagName === 'STYLE') {
                            const newStyle = doc.createElement('style');
                            newStyle.textContent = style.textContent;
                            doc.head.appendChild(newStyle);
                        } else if (style.tagName === 'LINK') {
                            const newLink = doc.createElement('link');
                            newLink.rel = 'stylesheet';
                            newLink.href = style.href;
                            doc.head.appendChild(newLink);
                        }
                    });
                }
            });
        };

        // Capture each page
        for (let page = 0; page < pages; page++) {
            capturePage(page).then(canvas => {
                // Convert canvas to image
                const imgData = canvas.toDataURL('image/png');
                
                // Add to PDF
                if (page === 0) {
                    // First page
                    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                } else {
                    // Add new page and add image
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                }

                // If this is the last page, save the PDF
                if (page === pages - 1) {
                    console.log('Saving PDF with', pages, 'pages');
                    pdf.save('resume.pdf');
                    
                    // Clean up
                    tempContainer.remove();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }).catch(error => {
                console.error('Error capturing page:', error);
                alert('Failed to capture page. Error: ' + error.message);
                tempContainer.remove();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        }
    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF: ' + error.message);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Toggle theme function
function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('theme', newTheme);
}
