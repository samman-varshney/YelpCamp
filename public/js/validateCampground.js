document.getElementById('campgroundForm').addEventListener('submit', async (e) => {
e.preventDefault(); // prevent page reload
console.log(e);
const form = e.target;
console.log(form);
const formData = new FormData(form);
console.log(formData);
const body = Object.fromEntries(formData.entries());
console.log(body);

try {
const res = await fetch('/campgrounds/new', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({ campground: body })
});
console.log(res);
const result = await res.json();
    console.log(result);
if (res.ok) {
    
    window.location.href = `/campgrounds/${result.id}/show`; // or wherever you want
} else {
    alert(`400: ${result.message}`);
}

} catch (err) {
alert('Something went wrong');
}
});