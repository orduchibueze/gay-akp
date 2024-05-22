document.getElementById('chatForm').addEventListener('submit', function (e) {
    e.preventDefault();
    socket.emit('chat message', document.getElementById('message').value);
    document.getElementById('message').value = '';
    return false;
  });
  
  socket.on('chat message', function (msg) {
    const item = document.createElement('div');
    item.textContent = msg;
    document.getElementById('messages').appendChild(item);
  });
  
  function likePost(postId) {
    fetch(`/post/like/${postId}`, {
      method: 'POST'
    }).then(() => {
      location.reload();
    });
  }
  