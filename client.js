const form = document.getElementById('upload-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData(form);
  fetch('/upload', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      alert('Upload successful!');
    })
    .catch(error => {
      console.error(error);
      alert('Upload failed!');
    });
});