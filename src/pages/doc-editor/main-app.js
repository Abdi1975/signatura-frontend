// main-app.js - Main application logic

// Initialize Fabric handler
const fabricHandler = new FabricHandler();

// Application state
let currentDocument = null;
let pdfDoc = null;
let currentPage = 1;
let signatureMethod = null;
let selectedFormat = 'png';

// Paraf synchronization state
let parafSyncData = {};
let currentParafInstances = [];

// Page range selection state
let parafPageRange = 'all'; // 'all' or 'custom'
let selectedPages = []; // Array of selected page numbers for paraf

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Parse page range string (e.g., "1,3,5-8,10") into array of page numbers
function parsePageRange(rangeText) {
    const pages = new Set();
    const parts = rangeText.split(',').map(part => part.trim());

    parts.forEach(part => {
        if (part.includes('-')) {
            // Range like "5-8"
            const [start, end] = part.split('-').map(num => parseInt(num.trim()));
            if (!isNaN(start) && !isNaN(end) && start <= end) {
                for (let i = start; i <= end; i++) {
                    pages.add(i);
                }
            }
        } else {
            // Single page like "3"
            const pageNum = parseInt(part);
            if (!isNaN(pageNum) && pageNum > 0) {
                pages.add(pageNum);
            }
        }
    });

    return Array.from(pages).sort((a, b) => a - b);
}

// Check if current page should have paraf applied
function shouldApplyParafToPage(pageNum) {
    if (parafPageRange === 'all') {
        return true;
    } else if (parafPageRange === 'custom') {
        return selectedPages.includes(pageNum);
    }
    return false;
}

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Initialize event listeners
function initializeEventListeners() {
    // File upload handling
    document.getElementById('document-file').addEventListener('change', handleFileUpload);
    
    // Drag and drop for document
    const uploadArea = document.querySelector('.upload-area');
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // Continue to editor button
    document.getElementById('continue-to-editor').addEventListener('click', function() {
        showPage('editor-page');
        initializeEditor();
    });

    // Back to upload button
    document.getElementById('back-to-upload').addEventListener('click', function() {
        showPage('upload-page');
    });

    // Format selection
    document.querySelectorAll('.format-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.format-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            selectedFormat = this.dataset.format;
        });
    });

    // Signature method selection
    document.getElementById('draw-option').addEventListener('click', function() {
        signatureMethod = 'draw';
        updateSignatureOptions();
        document.getElementById('signature-creator').style.display = 'block';
        document.getElementById('signature-uploader').style.display = 'none';
        fabricHandler.initSignatureCanvas();
    });

    document.getElementById('upload-option').addEventListener('click', function() {
        signatureMethod = 'upload';
        updateSignatureOptions();
        document.getElementById('signature-creator').style.display = 'none';
        document.getElementById('signature-uploader').style.display = 'block';
    });

    document.getElementById('paraf-option').addEventListener('click', function() {
        signatureMethod = 'paraf';
        updateSignatureOptions();
        document.getElementById('signature-creator').style.display = 'none';
        document.getElementById('signature-uploader').style.display = 'none';
        document.getElementById('paraf-creator').style.display = 'block';
        fabricHandler.initParafCanvas();
    });

    // Signature controls
    document.getElementById('brush-size').addEventListener('input', function() {
        fabricHandler.setBrushSize(this.value);
    });

    document.getElementById('brush-color').addEventListener('change', function() {
        fabricHandler.setBrushColor(this.value);
    });

    document.getElementById('clear-signature').addEventListener('click', function() {
        fabricHandler.clearSignature();
    });

    document.getElementById('save-signature').addEventListener('click', function() {
        const signature = fabricHandler.saveSignature();
        if (signature) {
            showSignatureSaved();
        } else {
            alert('Please create a signature first!');
        }
    });

    // Paraf controls
    document.getElementById('paraf-brush-size').addEventListener('input', function() {
        fabricHandler.setParafBrushSize(this.value);
    });

    document.getElementById('paraf-brush-color').addEventListener('change', function() {
        fabricHandler.setParafBrushColor(this.value);
    });

    document.getElementById('clear-paraf').addEventListener('click', function() {
        fabricHandler.clearParaf();
    });

    document.getElementById('save-paraf').addEventListener('click', function() {
        const paraf = fabricHandler.saveParaf();
        if (paraf) {
            showParafSaved();
        } else {
            alert('Silakan buat paraf terlebih dahulu!');
        }
    });

    // Upload signature handling
    document.getElementById('signature-file').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File terlalu besar. Maksimal 5MB.');
                return;
            }
            
            fabricHandler.processUploadedSignature(file, (signature) => {
                const previewImg = document.getElementById('signature-preview-img');
                previewImg.src = signature;
                document.getElementById('signature-preview').style.display = 'block';
            });
        }
    });

    document.getElementById('confirm-signature').addEventListener('click', function() {
        if (fabricHandler.getCurrentSignature()) {
            showSignatureSaved();
        }
    });

    document.getElementById('change-signature').addEventListener('click', function() {
        document.getElementById('current-signature').style.display = 'none';
        document.getElementById('add-signature').disabled = true;
        if (signatureMethod === 'draw') {
            document.getElementById('signature-creator').style.display = 'block';
        } else {
            document.getElementById('signature-uploader').style.display = 'block';
        }
    });

    document.getElementById('change-paraf').addEventListener('click', function() {
        document.getElementById('current-paraf').style.display = 'none';
        document.getElementById('add-paraf').disabled = true;
        document.getElementById('paraf-creator').style.display = 'block';
        fabricHandler.initParafCanvas();
    });

    // Page range selection for paraf
    document.getElementById('all-pages').addEventListener('change', function() {
        if (this.checked) {
            parafPageRange = 'all';
            document.getElementById('custom-range-input').style.display = 'none';
        }
    });

    document.getElementById('custom-range').addEventListener('change', function() {
        if (this.checked) {
            parafPageRange = 'custom';
            document.getElementById('custom-range-input').style.display = 'block';
        }
    });

    document.getElementById('page-range-text').addEventListener('input', function() {
        const rangeText = this.value.trim();
        if (rangeText) {
            selectedPages = parsePageRange(rangeText);
        } else {
            selectedPages = [];
        }
    });

    // PDF Navigation
    document.getElementById('prev-page').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderPDFPage(currentPage);
        }
    });

    document.getElementById('next-page').addEventListener('click', function() {
        if (pdfDoc && currentPage < pdfDoc.numPages) {
            currentPage++;
            renderPDFPage(currentPage);
        }
    });

    // Editor controls
    document.getElementById('add-signature').addEventListener('click', () => {
        fabricHandler.addSignatureToDocument();
    });

    document.getElementById('add-paraf').addEventListener('click', () => {
        fabricHandler.addParafToDocument();
    });

    document.getElementById('delete-selected').addEventListener('click', function() {
        fabricHandler.deleteSelected();
    });

    // Download functions
    document.getElementById('download-page').addEventListener('click', function() {
        if (fabricHandler.hasDocumentCanvas()) {
            const loading = document.getElementById('loading');
            loading.style.display = 'block';
            
            setTimeout(() => {
                downloadCurrentPage();
                loading.style.display = 'none';
            }, 500);
        }
    });

    document.getElementById('download-all-pages').addEventListener('click', function() {
        if (pdfDoc && pdfDoc.numPages > 1) {
            downloadAllPages();
        } else {
            // For single page documents, just download the current page
            document.getElementById('download-page').click();
        }
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Delete selected signature with Delete key
        if (e.key === 'Delete' && fabricHandler.hasDocumentCanvas()) {
            fabricHandler.deleteSelected();
        }
        
        // Add signature with Ctrl+A
        if (e.ctrlKey && e.key === 'a' && fabricHandler.getCurrentSignature() && fabricHandler.hasDocumentCanvas()) {
            e.preventDefault();
            fabricHandler.addSignatureToDocument();
        }
        
        // Save with Ctrl+S
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            if (fabricHandler.hasDocumentCanvas()) {
                document.getElementById('download-page').click();
            }
        }
    });
}

function updateSignatureOptions() {
    document.querySelectorAll('.signature-option').forEach(opt => {
        opt.classList.remove('active');
    });
    if (signatureMethod === 'draw') {
        document.getElementById('draw-option').classList.add('active');
    } else if (signatureMethod === 'upload') {
        document.getElementById('upload-option').classList.add('active');
    } else if (signatureMethod === 'paraf') {
        document.getElementById('paraf-option').classList.add('active');
    }
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
        alert('Format file tidak didukung. Gunakan JPG, PNG, atau PDF.');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert('File terlalu besar. Maksimal 10MB.');
        return;
    }

    document.getElementById('file-name').textContent = file.name;
    document.getElementById('current-file').style.display = 'block';
    
    if (file.type === 'application/pdf') {
        loadPDF(file);
    } else {
        loadImage(file);
    }
}

function loadPDF(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const typedarray = new Uint8Array(e.target.result);
        
        pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
            pdfDoc = pdf;
            currentPage = 1;
            currentDocument = 'pdf';
            console.log('PDF loaded successfully');
        });
    };
    reader.readAsArrayBuffer(file);
}

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        currentDocument = e.target.result;
        console.log('Image loaded successfully');
    };
    reader.readAsDataURL(file);
}

function initializeEditor() {
    if (currentDocument) {
        document.getElementById('document-placeholder').style.display = 'none';
        document.getElementById('document-canvas').style.display = 'block';
        
        fabricHandler.initDocumentCanvas();
        
        if (currentDocument === 'pdf') {
            document.getElementById('pdf-navigation').style.display = 'flex';
            document.getElementById('page-count').textContent = pdfDoc.numPages;
            renderPDFPage(currentPage);
        } else {
            document.getElementById('pdf-navigation').style.display = 'none';
            fabricHandler.loadImageIntoCanvas(currentDocument);
        }
    }
}

function renderPDFPage(pageNum) {
    if (!pdfDoc) return;
    
    const loading = document.getElementById('loading');
    loading.style.display = 'block';
    
    pdfDoc.getPage(pageNum).then(function(page) {
        const scale = 2; // Increased scale for better quality
        const viewport = page.getViewport({ scale: scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        
        page.render(renderContext).promise.then(function() {
            const imageData = canvas.toDataURL('image/png', 1.0); // High quality PNG

            fabricHandler.loadPDFPage(imageData, viewport).then(() => {
                document.getElementById('page-num').textContent = pageNum;
                loading.style.display = 'none';

                // Apply paraf synchronization after page loads
                synchronizeParafsToPage(pageNum);
            });
        });
    });
}

// Render PDF page with synchronization callback
function renderPDFPageWithSync(pageNum, callback) {
    const loading = document.getElementById('loading');

    pdfDoc.getPage(pageNum).then(function(page) {
        const scale = 2;
        const viewport = page.getViewport({ scale: scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        page.render(renderContext).promise.then(function() {
            const imageData = canvas.toDataURL('image/png', 1.0);

            fabricHandler.loadPDFPage(imageData, viewport).then(() => {
                document.getElementById('page-num').textContent = pageNum;

                // Apply paraf synchronization after page loads
                synchronizeParafsToPage(pageNum);

                // Call the callback when done
                if (callback) callback();
            });
        });
    });
}

// Synchronize parafs to the current page
function synchronizeParafsToPage(pageNum) {
    if (!fabricHandler.currentParaf || Object.keys(parafSyncData).length === 0) return;

    // Check if paraf should be applied to this page based on page range selection
    if (!shouldApplyParafToPage(pageNum)) {
        return; // Skip adding paraf to this page
    }

    // Add paraf to current page with synchronized position
    Object.keys(parafSyncData).forEach(parafId => {
        const syncData = parafSyncData[parafId];
        const originalPosition = syncData.originalPosition;

        fabric.Image.fromURL(fabricHandler.currentParaf, (parafImg) => {
            parafImg.set({
                left: originalPosition.left + syncData.deltaX,
                top: originalPosition.top + syncData.deltaY,
                scaleX: originalPosition.scaleX + syncData.scaleDeltaX,
                scaleY: originalPosition.scaleY + syncData.scaleDeltaY,
                angle: originalPosition.angle + syncData.angle,
                selectable: true,
                evented: true,
                hasControls: true,
                hasBorders: true,
                transparentCorners: false,
                cornerColor: '#48bb78',
                cornerStrokeColor: '#1a202c',
                borderColor: '#48bb78',
                borderScaleFactor: 2,
                cornerSize: 12,
                borderOpacityWhenMoving: 0.8,
                isParaf: true,
                parafId: parafId
            });

            fabricHandler.documentCanvas.add(parafImg);
            fabricHandler.setupParafSync(parafImg);
            fabricHandler.documentCanvas.renderAll();
        }, {
            crossOrigin: 'anonymous'
        });
    });
}

function showSignatureSaved() {
    document.getElementById('signature-creator').style.display = 'none';
    document.getElementById('signature-uploader').style.display = 'none';
    document.getElementById('current-signature').style.display = 'block';
    document.getElementById('add-signature').disabled = false;
}

function showParafSaved() {
    document.getElementById('paraf-creator').style.display = 'none';
    document.getElementById('current-paraf').style.display = 'block';
    document.getElementById('add-paraf').disabled = false;

    // Show page range selection only for PDF documents
    if (currentDocument === 'pdf' && pdfDoc && pdfDoc.numPages > 1) {
        document.getElementById('paraf-page-range').style.display = 'block';
    } else {
        document.getElementById('paraf-page-range').style.display = 'none';
    }
}

function downloadCurrentPage() {
    const filename = `signed-document-page-${currentPage}`;
    
    if (selectedFormat === 'pdf') {
        downloadAsPDF(filename);
    } else if (selectedFormat === 'jpg') {
        fabricHandler.exportAsJPG(filename);
    } else {
        fabricHandler.exportAsPNG(filename);
    }
}

function downloadAsPDF(filename) {
    const { jsPDF } = window.jspdf;
    
    // Get canvas dimensions
    const dimensions = fabricHandler.getCanvasDimensions();
    
    // Calculate PDF dimensions (A4 ratio)
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = (dimensions.height * pdfWidth) / dimensions.width;
    
    const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
    });
    
    // Convert canvas to image
    const imgData = fabricHandler.getCanvasImageData('jpeg', 0.9);
    
    // Add image to PDF
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    
    // Save PDF
    pdf.save(`${filename}.pdf`);
}

async function downloadAllPages() {
    if (!pdfDoc || selectedFormat !== 'pdf') {
        alert('Download all pages only available for PDF format');
        return;
    }

    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        let firstPage = true;

        // Store current page to restore later
        const originalPage = currentPage;

        // Determine which pages to download
        let pagesToDownload = [];
        if (parafPageRange === 'custom' && selectedPages.length > 0) {
            pagesToDownload = selectedPages.filter(pageNum => pageNum <= pdfDoc.numPages);
        } else {
            pagesToDownload = Array.from({ length: pdfDoc.numPages }, (_, i) => i + 1);
        }

        for (let pageNum of pagesToDownload) {
            // Navigate to each page
            currentPage = pageNum;

            // Create a promise to wait for page load and paraf synchronization
            await new Promise((resolve) => {
                renderPDFPageWithSync(pageNum, resolve);
            });

            // Wait a bit for paraf synchronization to complete
            await new Promise(resolve => setTimeout(resolve, 500));

            // Get the fabric canvas with all signatures and parafs
            const fabricCanvas = fabricHandler.documentCanvas;
            if (fabricCanvas) {
                // Calculate PDF dimensions based on canvas
                const canvas = fabricCanvas.getElement();
                const pdfWidth = 210; // A4 width in mm
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                if (!firstPage) {
                    pdf.addPage([pdfWidth, pdfHeight]);
                } else {
                    // Set format for first page
                    pdf.internal.pageSize.width = pdfWidth;
                    pdf.internal.pageSize.height = pdfHeight;
                    firstPage = false;
                }

                // Get the complete canvas with signatures and parafs
                const imgData = canvas.toDataURL('image/png', 1.0);
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            }
        }

        // Restore original page
        currentPage = originalPage;
        renderPDFPage(originalPage);

        const filename = parafPageRange === 'custom' && selectedPages.length > 0
            ? 'signed-document-selected-pages.pdf'
            : 'signed-document-all-pages.pdf';
        pdf.save(filename);
    } catch (error) {
        console.error('Error downloading all pages:', error);
        alert('Error occurred while downloading all pages');
    } finally {
        loading.style.display = 'none';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    fabricHandler.enableTouchSupport();
    console.log('PDF Signature Pro - Two Page Layout loaded and ready!');
});