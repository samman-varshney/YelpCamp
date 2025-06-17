    async function deleteReview(campId, reviewId) {
               
           
                try {
                    const res = await fetch( `/campgrounds/${campId}/reviews/${reviewId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const result = await res.json();
                    // console.log(result);
                    if (res.ok) {
                        // Remove the review from the list
                        
                        const reviewItem = document.querySelector(`#delete-review-${reviewId}`).parentElement;
                        const reviewList = document.querySelector(`#delete-review-${reviewId}`).parentElement.parentElement;
                    
                        reviewList.removeChild(reviewItem);
                        if(reviewList.querySelectorAll('li').length === 0) {
                            reviewList.innerHTML = "<p id='review-placeholder' class='text-muted'>No reviews yet.</p>";
                        }
                    } else {
                        alert(`Error: ${result.message}`);
                    }
                } catch (err) {
                    alert('Something went wrong while deleting the review.');
                }
            }