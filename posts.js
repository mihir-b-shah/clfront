
function makeElement(post){
  let div = document.createElement('div');
  div.innerHTML = `<em>${post.username}</em> posted <b>${post.title}</b> at ${new Date(Number(post.timestamp)).toLocaleString()}<br><p>${post.content}</p>`;
  div.style.border = 'solid #000000';
  return div;
}

async function load(){
  const resp = await fetch("https://my-app.mihirshah-11204.workers.dev/posts");
  const postsResp = await resp.json();
  console.log(postsResp);
  
  feed = document.getElementById('feed');
  for(const el of postsResp){
    let obj = JSON.parse(el);
    feed.appendChild(makeElement(obj));
    feed.appendChild(document.createElement('br'));
  }
}

async function postHandler(){
  let user = document.getElementById('username').value;
  let title = document.getElementById('title').value;
  let content = document.getElementById('content').value;

  let body = JSON.stringify({'username':user, 'title':title, 'content':content});
  let header = {'Content-Type': 'text/plain'};
  await fetch('https://my-app.mihirshah-11204.workers.dev/posts', {
    method: 'POST',
    headers: header,
    body: body
  });
}

window.onload = ()=>{
  document.getElementById('submit').addEventListener('click', ()=>{
    postHandler();
  });
  load();
};
