
function reload(){
  window.location.reload(false);
}

function validURL(s){
  if(!s.match(/^https?:\/\/.*$/)){
    return false;
  }
  try {
    let url = new URL(s);
    return true;
  } catch(_) {
    return false;
  }
}

function render(content){
  return content.split(/\s+/).map((el) => {
    if(validURL(el)){
      // regular link
      return `<a href="${el}">${el}</a>`
    } else if(el.substring(0,4) == 'vid/' && validURL(el.substring(4))){
      // embedded in iframe
      return `<br><iframe src="${el.substring(4)}"></iframe><br>`
    } else if(el.substring(0,4) == 'img/' && validURL(el.substring(4))){
      // embedded in iframe
      return `<br><img style="max-height:150px" src="${el.substring(4)}"></img><br>`
    } else {
      // regular text
      return el
    }
  }).join(' ');
}

function makeElement(post, i){
  let div = document.createElement('div');
  div.innerHTML = `<em>${post.username}</em> posted <b>${post.title}</b> at ${new Date(Number(post.timestamp)).toLocaleString()}<br><button id="up${i}" style="border:4px solid #00FF00">${post.upvotes}</button><button id="down${i}" style="border:4px solid #FF0000">${post.downvotes}</button><br><br><div>${render(post.content)}</div>`;
  div.style.border = 'solid #000000';
  return div;
}

async function buttonUpdater(obj, fields, fieldIdx){
  let newObj = Object.assign({}, obj);
  newObj[fields[fieldIdx]] = String(1);
  newObj[fields[1-fieldIdx]] = String(0);

  await fetch('https://my-app.mihirshah-11204.workers.dev/posts', {
    method: 'POST',
    headers: {'Content-Type':'text/plain'},
    body: JSON.stringify(newObj)
  });
  
  reload();
}

async function load(){
  const resp = await fetch("https://my-app.mihirshah-11204.workers.dev/posts");
  const postsResp = await resp.json();
  
  fields = ['upvotes', 'downvotes'];
  feed = document.getElementById('feed');
  let ctr = 0;

  for(const el of postsResp){
    let obj = JSON.parse(el);
    feed.appendChild(makeElement(obj, ctr));

    document.getElementById(`up${ctr}`).addEventListener('click', ()=>{
      buttonUpdater(obj, fields, 0);
    });
    document.getElementById(`down${ctr}`).addEventListener('click', ()=>{
      buttonUpdater(obj, fields, 1);
    });

    feed.appendChild(document.createElement('br'));
    ctr += 1;
  }
}

async function postHandler(){
  let user = document.getElementById('username');
  let title = document.getElementById('title');
  let content = document.getElementById('content');

  let body = JSON.stringify({'username':user.value, 'title':title.value, 'content':content.value});
  let header = {'Content-Type': 'text/plain'};
  const resp = await fetch('https://my-app.mihirshah-11204.workers.dev/posts', {
    method: 'POST',
    headers: header,
    body: body
  });
  
  if(resp.ok){
    // clear the fields, trigger reload
    reload();
  } else {
    // display error
    document.getElementById("confirmation").innerText = "Error in submitting post.";
  }

}

window.onload = ()=>{
  document.getElementById('submit').addEventListener('click', ()=>{
    postHandler();
  });
  load();
};
