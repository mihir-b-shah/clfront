
function makeElement(post){
  let div = document.createElement('div');
  div.innerHTML = `<em>${post.username}</em> posted <b>${post.title}</b> at ${new Date(Number(post.timestamp)).toLocaleString()}<br><p>${post.content}</p>`;
  div.style.border = 'solid #000000';
  return div;
}

async function load(){
  const resp = await fetch("https://my-app.mihirshah-11204.workers.dev/posts");
  const postsResp = await resp.json();
  
  feed = document.getElementById('feed');
  for(const el of postsResp){
    let obj = JSON.parse(el);
    feed.appendChild(makeElement(obj));
    feed.appendChild(document.createElement('br'));
  }
}

async function runPost(user, title, content, ts){
  let obj = JSON.stringify({'username':user,'title':title,'content':content,'timestamp':ts});
  let header = {'Content-Type':'application/json'};
  await fetch('https://my-app.mihirshah-11204.workers.dev/posts', {method:'POST', headers:header, body:obj});
}

window.onload = ()=>{
  document.getElementById('submit').addEventListener("click", ()=>{
    user = document.getElementById('username').innerText;
    title = document.getElementById('title').innerText;
    content = document.getElementById('content').innerText;
    ts = String(new Date().getTime());

    runPost(user, title, content, ts);
  });
  load();
};
