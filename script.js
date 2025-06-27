document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card-full');
    const modal = document.getElementById('projectModal');
    const closeButton = document.querySelector('.close-button');
    const modalProjectTitle = document.getElementById('modal-project-title');
    const modalProjectDescription = document.getElementById('modal-project-description');
    const modalProjectComponents = document.getElementById('modal-project-components');
    const modalImageGallery = document.getElementById('modal-image-gallery'); // New: for the image gallery
    const modalProjectLinks = document.getElementById('modal-project-links');

    // Parse project data from the hidden script tag
    const projectDataScript = document.getElementById('projectData');
    const projects = JSON.parse(projectDataScript.textContent);

    // Function to open the modal
    const openModal = (projectId) => {
        const project = projects.find(p => p.id === projectId);

        if (project) {
            modalProjectTitle.textContent = project.title;
            modalProjectDescription.textContent = project.description;
            modalProjectComponents.textContent = project.components;

            // Clear previous gallery images
            modalImageGallery.innerHTML = '';
            // Add gallery images
            if (project.gallery_images && project.gallery_images.length > 0) {
                project.gallery_images.forEach(imageSrc => {
                    const img = document.createElement('img');
                    img.src = imageSrc;
                    img.alt = project.title + " screenshot";
                    modalImageGallery.appendChild(img);
                });
            } else {
                // Fallback: If no gallery images, show card image (optional)
                const img = document.createElement('img');
                img.src = project.card_image;
                img.alt = project.title + " screenshot";
                modalImageGallery.appendChild(img);
            }


            // Clear previous links
            modalProjectLinks.innerHTML = '';

            // Add GitHub link if available
            if (project.github_link) {
                const githubLink = document.createElement('a');
                githubLink.href = project.github_link;
                githubLink.target = '_blank';
                githubLink.textContent = 'View on GitHub';
                modalProjectLinks.appendChild(githubLink);
            }

            // Add Live Demo link if available
            if (project.live_link) {
                const liveLink = document.createElement('a');
                liveLink.href = project.live_link;
                liveLink.target = '_blank';
                liveLink.textContent = 'Live Demo';
                modalProjectLinks.appendChild(liveLink);
            }

            modal.style.display = 'flex'; // Use flex to center the modal
            setTimeout(() => { // Add active class after display block/flex to trigger transition
                modal.classList.add('active');
            }, 10);
        }
    };

    // Function to close the modal
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => { // Hide completely after transition
            modal.style.display = 'none';
        }, 300); // Match transition duration
    };

    // Event listeners for opening modal
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.dataset.projectId;
            openModal(projectId);
        });
    });

    // Event listener for close button
    closeButton.addEventListener('click', closeModal);

    // Event listener for clicking outside the modal content to close
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Optional: Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
