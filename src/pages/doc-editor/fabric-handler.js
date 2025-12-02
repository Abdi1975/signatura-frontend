// fabric-handler.js - Handles all Fabric.js related functionality

class FabricHandler {
    constructor() {
        this.signatureCanvas = null;
        this.documentCanvas = null;
        this.currentSignature = null;
        this.parafCanvas = null;
        this.currentParaf = null;
    }

    // Initialize signature canvas with transparency
    initSignatureCanvas() {
        if (this.signatureCanvas) {
            this.signatureCanvas.dispose();
        }
        this.signatureCanvas = new fabric.Canvas('signature-canvas', {
            isDrawingMode: true,
            backgroundColor: 'transparent'
        });
        
        // Set canvas background to white for visibility during drawing
        this.signatureCanvas.backgroundColor = 'white';
        this.signatureCanvas.renderAll();
        
        this.signatureCanvas.freeDrawingBrush.width = 2;
        this.signatureCanvas.freeDrawingBrush.color = '#000000';
    }

    // Update brush size
    setBrushSize(size) {
        if (this.signatureCanvas) {
            this.signatureCanvas.freeDrawingBrush.width = parseInt(size);
        }
    }

    // Update brush color
    setBrushColor(color) {
        if (this.signatureCanvas) {
            this.signatureCanvas.freeDrawingBrush.color = color;
        }
    }

    // Clear signature canvas
    clearSignature() {
        if (this.signatureCanvas) {
            this.signatureCanvas.clear();
            this.signatureCanvas.backgroundColor = 'white';
            this.signatureCanvas.renderAll();
        }
    }

    // Save signature from canvas
    saveSignature() {
        if (this.signatureCanvas && this.signatureCanvas.getObjects().length > 0) {
            this.signatureCanvas.backgroundColor = 'transparent';
            this.signatureCanvas.renderAll();

            this.currentSignature = this.signatureCanvas.toDataURL({
                format: 'png',
                backgroundColor: 'transparent',
                quality: 1,
                multiplier: 2
            });

            return this.currentSignature;
        }
        return null;
    }

    // Initialize paraf canvas with transparency
    initParafCanvas() {
        if (this.parafCanvas) {
            this.parafCanvas.dispose();
        }
        this.parafCanvas = new fabric.Canvas('paraf-canvas', {
            isDrawingMode: true,
            backgroundColor: 'transparent'
        });

        // Set canvas background to white for visibility during drawing
        this.parafCanvas.backgroundColor = 'white';
        this.parafCanvas.renderAll();

        this.parafCanvas.freeDrawingBrush.width = 2;
        this.parafCanvas.freeDrawingBrush.color = '#000000';
    }

    // Update paraf brush size
    setParafBrushSize(size) {
        if (this.parafCanvas) {
            this.parafCanvas.freeDrawingBrush.width = parseInt(size);
        }
    }

    // Update paraf brush color
    setParafBrushColor(color) {
        if (this.parafCanvas) {
            this.parafCanvas.freeDrawingBrush.color = color;
        }
    }

    // Clear paraf canvas
    clearParaf() {
        if (this.parafCanvas) {
            this.parafCanvas.clear();
            this.parafCanvas.backgroundColor = 'white';
            this.parafCanvas.renderAll();
        }
    }

    // Save paraf from canvas
    saveParaf() {
        if (this.parafCanvas && this.parafCanvas.getObjects().length > 0) {
            this.parafCanvas.backgroundColor = 'transparent';
            this.parafCanvas.renderAll();

            this.currentParaf = this.parafCanvas.toDataURL({
                format: 'png',
                backgroundColor: 'transparent',
                quality: 1,
                multiplier: 2
            });

            return this.currentParaf;
        }
        return null;
    }

    // Process uploaded signature with transparency optimization
    processUploadedSignature(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                
                this.currentSignature = canvas.toDataURL('image/png');
                callback(this.currentSignature);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Initialize document canvas
    initDocumentCanvas() {
        if (this.documentCanvas) {
            this.documentCanvas.dispose();
        }
        this.documentCanvas = new fabric.Canvas('document-canvas', {
            selection: true,
            preserveObjectStacking: true
        });

        // Variables for double-click detection
        let lastClickTime = 0;
        let lastClickedObject = null;
        const doubleClickDelay = 300; // milliseconds

        // Add double-click event listener for editing signatures and parafs
        this.documentCanvas.on('mouse:down', (e) => {
            if (e.button === 1) { // Left click (fabric.js uses 1 for left button)
                const target = e.target;
                const currentTime = Date.now();

                if (target && target.type === 'image' && target !== this.documentCanvas.getObjects()[0]) {
                    // Check if this is a double click on the same object
                    if (lastClickedObject === target && (currentTime - lastClickTime) < doubleClickDelay) {
                        // Double click detected
                        this.handleDoubleClickObject(target);
                        lastClickTime = 0; // Reset to avoid triple-click
                        lastClickedObject = null;
                    } else {
                        // First click
                        lastClickTime = currentTime;
                        lastClickedObject = target;
                    }
                } else {
                    // Click on something else, reset
                    lastClickTime = 0;
                    lastClickedObject = null;
                }
            }
        });
    }

    // Load PDF page into document canvas
    loadPDFPage(imageData, viewport) {
        return new Promise((resolve) => {
            fabric.Image.fromURL(imageData, (img) => {
                this.documentCanvas.clear();
                
                // Don't compress the canvas, maintain original size
                this.documentCanvas.setDimensions({
                    width: viewport.width,
                    height: viewport.height
                });
                
                img.set({
                    selectable: false,
                    evented: false,
                    lockMovementX: true,
                    lockMovementY: true
                });
                
                this.documentCanvas.add(img);
                this.documentCanvas.renderAll();
                resolve();
            });
        });
    }

    // Load image into document canvas
    loadImageIntoCanvas(imageData) {
        fabric.Image.fromURL(imageData, (img) => {
            console.log('Image loaded into canvas:', img.width, 'x', img.height);
            
            // Calculate dimensions to maintain quality without compression
            const maxWidth = 800;
            const maxHeight = 600;
            
            let scale = 1;
            if (img.width > maxWidth) {
                scale = maxWidth / img.width;
            }
            if (img.height * scale > maxHeight) {
                scale = maxHeight / img.height;
            }

            // Maintain high quality even when scaling
            const finalWidth = img.width * scale;
            const finalHeight = img.height * scale;

            img.scale(scale);
            img.set({
                selectable: false,
                evented: false,
                lockMovementX: true,
                lockMovementY: true
            });
            
            this.documentCanvas.setDimensions({
                width: finalWidth,
                height: finalHeight
            });
            
            this.documentCanvas.clear();
            this.documentCanvas.add(img);
            this.documentCanvas.renderAll();
            
            console.log('Canvas dimensions set to:', finalWidth, 'x', finalHeight);
        }, {
            crossOrigin: 'anonymous'
        });
    }

    // Add signature to document with improved transparency
    addSignatureToDocument() {
        if (!this.currentSignature || !this.documentCanvas) return;

        fabric.Image.fromURL(this.currentSignature, (signatureImg) => {
            signatureImg.set({
                left: 100,
                top: 100,
                scaleX: 0.4, // Slightly larger default size
                scaleY: 0.4,
                selectable: true,
                evented: true,
                hasControls: true,
                hasBorders: true,
                transparentCorners: false,
                cornerColor: '#4299e1', // Updated to match dark theme
                cornerStrokeColor: '#1a202c',
                borderColor: '#4299e1',
                borderScaleFactor: 2,
                cornerSize: 12,
                borderOpacityWhenMoving: 0.8
            });

            this.documentCanvas.add(signatureImg);
            this.documentCanvas.setActiveObject(signatureImg);
            this.documentCanvas.renderAll();
        }, {
            crossOrigin: 'anonymous'
        });
    }

    // Add paraf to document with synchronization across all pages
    addParafToDocument() {
        if (!this.currentParaf || !this.documentCanvas) return;

        // Check if paraf should be applied to current page based on page range selection
        if (typeof currentPage !== 'undefined' && typeof shouldApplyParafToPage !== 'undefined') {
            if (!shouldApplyParafToPage(currentPage)) {
                alert('Halaman saat ini tidak termasuk dalam rentang halaman yang dipilih untuk paraf.');
                return;
            }
        }

        fabric.Image.fromURL(this.currentParaf, (parafImg) => {
            parafImg.set({
                left: 100,
                top: 200,
                scaleX: 0.6, // Default size for paraf
                scaleY: 0.6,
                selectable: true,
                evented: true,
                hasControls: true,
                hasBorders: true,
                transparentCorners: false,
                cornerColor: '#48bb78', // Green color for paraf
                cornerStrokeColor: '#1a202c',
                borderColor: '#48bb78',
                borderScaleFactor: 2,
                cornerSize: 12,
                borderOpacityWhenMoving: 0.8,
                isParaf: true, // Custom property to identify paraf objects
                parafId: Date.now() // Unique ID for synchronization
            });

            this.documentCanvas.add(parafImg);
            this.documentCanvas.setActiveObject(parafImg);
            this.documentCanvas.renderAll();

            // Setup event listeners for synchronization
            this.setupParafSync(parafImg);
        }, {
            crossOrigin: 'anonymous'
        });
    }

    // Handle double-click on signature or paraf objects
    handleDoubleClickObject(obj) {
        if (obj.isParaf) {
            this.editParaf(obj);
        } else {
            this.editSignature(obj);
        }
    }

    // Edit paraf object
    editParaf(parafObj) {
        if (typeof window.editParafCallback === 'function') {
            window.editParafCallback(parafObj);
        } else {
            // Fallback: ask user if they want to edit or delete
            const action = confirm('Edit paraf? (OK untuk edit, Cancel untuk hapus)');
            if (!action) {
                // User pressed Cancel, delete the object
                this.documentCanvas.remove(parafObj);
                this.documentCanvas.renderAll();
            } else {
                // User pressed OK, trigger paraf editing
                if (typeof document !== 'undefined' && document.getElementById('paraf-option')) {
                    document.getElementById('paraf-option').click();
                    document.getElementById('current-paraf').style.display = 'none';
                    document.getElementById('paraf-creator').style.display = 'block';

                    // Remove the old paraf
                    this.documentCanvas.remove(parafObj);
                    this.documentCanvas.renderAll();

                    // Clear the current paraf and open editor
                    this.initParafCanvas();
                }
            }
        }
    }

    // Edit signature object
    editSignature(signatureObj) {
        if (typeof window.editSignatureCallback === 'function') {
            window.editSignatureCallback(signatureObj);
        } else {
            // Fallback: ask user if they want to edit or delete
            const action = confirm('Edit signature? (OK untuk edit, Cancel untuk hapus)');
            if (!action) {
                // User pressed Cancel, delete the object
                this.documentCanvas.remove(signatureObj);
                this.documentCanvas.renderAll();
            } else {
                // User pressed OK, trigger signature editing
                if (typeof document !== 'undefined') {
                    // Determine which signature method was used
                    if (document.getElementById('draw-option') && document.getElementById('draw-option').classList.contains('active')) {
                        // Drawing method
                        document.getElementById('current-signature').style.display = 'none';
                        document.getElementById('signature-creator').style.display = 'block';
                        this.initSignatureCanvas();
                    } else if (document.getElementById('upload-option') && document.getElementById('upload-option').classList.contains('active')) {
                        // Upload method
                        document.getElementById('current-signature').style.display = 'none';
                        document.getElementById('signature-uploader').style.display = 'block';
                    }

                    // Remove the old signature
                    this.documentCanvas.remove(signatureObj);
                    this.documentCanvas.renderAll();
                }
            }
        }
    }

  // Setup synchronization for paraf objects
    setupParafSync(parafImg) {
        // Store original position for reference
        const originalPosition = {
            left: parafImg.left,
            top: parafImg.top,
            scaleX: parafImg.scaleX,
            scaleY: parafImg.scaleY,
            angle: parafImg.angle
        };

        // Moving event - synchronize position
        parafImg.on('moving', function() {
            const deltaX = this.left - originalPosition.left;
            const deltaY = this.top - originalPosition.top;

            // Store delta for global sync using main-app.js global variable
            if (typeof parafSyncData !== 'undefined') {
                parafSyncData[this.parafId] = {
                    deltaX: deltaX,
                    deltaY: deltaY,
                    scaleDeltaX: this.scaleX - originalPosition.scaleX,
                    scaleDeltaY: this.scaleY - originalPosition.scaleY,
                    angle: this.angle - originalPosition.angle,
                    originalPosition: originalPosition
                };
            }
        });

        // Scaling event - synchronize size
        parafImg.on('scaling', function() {
            if (typeof parafSyncData !== 'undefined' && parafSyncData[this.parafId]) {
                parafSyncData[this.parafId].scaleDeltaX = this.scaleX - originalPosition.scaleX;
                parafSyncData[this.parafId].scaleDeltaY = this.scaleY - originalPosition.scaleY;
            }
        });

        // Rotation event - synchronize rotation
        parafImg.on('rotating', function() {
            if (typeof parafSyncData !== 'undefined' && parafSyncData[this.parafId]) {
                parafSyncData[this.parafId].angle = this.angle - originalPosition.angle;
            }
        });
    }

    // Apply paraf synchronization to all pages
    syncParafToAllPages(parafData) {
        if (!parafData) return;

        // This will be called when navigating to different pages
        // The actual implementation will be in main-app.js
        if (window.onParafSyncUpdate) {
            window.onParafSyncUpdate(parafData);
        }
    }

    // Delete selected object
    deleteSelected() {
        const activeObject = this.documentCanvas.getActiveObject();
        if (activeObject && activeObject.type === 'image' && activeObject !== this.documentCanvas.getObjects()[0]) {
            this.documentCanvas.remove(activeObject);
            this.documentCanvas.renderAll();
        }
    }

    // Export canvas as PNG
    exportAsPNG(filename, multiplier = 2) {
        const dataURL = this.documentCanvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: multiplier,
            backgroundColor: 'white'
        });
        
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = dataURL;
        link.click();
    }

    // Export canvas as JPG
    exportAsJPG(filename, multiplier = 2) {
        const dataURL = this.documentCanvas.toDataURL({
            format: 'jpeg',
            quality: 0.9,
            multiplier: multiplier,
            backgroundColor: 'white'
        });
        
        const link = document.createElement('a');
        link.download = `${filename}.jpg`;
        link.href = dataURL;
        link.click();
    }

    // Get canvas data for PDF export
    getCanvasImageData(format = 'jpeg', quality = 0.9) {
        return this.documentCanvas.toDataURL(`image/${format}`, quality);
    }

    // Get canvas dimensions
    getCanvasDimensions() {
        return {
            width: this.documentCanvas.width,
            height: this.documentCanvas.height
        };
    }

    // Add touch support for mobile devices
    enableTouchSupport() {
        if ('ontouchstart' in window && this.documentCanvas) {
            this.documentCanvas.on('touch:gesture', function(e) {
                e.e.preventDefault();
                e.e.stopPropagation();
            });
        }
    }

    // Get current signature
    getCurrentSignature() {
        return this.currentSignature;
    }

    // Set current signature
    setCurrentSignature(signature) {
        this.currentSignature = signature;
    }

    // Check if signature canvas has content
    hasSignatureContent() {
        return this.signatureCanvas && this.signatureCanvas.getObjects().length > 0;
    }

    // Check if document canvas exists
    hasDocumentCanvas() {
        return this.documentCanvas !== null;
    }
}