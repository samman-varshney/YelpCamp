function disableFormButton(e) {
    document.querySelectorAll('button').forEach(btn => {
        btn.disabled = true;
    });
}
