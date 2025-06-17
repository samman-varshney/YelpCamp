document.querySelector("#review-card-body").setAttribute("style", "max-height: 70vh; overflow-y: auto;");
document.getElementById('reviewform').addEventListener('submit', async (e) => {
    e.preventDefault(); // prevent page reload
    // console.log(e);
    const form = e.target;
    // console.log(form);
    const formData = new FormData(form);
    // console.log(formData);
    const body = Object.fromEntries(formData.entries());
    // console.log(body);
    // Example: /campgrounds/684488ab4fcfc3597f72abb9/show
    const pathParts = window.location.pathname.split('/');
    const campId = pathParts[2]; // 0: '', 1: 'campgrounds', 2: '<id>', 3: 'show'
    // console.log(campId);
    try {
      const res = await fetch(`/campgrounds/${campId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ review: body })
      });
    //   console.log(res);
      const result = await res.json();
        // console.log(result);
      if (res.ok) {
        document.querySelector('#customRange').value = 1; // Reset the rating slider
        document.querySelector('#floatingTextarea').value = ''; // Clear the review textarea
        // window.location.href = `/campgrounds/${result.campgroundId}/show`; // or wherever you want
       
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `<strong>Anonymous User</strong><br>
        <span class="badge bg-primary">Rating : ${result.review.rating}</span>
        <p>${result.review.body}</p><small>Created on : 5 June 20025</small>
        <% if(currentUser){%>
        <br><button id="delete-review-${result.review._id}" onclick="deleteReview('${campId}','${result.review._id}')" class="btn btn-danger btn-sm mt-1" data-review-id="${result.review._id}">Delete</button>
        <%}%>`;
        // console.log(li);
        // Append the new review to the review list
        const reviewList = document.querySelector('#review-list');
        const placeholder = reviewList.querySelector('#review-placeholder');
        if (placeholder) {
            console.log("clearing placeholder text");
            reviewList.innerHTML = '';
        } // Clear existing reviews
        document.querySelector('#review-list').appendChild(li);
        //   console.log("review appended");
      } else {
        alert(`400: ${result.message}`);
      }

    } catch (err) {
        // console.log(err);
      alert('Something went wrong');
    }
});