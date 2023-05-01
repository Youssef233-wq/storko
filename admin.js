const clientList = document.getElementById('client-list');
fetch('/clients')
  .then(response => response.json())
  .then(data => {
    data.forEach(client => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${client.name}</td>
        <td>${client.email}</td>
        <td><img src="${client.imagePath}" width="100"></td>
        <td><button class="btn btn-danger delete-btn" data-id="${client.id}">Delete</button></td>
      `;
      clientList.appendChild(row);
    });
  })
  .catch(error => {
    console.error(error);
    alert('Failed to fetch client data!');
  });

clientList.addEventListener('click', function(event) {
  if (event.target.classList.contains('delete-btn')) {
    const clientId = event.target.getAttribute('data-id');
    fetch(`/clients/${clientId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        alert('Client data deleted!');
        window.location.reload();
      })
      .catch(error => {
        console.error(error);
        alert('Failed to delete client data!');
      });
  }
});